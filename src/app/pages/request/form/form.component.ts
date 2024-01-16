import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormControl, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { IButtonsOptional, IButtonsStandard, IForm, IOptions } from 'form-dynamic-angular';
import { RequestService } from '../../../services/request.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { IAproveOrReject, IDataForm, IDataFormById, IDataRequisitionById, IDataUser, IRequisitionSave, IUser } from 'src/app/interface';
import { FormService } from 'src/app/services/form.service';
import { UserService } from 'src/app/services/user.service';
import { OverlayPanel } from 'primeng/overlaypanel';

@Component({
  selector: 'app-form-request',
  styleUrls: ['./form.component.css'],
  templateUrl: './form.component.html'
})

export class FormComponent {
  id: string = ''
  type: string = ''
  hierarchy: any = []
  control: UntypedFormGroup = this.fb.group({
    form: '',
  })

  controlReject: UntypedFormGroup = this.fb.group({
    files: '',
    description: ''
  })

  filteredAutoComplete: any[] = [];

  form: IForm[] = []

  controlSelected: UntypedFormGroup = this.fb.group({})
  formSelected: IForm[] = []

  validateForm: boolean = false;

  titleFormSelected: string = ''
  descriptionFormSelected: string = ''
  sigleFormSelected: string = ''

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
  users: IUser[] = []

  constructor(
    private fb: UntypedFormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private requestService: RequestService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private formService: FormService,
    private userService: UserService
  ) {
    this.route.params.subscribe(params => this.id = params['id']);
    this.route.params.subscribe(params => this.type = params['type']);
  }
  filterAutoComplete(event: { query: any; }) {
    let filtered: any[] = [];
    let query = event.query;

    if (this.users) {
      for (let i = 0; i < this.users.length; i++) {
        let dados = this.users[i];
        if (dados.name.toLowerCase().indexOf(query.toLowerCase()) == 0) {
          filtered.push(dados);
        }
      }

      this.filteredAutoComplete = filtered;
    }
  }

  onChangevalues(event: any, index: any, op: OverlayPanel) {
    this.hierarchy[index] = { ...this.hierarchy[index], ...event }
    op.hide();
  }

  ngOnInit() {
    this.userService.getAll().subscribe(({ data }: IDataUser) => (
      this.users = data
    ))

    this.formService.getAll().subscribe(({ data }: IDataForm) => {
      this.options = data.map(d => ({ ...d, descricao: d.title }))
      this.form = [
        { label: 'Tipo de Solicitação', col: 'col-lg-6', type: 'select', options: this.options, formControl: 'form', disabled: this.type == "view" }
      ]
    })

    if (this.id) {
      this.requestService.getById(this.id).subscribe(({ data }: IDataRequisitionById) => {
        this.control.controls['form'].setValue(this.options.filter(o => o.id === data.customFormId)[0])
        this.chageValues(data.controlResponse)
      })
      if (this.type == "view") {
        this.title = "Visualizar"
      }

    }

    if (this.type == 'view') {
      this.buttonsOptional = [
        { label: "Reprovar", icon: "pi pi-times", onCLick: () => this.reject(), styleClass: "p-button-warning" },
        { label: "Aprovar", icon: "pi pi-check", onCLick: () => this.aproveOrCancel("aprovar"), styleClass: "p-button-success" },
        { label: "Cancelar", icon: "pi pi-close", onCLick: () => this.aproveOrCancel("cancelar"), styleClass: "p-button-danger" },
      ]
    } else {
      this.buttonsStandard = [
        { type: 'cancel', onCLick: () => this.return(), styleClass: 'p-button-outlined' },
        { type: 'save', onCLick: () => this.saveRequest(), styleClass: 'p-button-outlined' }
      ]
    }
  }

  reject() {
    this.visible = true;
  }

  confirmReject() {
    var payload: IAproveOrReject = {
      id: this.id,
      requisitionId: this.id,
      approverId: "6B7055DA-9BC7-4FC9-B4F8-FD5849E51A14"
    }

    this.requestService.approveOrReject(payload, "Reject").subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Sucesso ao editar requisição' });
        setTimeout(() => this.return(), 2000);
      },
      error: ({ error }) => {
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: error.Extensions.erroDetail.Message });
      }
    })
  }

  aproveOrCancel(type: string) {
    this.confirmationService.confirm({
      message: `Certeza que deseja ${type} solicitação`,
      header: 'Confirmação',
      icon: 'pi pi-exclamation-triangle',
      rejectButtonStyleClass: "p-button-text",
      acceptLabel: "Sim",
      rejectLabel: "Não",
      accept: () => {
        var payload: IAproveOrReject = {
          id: this.id,
          requisitionId: this.id,
          approverId: "6B7055DA-9BC7-4FC9-B4F8-FD5849E51A14"
        }

        this.requestService.approveOrReject(payload, type === "aprovar" ? "Approve" : "Cancel").subscribe({
          next: () => {
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Sucesso ao editar requisição' });
            setTimeout(() => this.return(), 2000);
          },
          error: ({ error }) => {
            this.messageService.add({ severity: 'error', summary: 'Erro', detail: error.Extensions.erroDetail.Message });
          }
        })
      }
    });
  }


  chageValues(formResponse?: any) {
    var control = this.control.value.form
    this.formService.getById(control.id).subscribe(({ data }: IDataFormById) => {
      let formValid = {}
      this.titleFormSelected = data.title
      this.descriptionFormSelected = data.description
      this.sigleFormSelected = data.controlCreatedForm.sigle
      this.formSelected = data.form
      this.hierarchy = data.hierarchy
      if (formResponse) {
        this.formSelected.map((form: any) => (
          formValid = Object.assign(formValid, { [form.formControl]: form.required ? new FormControl({ value: formResponse[form.formControl], disabled: true }, Validators.required) : new FormControl({ value: formResponse[form.formControl], disabled: true }) })
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
      var payload: IRequisitionSave = {
        requesterId: "6B7055DA-9BC7-4FC9-B4F8-FD5849E51A14",
        formId: this.control.value.form.id,
        controlResponse: JSON.stringify(this.controlSelected.value),
        approvers: this.hierarchy.map((h: { id: any; }) => h.id)
      }

      this.requestService.save(payload).subscribe({
        next: (sucess: any) => {
          console.log('sucess', sucess)
          this.confirmationService.confirm({
            message: `Código da requisição: ${sucess.code}`,
            acceptLabel: "OK",
            icon: "pi pi-info-circle",
            rejectVisible: false,
            acceptButtonStyleClass: 'p-button-outlined p-button-sm',
            accept: () => {
              this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Sucesso ao cadastrar requisição' });
              setTimeout(() => this.return(), 2000);
            }
          });
        },
        error: ({ error }) => {
          console.log('error', error)
          this.messageService.add({ severity: 'error', summary: 'Erro', detail: error.Extensions.erroDetail.Message });
        }
      })

    }
  }

  return() {
    this.router.navigate([`/pages/request`], { relativeTo: this.route })

  }
}
