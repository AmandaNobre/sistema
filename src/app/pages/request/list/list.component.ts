import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IButtonsStandard, IForm, IOptions } from 'form-dynamic-angular';
import { RequestService } from '../../../services/request.service';
import { FormService } from 'src/app/services/form.service';
import { IDataForm } from 'src/app/interface';

@Component({
  selector: 'app-request',
  templateUrl: './list.component.html'
})

export class ListComponent implements OnInit {

  control: UntypedFormGroup = this.fb.group({
    form: '',
  })
  form: IForm[] = []

  buttonsStandard: IButtonsStandard[] = [
    { type: 'clean', onCLick: this.clickNew },
    { type: 'filter', onCLick: () => this.filter() }
  ]

  cols: any[] = []
  requests: any[] = []



  constructor(
    private fb: UntypedFormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private service: RequestService,
    private formService: FormService
  ) {

  }

  ngOnInit() {
    this.formService.getAll().subscribe(({ data }: IDataForm) => {
      var options = data.map(d => ({ ...d, descricao: d.title }))
      this.form = [
        { label: 'Tipo de Solicitação', col: 'col-lg-6', type: 'select', options: options, formControl: 'form' }
      ]
    })


    this.cols = [
      { field: 'title', header: 'Tipo de formulário' },
      { field: 'user', header: 'Usuário' },
      { field: 'status', header: 'Status' }
    ];

    this.service.getAllRequests().subscribe((data: any) => {
      this.requests = data.map((d: any) => ({ ...d, title: d.form.title }))
    })
  }

  filter() {
    this.service.filter(this.control.value.form.descricao).subscribe(data => {
      this.requests = data as any[]
    })
  }

  clickNew() {
    this.router.navigate([`register`], { relativeTo: this.route })
  }


  editOrView(id: number, type: string) {
    this.router.navigate([`${type}/${id}`], { relativeTo: this.route })
  }


}
