import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { IButtonsStandard, IForm, IOptions, ITable } from 'form-dynamic-angular';
import { RequestService } from '../service/request.service';

@Component({
  selector: 'app-form-request',
  templateUrl: './form.component.html'
})

export class FormComponent {

  controlFilter: UntypedFormGroup = this.fb.group({
    nome: '',
    aprovacao: '',
    type: '',
    name: ''
  })
  formmFilter: IForm[] = []

  buttonsStandard: IButtonsStandard[] = [
    { type: 'cancel', onCLick: () => this.return() },
    { type: 'save', onCLick: () => this.saveRequest() }
  ]

  table: ITable[] = []

  options: IOptions[] = [
    { id: 1, descricao: "Usuário" },
    { id: 2, descricao: "Cargo" }
  ]
  user: IOptions[] = []
  cargos: IOptions[] = []

  id: number = 0
  type: string = ''

  constructor(
    private fb: UntypedFormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private service: RequestService
  ) {
    this.route.params.subscribe(params => this.id = params['id']);
    this.route.params.subscribe(params => this.type = params['type']);
  }

  ngOnInit() {
    if (this.id) {
      this.service.getById(this.id).subscribe(data => {
        var form = data as any
        this.controlFilter = this.fb.group(form[0].formResponse)
      })
    }

    this.service.getAllUser().subscribe(data => {
      var user = data as IOptions[]
      this.user = user
    })

    this.service.getAllCargos().subscribe(data => {
      var cargos = data as IOptions[]
      this.cargos = cargos
    })

    this.formmFilter = [
      { label: 'Nome', col: 'col-lg-6', type: 'text', formControl: 'nome' },
      { label: 'HIerarquia de Aprovação', col: 'col-md-12' },
      { label: 'Tipo de usuário', col: 'col-md-4', type: 'select', options: this.options, formControl: 'type', disabled: this.type == "view" },
      { label: 'Usuário/Cargo', col: 'col-md-4', type: 'select', formControl: 'name', disabled: this.type == "view" },
      { label: 'Adicionar', onCLick: () => this.add(), col: 'col-md-4', type: 'button', class: "mt-3", formControl: 'aprovacao', disabled: this.type == "view" },
      { label: '', col: 'col-md-12', type: 'table', formControl: '', tableOptions: this.table },
    ]

  }

  chageValues() {
    if (this.controlFilter.value.type.id == 1) {
      this.formmFilter[3].options = this.user
    }

    if (this.controlFilter.value.type.id == 2) {
      this.formmFilter[3].options = this.cargos
    }
  }

  add() {
    const control = this.controlFilter.value

    if (control.type.descricao&& control.name.descricao) {
      console.log('control.name.descricao', control.name.descricao)
      console.log('control.type.descricao', control.type.descricao)
      this.table.push({
        c1: control.type.descricao,
        c2: control.name.descricao,
        id: this.table.length + 1,
        button: { label: "", icon: "pi pi-trash", onCLick: (id: number) => this.removeList(id), styleClass: "p-button-danger p-button-outlined" },
      })
      this.formmFilter[5].tableOptions = this.table
      this.controlFilter = this.fb.group({
        nome: '',
        aprovacao: '',
        type: '',
        name: ''
      })
    }
  }


  removeList(id: number) {
    this.table = this.table.filter(t => t.id !== id)
    this.formmFilter[5].tableOptions = this.table
  }

  clickNew() {
    this.router.navigate([`register`], { relativeTo: this.route })
  }

  saveRequest() {
    var payload = {
      descricao: this.controlFilter.value.descricao,
      aprovadores: this.controlFilter.value.aprovacao,
    }

    if (this.id) {
      this.service.edit(payload, this.id).subscribe({
        next: () => {
        }
      })
    } else {
      this.service.save(payload).subscribe({
        next: () => {
        }
      })
    }


  }

  return() {
    this.router.navigate([`/pages/request`], { relativeTo: this.route })

  }
}
