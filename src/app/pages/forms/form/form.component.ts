import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormControl, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { IButtonsStandard, ICols, IForm, IOptions, ITable } from 'form-dynamic-angular';
import { Header, MessageService } from 'primeng/api';
import { FormService } from '../service/form.service';

@Component({
  selector: 'app-form-request',
  templateUrl: './form.component.html'
})

export class FormComponent {

  validateForm: boolean = false
  control: UntypedFormGroup = this.fb.group({
    descricao: '',
    type: '',
    name: new FormControl('', Validators.required),
    nameInput: '',
    typeInput: '',
    requiredInput: '',
    optionForm: '',
    generic: ''
  })

  form: IForm[] = []

  formName: string = ''
  controlFormCreated: UntypedFormGroup = this.fb.group({})
  formCreated: IForm[] = []

  buttonsStandard: IButtonsStandard[] = [
    { type: 'cancel', onCLick: () => this.return() },
    { type: 'save', onCLick: () => this.saveRequest() }
  ]

  table: any[] = []
  cols: ICols[] = [
    { field: 'c1', header: 'Tipo de Aprovador' },
    { field: 'c2', header: 'Usuário/Cargo' },
    { field: 'button', header: 'Ação' },
  ]

  tableInputs: any[] = []
  colsInputs: ICols[] = [
    { field: 'name', header: "Nome" },
    { field: 'type', header: "tipo" },
    { field: 'required', header: "Obrigatório" },
    { field: 'button', header: 'Ação' }
  ]

  options: IOptions[] = [
    { id: 1, descricao: "Usuário" },
    { id: 2, descricao: "Cargo" }
  ]

  optionsForm: IOptions[] = []

  typesInputs: IOptions[] = [
    { id: 'autocomplete', descricao: "Autocompletar" },
    { id: 'date', descricao: "Data" },
    { id: 'date-time', descricao: "Data e Hora" },
    { id: 'number', descricao: "Número" },
    { id: 'text', descricao: "Texto" },
    { id: 'multi', descricao: "Seleção Múltipla" },
    { id: 'upload-files', descricao: "Upload de arquivos" }
  ]

  user: IOptions[] = []
  cargos: IOptions[] = []

  id: number = 0
  type: string = ''

  title: string = "Cadastrar"

  constructor(
    private fb: UntypedFormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private service: FormService,
    private messageService: MessageService
  ) {
    this.route.params.subscribe(params => this.id = params['id']);
    this.route.params.subscribe(params => this.type = params['type']);
  }

  ngOnInit() {
    this.service.getAllUser().subscribe(data => {
      var user = data as IOptions[]
      this.user = user
    })

    this.service.getAllCargos().subscribe(data => {
      var cargos = data as IOptions[]
      this.cargos = cargos
    })

    this.form = [
      { label: 'Nome do Formulário', col: 'col-lg-6', type: 'text', formControl: 'descricao', required: true },
      { label: 'Hierarquia de Aprovação', col: 'col-md-12', formControl: 'generic' },
      { label: 'Tipo de Aprovador', col: 'col-md-2', type: 'select', options: this.options, formControl: 'type', disabled: this.type == "view", required: true },
      { label: 'Usuário/Cargo', col: 'col-md-8', type: 'select', formControl: 'name', disabled: this.type == "view", required: true },
      { label: 'Adicionar', onCLick: () => this.add(), col: 'col-md-2', type: 'button', class: "mt-3", formControl: 'generic', disabled: this.type == "view" },
      { label: 'Nome do Campo', col: 'col-md-3', type: 'text', formControl: 'nameInput', disabled: this.type == "view", required: true },
      { label: 'Tipo do campo', col: 'col-md-3', type: 'select', formControl: 'typeInput', disabled: this.type == "view", options: this.typesInputs, required: true },
      { secondLabel: "Obrigatório", col: 'col-md-3', type: 'switch', formControl: 'requiredInput', disabled: this.type == "view", required: true },
      { label: 'Adicionar', onCLick: () => this.addForm(), col: 'col-md-2', type: 'button', class: "mt-3", disabled: this.type == "view", formControl: 'generic' },
    ]

    if (this.id) {
      this.title = "Editar"
      this.service.getById(this.id).subscribe(data => {
        var form = data as any
        this.control = this.fb.group(form[0])
        this.form[5].rowsTable = form[0].table
      })
    }
  }

  addForm() {
    const control = this.control.value
    const nameFormControl = control.nameInput.normalize('NFD').replace(/[\u0300-\u036f,\s]/g, "").toLowerCase()

    if (control.nameInput && control.typeInput) {
      this.tableInputs.push({
        name: control.nameInput,
        type: control.typeInput.descricao,
        required: control.requiredInput ? "Sim" : "Não",
        id: this.table.length + 1,
        button: { label: "", icon: "pi pi-trash", onCLick: (id: number) => this.removeList(id), styleClass: "p-button-danger p-button-outlined" },
      })
      this.form[10].tableOptions = this.tableInputs
      this.control = this.fb.group({
        ...control,
        nameInput: '',
        typeInput: '',
        required: false
      })

      this.controlFormCreated = this.fb.group({
        ...this.controlFormCreated.value,
        [nameFormControl]: ''
      })

      this.formCreated = [
        ...this.formCreated,
        { label: control.nameInput, type: control.typeInput.id, formControl: nameFormControl },
      ]
    }

    if (this.form[10].type != "table") {
      this.form[10] = { col: 'col-md-12', type: 'table', rowsTable: this.tableInputs, colsTable: this.colsInputs, formControl: 'generic', tableOptions: this.tableInputs }

    }
  }


  chageValues() {

    if (this.control.value.type.id == 1) {
      this.form[3].options = this.user
    }

    if (this.control.value.type.id == 2) {
      this.form[3].options = this.cargos
    }
  }

  add() {
    const control = this.control.value

    if (control.type.descricao && control.name.descricao) {
      this.table.push({
        c1: control.type.descricao,
        c2: control.name.descricao,
        id: this.table.length + 1,
        button: { label: "", icon: "pi pi-trash", onCLick: (data: any) => this.removeList(data), styleClass: "p-button-danger p-button-outlined" },
      })
      this.form[5].tableOptions = this.table
      this.control = this.fb.group({
        ...control,
        type: '',
        name: ''
      })
    }

    if (this.form[5].type != "table") {
      this.form[5] = { label: '', col: 'col-md-12', type: 'table', formControl: 'generic', rowsTable: this.table, colsTable: this.cols, tableOptions: this.table }
    }
  }


  removeList(data: any) {
    console.log('data', data)
    this.form[5].tableOptions =  this.table.filter(t => t.id !== data.id)
    console.log('this.form[5]', this.form[5])
    console.log('this.table.filter(t => t.id !== data.id)', this.table.filter(t => t.id !== data.id))
  }

  clickNew() {
    this.router.navigate([`register`], { relativeTo: this.route })
  }

  saveRequest() {
    if (this.control.status === "VALID") {
      this.validateForm = false

      var payload = {
        descricao: this.control.value.descricao,
        table: this.table
      }

      if (this.id) {
        this.service.edit(payload, this.id).subscribe({
          next: () => {
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Sucesso ao editar formulário' });
            setTimeout(() => this.return(), 2000);
          }
        })
      } else {
        this.service.save(payload).subscribe({
          next: () => {
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Sucesso ao cadastrar formulário' });
            setTimeout(() => this.return(), 2000);
          }
        })
      }
    } else {
      this.validateForm = true
    }
  }

  return() {
    this.router.navigate([`/pages/forms`], { relativeTo: this.route })

  }
}
