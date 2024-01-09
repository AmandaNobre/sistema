import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormControl, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { IButtonsOptional, IButtonsStandard, IForm, IOptions } from 'form-dynamic-angular';
import { RequestService } from '../../../services/request.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { IDataForm, IDataFormById, IRequisition } from 'src/app/interface';
import { FormService } from 'src/app/services/form.service';

@Component({
  selector: 'app-form-request',
  styleUrls: ['./form.component.css'],
  templateUrl: './form.component.html'
})

export class FormComponent {
  id: number = 0
  type: string = ''

  control: UntypedFormGroup = this.fb.group({
    form: '',
  })

  controlReject: UntypedFormGroup = this.fb.group({
    files: '',
    description: ''
  })

  form: IForm[] = []

  controlSelected: UntypedFormGroup = this.fb.group({})
  formSelected: IForm[] = []

  validateForm: boolean = false;

  titleFormSelected: string = ''

  formmReject: IForm[] = [
    { label: 'Anexos: ', col: 'col-lg-12', type: 'upload-files', formControl: 'files' },
    { label: 'Descrição: ', col: 'col-lg-12', type: 'text-area', formControl: 'description' },

  ]

  buttonsStandard: IButtonsStandard[] = []
  buttonsOptional: IButtonsOptional[] = []

  buttonsStandardReject: IButtonsStandard[] = [
    { type: 'cancel', onCLick: () => this.return() },
    { type: 'save', onCLick: () => this.confirmReject() }
  ]

  options: IOptions[] = []

  visible: boolean = false
  title: string = "Cadastrar"

  constructor(
    private fb: UntypedFormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private requestService: RequestService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private formService: FormService
  ) {
    this.route.params.subscribe(params => this.id = params['id']);
    this.route.params.subscribe(params => this.type = params['type']);
  }

  ngOnInit() {
    this.formService.getAll().subscribe(({ data }: IDataForm) => {
      this.options = data.map(d => ({ ...d, descricao: d.title }))
      this.form = [
        { label: 'Tipo de Solicitação', col: 'col-lg-6', type: 'select', options: this.options, formControl: 'form', disabled: this.type == "view" }
      ]
    })

    if (this.id) {
      this.requestService.getById(this.id).subscribe(data => {
        var form = data as any
        this.control.controls['form'].setValue(this.options.filter(o => o.id === form[0].formId)[0])
        this.chageValues(form[0].controlResponse)
      })
      this.title = "Editar"
      if (this.type == "view") {
        this.title = "Visualizar"
      }

    }

    if (this.type == 'view') {
      this.buttonsOptional = [
        // { label: "Voltar", icon: "pi pi-angle-left", onCLick: () => this.return(), styleClass: "p-button-warning" },
        { label: "Reprovar", icon: "pi pi-times", onCLick: () => this.reject(), styleClass: "p-button-danger" },
        { label: "Aprovar", icon: "pi pi-check", onCLick: () => this.aprove(), styleClass: "p-button-success" },
      ]
    } else {
      this.buttonsStandard = [
        { type: 'cancel', onCLick: () => this.return() },
        { type: 'save', onCLick: () => this.saveRequest() }
      ]
    }
  }

  reject() {
    this.visible = true;
  }

  confirmReject() {
    var payload = {
      type: this.control.value.form.descricao,
      user: "teste",
      status: "Reprovada"
    }

    this.requestService.editRequest(payload, this.id).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Sucesso ao editar requisição' });
        setTimeout(() => this.return(), 2000);
      }
    })
  }

  aprove() {
    this.confirmationService.confirm({
      message: 'Certeza que deseja aprovar solicitação',
      header: 'Confirmação',
      icon: 'pi pi-exclamation-triangle',
      rejectButtonStyleClass: "p-button-text",
      acceptLabel: "Sim",
      rejectLabel: "Não",
      accept: () => {
        var payload = {
          type: this.control.value.form.descricao,
          user: "teste",
          status: "Aprovada"
        }

        this.requestService.editRequest(payload, this.id).subscribe({
          next: () => {
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Sucesso ao editar requisição' });
            setTimeout(() => this.return(), 2000);
          }
        })
        this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Confirmação aprovada com sucesso!' });
        setTimeout(() => this.return(), 2000);

      }
    });
  }


  chageValues(formResponse?: any) {
    var control = this.control.value.form
    this.formService.getById(control.id).subscribe(({ data }: IDataFormById) => {
      let formValid = {}
      this.titleFormSelected = data.title
      this.formSelected = JSON.parse(data.form)

      if (formResponse) {
        this.formSelected.map((form: any) => (
          formValid = Object.assign(formValid, { [form.formControl]: form.required ? new FormControl(formResponse[form.formControl], Validators.required) : new FormControl(formResponse[form.formControl]) })
        ))
      } else {
        this.formSelected.map((form: any) => (
          formValid = Object.assign(formValid, { [form.formControl]: form.required ? new FormControl('', Validators.required) : new FormControl('') })
        ))
      }

      this.controlSelected = this.fb.group(formValid)
    })

  }

  clickNew() {
    this.router.navigate([`register`], { relativeTo: this.route })
  }

  saveRequest() {
    this.validateForm = true

    if (this.controlSelected.status === "VALID") {
      this.validateForm = false
      var payload: IRequisition = {
        formId: this.control.value.form.id,
        controlResponse: JSON.stringify(this.controlSelected.value),
        approvers: ['f55cbd88-8e00-4709-b53a-758d585d7a56']
      }

      if (this.id) {
        this.requestService.editRequest(payload, this.id).subscribe({
          next: () => {
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Sucesso ao editar requisição' });
            setTimeout(() => this.return(), 2000);
          }
        })
      } else {
        this.requestService.save(payload).subscribe({
          next: () => {
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Sucesso ao cadastrar requisição' });
            setTimeout(() => this.return(), 2000);
          }
        })
      }
    }
  }

  return() {
    this.router.navigate([`/pages/request`], { relativeTo: this.route })

  }
}
