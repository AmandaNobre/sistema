import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { IButtonsStandard, ICols, IForm, IOptions, ITable } from 'form-dynamic-angular';
import { MessageService } from 'primeng/api';
import { FormService } from '../service/form.service';

@Component({
  selector: 'app-form-request',
  templateUrl: './form.component.html'
})

export class FormComponent {

  control: UntypedFormGroup = this.fb.group({
    descricao: '',
    type: '',
    name: ''
  })
  form: IForm[] = []

  buttonsStandard: IButtonsStandard[] = [
    { type: 'cancel', onCLick: () => this.return() },
    { type: 'save', onCLick: () => this.saveRequest() }
  ]

  table: ITable[] = []
  cols: ICols[] = [
    { field: 'c1', header: 'Tipo de Aprovador' },
    { field: 'c2', header: 'Usuário/Cargo' },
    { field: 'button', header: 'Ação' },
  ]

  options: IOptions[] = [
    { id: 1, descricao: "Usuário" },
    { id: 2, descricao: "Cargo" }
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
      { label: 'Nome', col: 'col-lg-6', type: 'text', formControl: 'descricao' },
      { label: 'Hierarquia de Aprovação', col: 'col-md-12' },
      { label: 'Tipo de Aprovador', col: 'col-md-2', type: 'select', options: this.options, formControl: 'type', disabled: this.type == "view" },
      { label: 'Usuário/Cargo', col: 'col-md-8', type: 'select', formControl: 'name', disabled: this.type == "view" },
      { label: 'Adicionar', onCLick: () => this.add(), col: 'col-md-2', type: 'button', class: "mt-3", formControl: 'aprovacao', disabled: this.type == "view" },
      { label: '', col: 'col-md-12', type: 'table', formControl: '', rowsTable: this.table, colsTable: this.cols },
    ]
    if (this.id) {
      this.title = "Editar"
      this.service.getById(this.id).subscribe(data => {
        var form = data as any
        console.log('form', form)
        this.control = this.fb.group(form[0])
        this.form[5].rowsTable = form[0].table
      })
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
        button: { label: "", icon: "pi pi-trash", onCLick: (id: number) => this.removeList(id), styleClass: "p-button-danger p-button-outlined" },
      })
      this.form[5].tableOptions = this.table
      this.control = this.fb.group({
        ...control,
        aprovacao: '',
        type: '',
        name: ''
      })
    }
  }


  removeList(id: number) {
    this.table = this.table.filter(t => t.id !== id)
    this.form[5].tableOptions = this.table
  }

  clickNew() {
    this.router.navigate([`register`], { relativeTo: this.route })
  }

  saveRequest() {
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


  }

  return() {
    this.router.navigate([`/pages/forms`], { relativeTo: this.route })

  }
}
