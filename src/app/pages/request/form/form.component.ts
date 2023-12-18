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
    form: '',
    t1: '',
    t2: '',
    t3: ''
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
        { label: 'Tipo de Solicitação', col: 'col-lg-6', type: 'select', options: this.options, formControl: 'form', disabled: this.type == "view" },
        { label: 'Tipo de Solicitação', col: 'col-lg-6', type: 'text', formControl: 't1', disabled: this.type == "view" },
        { label: 'Tipo de Solicitação', col: 'col-lg-6', type: 'text', formControl: 't2', disabled: this.type == "view" },
        { label: 'Tipo de Solicitação', col: 'col-lg-6', type: 'text', formControl: 't3', disabled: this.type == "view" }
      ]
    })

  }

  clickNew() {
    this.router.navigate([`register`], { relativeTo: this.route })
  }

  saveRequest() {
    var payload = {
      type: this.controlFilter.value.form.descricao,
      formResponse: this.controlFilter.value,
      user: "teste"
    }

    if (this.id) {
      this.service.editRequest(payload, this.id).subscribe({
        next: () => {
        }
      })
    } else {
      this.service.saveRequest(payload).subscribe({
        next: () => {
        }
      })
    }


  }

  return() {
    this.router.navigate([`/pages/request`], { relativeTo: this.route })

  }
}
