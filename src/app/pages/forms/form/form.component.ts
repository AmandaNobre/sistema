import { ActivatedRoute, Router } from '@angular/router';
import { Component } from '@angular/core';
import { FormControl, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { IButtonsStandard, ICols, IForm, IOptions } from 'form-dynamic-angular';
import { MessageService } from 'primeng/api';
import { FormService } from '../service/form.service';
import { TableModule } from 'primeng/table';

declare var $: any;

@Component({
  selector: 'app-form-request',
  templateUrl: './form.component.html'
})

export class FormComponent {
  table: any[] = []
  tableInputs: any[] = []

  validateForm: boolean = false
  control: UntypedFormGroup = this.fb.group({
    // descricao: new FormControl('', Validators.required),
    type: this.table.length === 0 ? new FormControl('', Validators.required) : new FormControl(''),
    name: this.table.length === 0 ? new FormControl('', Validators.required) : new FormControl('')
  })

  form: IForm[] = []

  formName: string = ''
  controlNewForm: UntypedFormGroup = this.fb.group({
    titleForm: 'Título do Formulário'
  })
  formCreated: IForm[] = []

  buttonsStandard: IButtonsStandard[] = [
    { type: 'cancel', onCLick: () => this.return() },
    { type: 'save', onCLick: () => this.saveRequest() }
  ]

  cols: ICols[] = [
    { field: 'c1', header: 'Tipo de Aprovador' },
    { field: 'c2', header: 'Usuário/Cargo' },
    { field: 'button', header: 'Ação' },
  ]

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

  typesInputs = [
    { label: "Data", command: () => this.addInput("date") },
    { label: "Número", command: () => this.addInput("number") },
    { label: "Texto", command: () => this.addInput("text") },
    { label: "Seleção", command: () => this.addInput("select") },
    { label: "Upload de arquivos", command: () => this.addInput("upload-files") }
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
    this.route.params.subscribe((params: { [x: string]: number; }) => this.id = params['id']);
    this.route.params.subscribe((params: { [x: string]: string; }) => this.type = params['type']);
  }

  visible: boolean = false;

  showDialog() {
    this.visible = true;
  }

  ngOnInit() {

    $('#title').on("click", function () {
      $('#title').hide();
      $('#editTitle').show();
    });

    $(function () {
      $("body").on("click", function (e: { target: any; }) {
        document.getElementById('inputTitle')?.addEventListener('blur', function () {
          $('#title').show();
          $('#editTitle').hide();
        });
      });
    })


    if (this.id) {
      this.title = "Editar"
      this.service.getById(this.id).subscribe((data) => {
        var form = data as any
        // this.control = this.fb.group(form[0])
        this.table = form[0].table
        this.form[3] = { label: '', col: 'col-md-12', type: 'table', formControl: 'generic', rowsTable: this.table, colsTable: this.cols }
        this.controlNewForm = this.fb.group(form[0].controlCreatedForm)
        this.formCreated = form[0].form

        this.control = this.fb.group({
          // descricao: new FormControl('', Validators.required),
          type: this.table.length === 0 ? new FormControl('', Validators.required) : new FormControl(''),
          name: this.table.length === 0 ? new FormControl('', Validators.required) : new FormControl('')
        })
      })

    } else {
      const formCreatedLS = localStorage.getItem("formCreated")
      const controlNewFormLS = localStorage.getItem("controlNewForm")
      if (formCreatedLS) {
        this.formCreated = JSON.parse(formCreatedLS)
      }
      if (controlNewFormLS) {
        const local = { ...JSON.parse(controlNewFormLS) }
        const keys = Object.keys(local).filter((e) => e.startsWith("list"))
        const control = keys.map((key: any) => ({ ...local, [key]: [local[key]] }))[0]
        this.controlNewForm = this.fb.group(control)
      }
    }

    this.service.getAllUser().subscribe((data) => {
      var user = data as IOptions[]
      this.user = user
    })

    this.service.getAllCargos().subscribe((data) => {
      var cargos = data as IOptions[]
      this.cargos = cargos
    })

    this.form = [
      // { label: 'Nome do Formulário', col: 'col-lg-6', type: 'text', formControl: 'descricao', required: true },
      // { label: 'Hierarquia de Aprovação', col: 'col-md-12', formControl: 'generic' },
      { label: 'Tipo de Aprovador', col: 'col-md-2', type: 'select', options: this.options, formControl: 'type', disabled: this.type == "view", required: true },
      { label: 'Usuário/Cargo', col: 'col-md-8', type: 'select', formControl: 'name', disabled: this.type == "view", required: true },
      { label: 'Adicionar', onCLick: () => this.add(), col: 'col-md-2', type: 'button', class: "mt-3", disabled: this.type == "view" }
    ]


  }

  chageValues() {
    if (this.control.value.type.id == 1) {
      // this.form[3].options = this.user
      this.form[1].options = this.user
    }

    if (this.control.value.type.id == 2) {
      // this.form[3].options = this.cargos
      this.form[1].options = this.cargos
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
      // if (!this.form[5]) {
      //   this.form[5] = { label: '', col: 'col-md-12', type: 'table', formControl: 'generic', rowsTable: this.table, colsTable: this.cols }
      // } else {
      //   this.form[5].rowsTable = this.table
      // }
      if (!this.form[3]) {
        this.form[3] = { label: '', col: 'col-md-12', type: 'table', formControl: 'generic', rowsTable: this.table, colsTable: this.cols }
      } else {
        this.form[3].rowsTable = this.table
      }
      this.control = this.fb.group({
        ...control,
        type: '',
        name: ''
      })
    }
  }

  removeList(data: any) {
    this.table = this.table.filter(t => t.id !== data.id)
    // this.form[5].rowsTable = this.table
    this.form[3].rowsTable = this.table

    if (this.table.length === 0) {
      this.form.pop()
    }
  }

  clickNew() {
    this.router.navigate([`register`], { relativeTo: this.route })
  }

  addLocalStorage() {
    localStorage.setItem("formCreated", JSON.stringify(this.formCreated));
    localStorage.setItem("controlNewForm", JSON.stringify(this.controlNewForm.value));
  }

  addInput(type: "date" | "number" | "select" | "text" | "upload-files") {
    const count = this.formCreated.length

    const controlNewFormBefore = { ...this.controlNewForm.value }
    const keys = Object.keys(controlNewFormBefore).filter((e) => e.startsWith("list"))
    const control = keys.length > 0 ? keys.map((key: any) => ({ ...controlNewFormBefore, [key]: [controlNewFormBefore[key]] }))[0] : controlNewFormBefore


    this.controlNewForm = this.fb.group({
      ...control,
      ["question" + count]: '',
      ["required" + count]: false,
      ["longAnswer" + count]: false,
      ["dateTime" + count]: false,
      ["multi" + count]: false,
      ["list" + count]: [],
    })

    this.formCreated.push(
      { col: 'col-lg-12', type: type }
    )

    this.addLocalStorage()
  }

  addOptionsSelect(i: number) {
    const initial = { id: '', descricao: "" }

    if (this.formCreated[i].options) {
      this.formCreated[i].options?.push(initial)
    } else {
      this.formCreated[i].options = [initial]
    }

    this.addLocalStorage()
  }


  change(e: any, index: number, indexControl: number) {

    let change = this.formCreated[indexControl].options

    const value = e.target.value
    const id = value.normalize('NFD').replace(/[\u0300-\u036f,\s]/g, "").toLowerCase()

    if (change) {
      change[index] = { id: id, descricao: value }
      this.formCreated[indexControl].options = change
    }

    this.addLocalStorage()
  }


  removeOption(index: number, indexControl: number) {
    this.formCreated[indexControl].options?.splice(index, 1)
    this.addLocalStorage()
  }


  removeInput(index: number) {
    this.formCreated.splice(index, 1)
    this.addLocalStorage()
  }

  changeInput(i: number) {
    const control = this.controlNewForm.value
    const nameFormControl = control["question" + i].normalize('NFD').replace(/[\u0300-\u036f,\s]/g, "").toLowerCase()

    this.controlNewForm = this.fb.group({
      ...this.controlNewForm.value,
      [nameFormControl]: '',
    })

    this.formCreated[i].label = control["question" + i]
    this.formCreated[i].formControl = nameFormControl
    this.formCreated[i].required = control["required" + i]

    if (this.formCreated[i].type == "text" || this.formCreated[i].type == "text-area") {
      if (control["longAnswer" + i]) {
        this.formCreated[i].type = 'text-area'
      } else {
        this.formCreated[i].type = 'text'
      }
    }


    if (this.formCreated[i].type == "select" || this.formCreated[i].type == "multi") {
      if (control["multi" + i]) {
        this.formCreated[i].type = 'multi'
      } else {
        this.formCreated[i].type = 'select'
      }
    }

    if (this.formCreated[i].type == "date" || this.formCreated[i].type == "date-time") {
      if (control["dateTime" + i]) {
        this.formCreated[i].type = 'date-time'
      } else {
        this.formCreated[i].type = 'date'
      }
    }

    this.addLocalStorage()
  }

  saveRequest() {
    if (this.control.status === "VALID") {
      this.validateForm = false


      var payload = {
        table: this.table,
        title: this.controlNewForm.value.titleForm,
        form: this.formCreated,
        controlCreatedForm: this.controlNewForm.value
      }
      localStorage.clear();

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
