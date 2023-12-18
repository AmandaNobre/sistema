import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormControl, UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { IButtonsOptions, IButtonsStandard, IForm, IOptions } from 'form-dynamic-angular';
import { RequestService } from '../service/request.service';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'app-form-request',
  templateUrl: './form.component.html'
})

export class FormComponent {
  id: number = 0
  type: string = ''

  control: UntypedFormGroup = this.fb.group({
    form: '',
    t1: '',
    t2: '',
    t3: ''
  })

  controlReject: UntypedFormGroup = this.fb.group({
    files: '',
    description: ''
  })


  form: IForm[] = []
  formmReject: IForm[] = [
    { label: 'Anexos: ', col: 'col-lg-12', type: 'upload-files', formControl: 'files' },
    { label: 'Descrição: ', col: 'col-lg-12', type: 'text-area', formControl: 'description' },

  ]

  buttonsStandard: IButtonsStandard[] = []
  buttonsOptions: IButtonsOptions[] = []

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
    private service: RequestService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {
    this.route.params.subscribe(params => this.id = params['id']);
    this.route.params.subscribe(params => this.type = params['type']);
  }

  ngOnInit() {
    this.service.getAllForms().subscribe(data => {
      this.options = data as IOptions[]
      this.form = [
        { label: 'Tipo de Solicitação', col: 'col-lg-6', type: 'select', options: this.options, formControl: 'form', disabled: this.type == "view" }
      ]
    })

    if (this.id) {
      this.service.getById(this.id).subscribe(data => {
        var form = data as any
        this.control = this.fb.group({
          form: form[0].formResponse.form,
          t1: new FormControl({ value: form[0].formResponse.t1, disabled: this.type == "view" }),
          t2: new FormControl({ value: form[0].formResponse.t2, disabled: this.type == "view" }),
          t3: new FormControl({ value: form[0].formResponse.t3, disabled: this.type == "view" })
        })
        this.chageValues()
      })
      this.title = "Editar"

      if(this.type == "view"){
        this.title = "Visualizar"
      }

    }

    if (this.type == 'view') {
      this.buttonsOptions = [
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
      formResponse: this.control.value,
      user: "teste",
      status: "Reprovada"
    }

    this.service.editRequest(payload, this.id).subscribe({
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
          formResponse: this.control.value,
          user: "teste",
          status: "Aprovada"
        }

        this.service.editRequest(payload, this.id).subscribe({
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


  chageValues() {
    if (this.control.value.form) {
      this.form = [
        { label: 'Tipo de Solicitação', col: 'col-lg-12', type: 'select', options: this.options, formControl: 'form', disabled: this.type == "view" }
      ]
      var form = this.control.value.form
      if (form.id == 2) {
        this.form.push(
          { label: 'Nome: ', col: 'col-lg-6', type: 'text', formControl: 't1', disabled: this.type == "view" },
          { label: 'Descrição: ', col: 'col-lg-6', type: 'text', formControl: 't2', disabled: this.type == "view" },
        )
      } else if (form.id == 1) {
        this.form.push(
          { label: 'Tipo de Acesso: ', col: 'col-lg-12', type: 'text', formControl: 't1', disabled: this.type == "view" },
          { label: 'Motivo do Acesso: ', col: 'col-lg-12', type: 'text', formControl: 't2', disabled: this.type == "view" },
          { label: 'Email: ', col: 'col-lg-12', type: 'text', formControl: 't3', disabled: this.type == "view" },
        )
      } else {

      }
    }
  }

  clickNew() {
    this.router.navigate([`register`], { relativeTo: this.route })
  }

  saveRequest() {
    var payload = {
      type: this.control.value.form.descricao,
      formResponse: this.control.value,
      user: "teste",
      status: "Solicitada"
    }



    if (this.id) {
      this.service.editRequest(payload, this.id).subscribe({
        next: () => {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Sucesso ao editar requisição' });
          setTimeout(() => this.return(), 2000);
        }
      })
    } else {
      this.service.saveRequest(payload).subscribe({
        next: () => {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Sucesso ao cadastrar requisição' });
          setTimeout(() => this.return(), 2000);
        }
      })
    }


  }

  return() {
    this.router.navigate([`/pages/request`], { relativeTo: this.route })

  }
}
