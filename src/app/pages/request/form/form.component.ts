import { ActivatedRoute, Router } from '@angular/router';
import { Component } from '@angular/core';
import { FormControl, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { IButtonsOptional, IButtonsStandard, IForm, IOptions } from 'form-dynamic-angular';
import { RequestService } from '../../../services/request.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { IAproveOrReject, IDataForm, IDataFormById, IDataRequisitionById, IDataUser, IOptionsIntegration, IRequisitionSave, IUser } from 'src/app/interface';
import { FormService } from 'src/app/services/form.service';
import { UserService } from 'src/app/services/user.service';
import { OverlayPanel } from 'primeng/overlaypanel';
import { AuthenticationService } from 'src/app/services/authentication.service';

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
    {
      label: 'Anexos: ', col: 'col-lg-12', type: 'upload-files', formControl: 'files', acceptFiles: "image/*, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/pdf, application/msword"
    },
    { label: 'Descrição: ', col: 'col-lg-12', type: 'text-area', formControl: 'description' },
  ]

  buttonsStandard: IButtonsStandard[] = []
  buttonsOptional: IButtonsOptional[] = []

  buttonsStandardReject: IButtonsStandard[] = [
    { type: 'cancel', onCLick: () => this.return(), styleClass: "p-button-outlined" },
    { type: 'save', onCLick: () => this.confirmReject(), styleClass: "p-button-outlined" }
  ]

  options: IOptions[] = []
  visible: boolean = false
  title: string = "Cadastrar"
  users: IUser[] = []

  userId: string = ''

  isFormExternal: boolean = false
  formView: any = {}

  viewInputs: IOptionsIntegration[] = [
    { label: "Requisição", value: "requisition" },
    { label: "Establelecimento", value: "establishment" },
    { label: "Requisitante", value: "requester" },
    { label: "Lotação", value: "capacity" },
    { label: "Data da Requisição", value: "requestData" },
    { label: "Local de Entrega", value: "deliveryPlace" },
    { label: "Tipo de Requisição", value: "typeOfRequest" }
  ]

  infoRequestSaleItens: IOptionsIntegration[] = [
    { label: "Seq:", value: "seq" },
    { label: "UM:", value: "um" },
    { label: "Valor Unitário:", value: "unitValue" },
    { label: "Item:", value: "item" },
    { label: "Qtd. requisitada:", value: "qtdRequested" },
    { label: "Valor Total:", value: "totalValue" },
    { label: "Qtd. atender:", value: "qtdToMeet" }
  ]

  infoRequestSaleItensMore: IOptionsIntegration[] = [
    { label: "Referência:", value: "reference" },
    { label: "Urgente:", value: "urgent" },
    { label: "Prioridade:", value: "priority" },
    { label: "Conta:", value: "account" },
    { label: "Centro de custo:", value: "costCenter" },
    { label: "Narrativa:", value: "narrative" },
    { label: "Data Entrega:", value: "deliveryDate" },
    { label: "Homologa Fornecedor:", value: "supplierApproval" },
    { label: "Código Utilização:", value: "codeUsage" },
    { label: "Ordem invest:", value: "investOrder" },
    { label: "Afeta Qualidade:", value: "affectsQuality" },

  ]

  constructor(
    private fb: UntypedFormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private requestService: RequestService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private formService: FormService,
    private userService: UserService,
    private authenticationService: AuthenticationService
  ) {
    this.route.params.subscribe(params => this.id = params['id']);
    this.route.params.subscribe(params => this.type = params['type']);
    this.userId = JSON.parse(this.authenticationService.getLoggedUser()).id
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

  getKey(object: any) {
    return Object.keys(object)[0]
  }

  ngOnInit() {
    if (this.type == "view") {
      this.title = "Visualizar"
    }

    this.userService.getAll().subscribe(({ data }: IDataUser) => (
      this.users = data
    ))

    const formoptions = new Promise((resolve, reject) => {
      this.formService.getAll().subscribe(({ data }: IDataForm) => {
        this.options = data.map(d => ({ ...d, descricao: d.title }))
        resolve(this.form = [
          { label: 'Tipo de Solicitação', col: 'col-lg-6', type: 'select', options: this.options, formControl: 'form', disabled: this.type == "view" }
        ]
        )
      })
    });

    Promise.all([formoptions]).then((values) => {
      if (this.id) {
        this.requestService.getById(this.id).subscribe(({ data }: IDataRequisitionById) => {
          this.hierarchy = data.approvers.map(a => ({
            name: a.approverName
          }))
          this.control.controls['form'].setValue(this.options.filter(o => o.id === data.customFormId)[0])

          this.formView = data.controlResponse

          if (!data.customFormId) {
            this.isFormExternal = true
          }


          if (data.actions.approve) {
            this.buttonsOptional.push(
              { label: "Aprovar", icon: "pi pi-check", onCLick: () => this.aproveOrCancel("aprovar"), styleClass: "p-button-success p-button-outlined" },
            )
          }
          if (data.actions.reject) {
            this.buttonsOptional.push(
              { label: "Reprovar", icon: "pi pi-times", onCLick: () => this.reject(), styleClass: "p-button-warning p-button-outlined" },
            )
          }
          if (data.actions.cancel) {
            this.buttonsOptional.push(
              { label: "Cancelar", icon: "pi pi-times", onCLick: () => this.aproveOrCancel("cancelar"), styleClass: "p-button-danger p-button-outlined" },
            )
          }

        })
      } else {
        this.buttonsStandard = [
          { type: 'cancel', onCLick: () => this.return(), styleClass: 'p-button-outlined' },
          { type: 'save', onCLick: () => this.saveRequest(), styleClass: 'p-button-outlined' }
        ]
      }
    });
  }

  istypeof(text: string) {
    return typeof (text)
  }

  reject() {
    this.visible = true;
  }

  confirmReject() {
    var payload: IAproveOrReject = {
      id: this.id,
      requisitionId: this.id,
      approverId: this.userId,
      requesterId: this.userId,
      comment: this.controlReject.value.description,
      attachments: this.controlReject.value.files
    }

    this.requestService.approveOrReject(payload, "Reject").subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Sucesso ao rejeitar requisição' });
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
          approverId: this.userId,
          requesterId: this.userId,
          comment: this.controlReject.value.description,
          attachments: this.controlReject.value.files
        }

        this.requestService.approveOrReject(payload, type === "cancelar" ? "Cancel" : "Approve").subscribe({
          next: () => {
            this.messageService.add({ severity: 'success', summary: 'Success', detail: `Sucesso ao ${type} requisição` });
            setTimeout(() => this.return(), 2000);
          },
          error: ({ error }) => {
            this.messageService.add({ severity: 'error', summary: 'Erro', detail: error.Extensions.erroDetail.Message });
          }
        })
      }
    });
  }


  chageValues() {
    var control = this.control.value.form
    var data: any

    const dataPromise = new Promise((resolve, reject) => {
      this.formService.getById(control.id).subscribe(({ data }: IDataFormById) => {
        resolve(data = data)
      })
    });

    Promise.all([dataPromise]).then((values) => {
      data = values[0]
      let formValid = {}
      this.titleFormSelected = data.title
      this.descriptionFormSelected = data.description
      this.sigleFormSelected = data.controlCreatedForm.sigle
      this.formSelected = data.form
      this.hierarchy = this.hierarchy.length == 0
        ? data.hierarchy
        : this.hierarchy.map((h: any, index: number) => ({
          ...h,
          ...data.hierarchy[index]
        }))

      this.formSelected.map((form: any) => (
        formValid = Object.assign(formValid, { [form.formControl]: form.required ? new FormControl('', Validators.required) : new FormControl('') })
      ))

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
      let controlResponseFormated: any[] = []
      this.formSelected.map(f => {
        let value = this.controlSelected.value[f.formControl ?? ""]
        controlResponseFormated.push({
          [f.label ?? ""]: typeof (value) == 'object' ? value.descricao : value
        })
      })

      var payload: IRequisitionSave = {
        requesterId: this.userId,
        formId: this.control.value.form.id,
        controlResponse: JSON.stringify(controlResponseFormated),
        approvers: this.hierarchy.map((h: { id: any; }) => h.id)
      }

      this.requestService.save(payload).subscribe({
        next: (sucess: any) => {
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
          this.messageService.add({ severity: 'error', summary: 'Erro', detail: error.Extensions.erroDetail.Message });
        }
      })
    }
  }

  return() {
    this.router.navigate([`/pages/request`], { relativeTo: this.route })
  }

  seeMore(index: any) {
    let maisTexto = document.getElementById(`mais${index}`);
    let btnVermais = document.getElementById(`btnVerMais${index}`);

    if (maisTexto && btnVermais) {
      if (maisTexto.style.display !== "none") {
        maisTexto.style.display = "none";
        btnVermais.innerHTML = `Ver Mais <i class="pi pi-angle-down"></i>`;
      } else {
        maisTexto.style.display = "grid";
        btnVermais.innerHTML = `Ver Menos <i class="pi pi-angle-up"></i>`;

      }
    }
  }
}
