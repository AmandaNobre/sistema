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

  controlFilter: UntypedFormGroup = this.fb.group({
    form: '',
    t1: '',
    t2: '',
    t3: ''
  })

  controlReject: UntypedFormGroup = this.fb.group({
    files: '',
    description: ''
  })


  formmFilter: IForm[] = []
  formmReject: IForm[] = [
    { label: 'Anexos: ', col: 'col-lg-6', type: 'upload-files', formControl: 'files' },
    { label: 'Descrição: ', col: 'col-lg-6', type: 'text-area', formControl: 'description' },

  ]

  buttonsStandard: IButtonsStandard[] = []
  buttonsOptions: IButtonsOptions[] = []

  buttonsStandardReject: IButtonsStandard[] = [
    { type: 'cancel', onCLick: () => this.return() },
    { type: 'save', onCLick: () => this.confirmReject() }
  ]

  options: IOptions[] = []

  visible: boolean = false

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
      this.formmFilter = [
        { label: 'Tipo de Solicitação', col: 'col-lg-6', type: 'select', options: this.options, formControl: 'form', disabled: this.type == "view" }
      ]
    })

    if (this.id) {
      this.service.getById(this.id).subscribe(data => {
        var form = data as any
        this.controlFilter = this.fb.group({
          form: form[0].formResponse.form,
          t1: new FormControl({ value: form[0].formResponse.t1, disabled: this.type == "view" }),
          t2: new FormControl({ value: form[0].formResponse.t2, disabled: this.type == "view" }),
          t3: new FormControl({ value: form[0].formResponse.t3, disabled: this.type == "view" })
        })
        this.chageValues()
      })

    }

    if (this.type == 'view') {
      this.buttonsOptions = [
        { label: "Voltar", icon: "pi pi-angle-left", onCLick: () => this.return(), styleClass: "p-button-warning" },
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

  confirmReject(){
    var payload = {
      type: this.controlFilter.value.form.descricao,
      formResponse: this.controlFilter.value,
      user: "teste",
      status: "Reprovada"
    }

    this.service.editRequest(payload, this.id).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Sucesso ao editar requisição' });
        this.return()
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
          type: this.controlFilter.value.form.descricao,
          formResponse: this.controlFilter.value,
          user: "teste",
          status: "Aprovada"
        }

        this.service.editRequest(payload, this.id).subscribe({
          next: () => {
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Sucesso ao editar requisição' });
            this.return()
          }
        })
        this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Confirmação aprovada com sucesso!' });
        this.return()
      }
    });
  }


  chageValues() {
    if (this.controlFilter.value.form) {
      this.formmFilter = [
        { label: 'Tipo de Solicitação', col: 'col-lg-12', type: 'select', options: this.options, formControl: 'form', disabled: this.type == "view" }
      ]
      var form = this.controlFilter.value.form
      if (form.id == 1) {
        this.formmFilter.push(
          { label: 'Nome: ', col: 'col-lg-6', type: 'text', formControl: 't1', disabled: this.type == "view" },
          { label: 'Descrição: ', col: 'col-lg-6', type: 'text', formControl: 't2', disabled: this.type == "view" },
        )
      } else if (form.id == 2) {
        this.formmFilter.push(
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
      type: this.controlFilter.value.form.descricao,
      formResponse: this.controlFilter.value,
      user: "teste",
      status: "Solicitada"
    }



    if (this.id) {
      this.service.editRequest(payload, this.id).subscribe({
        next: () => {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Sucesso ao editar requisição' });
          this.return()
        }
      })
    } else {
      this.service.saveRequest(payload).subscribe({
        next: () => {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Sucesso ao cadastrar requisição' });
          this.return()
        }
      })
    }


  }

  return() {
    this.router.navigate([`/pages/request`], { relativeTo: this.route })

  }
}
