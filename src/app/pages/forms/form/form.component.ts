import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { IButtonsStandard, IForm, IOptions } from 'form-dynamic-angular';
import { RequestService } from '../service/request.service';

@Component({
  selector: 'app-form-request',
  templateUrl: './form.component.html'
})

export class FormComponent {

  controlFilter: UntypedFormGroup = this.fb.group({
    nome: '',
    aprovacao: ''
  })
  formmFilter: IForm[] = []

  buttonsStandard: IButtonsStandard[] = [
    { type: 'cancel', onCLick: () => this.return() },
    { type: 'save', onCLick: () => this.saveRequest() }
  ]

  options: IOptions[] = []

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

    this.service.getAllForms().subscribe(data => {
      this.options = data as IOptions[]

      this.formmFilter = [
        { label: 'Nome', col: 'col-lg-6', type: 'text', formControl: 'nome'},
        { label: 'HIerarquia de Aprovação', col: 'col-lg-6', type: 'multi', options: this.options, formControl: 'aprovacao', disabled: this.type == "view" },
      ]
    })

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
