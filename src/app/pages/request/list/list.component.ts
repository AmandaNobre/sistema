import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IButtonsStandard, IForm, IOptions } from 'form-dynamic-angular';
import { RequestService } from '../../../services/request.service';
import { FormService } from 'src/app/services/form.service';
import { IDataForm, IDataRequisition, IDataUser, IUser } from 'src/app/interface';
import { UserService } from 'src/app/services/user.service';

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
  requestsFilter: any[] = []
  users: IUser[] = []

  constructor(
    private fb: UntypedFormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private service: RequestService,
    private formService: FormService,
    private userService: UserService
  ) { }

  ngOnInit() {
    this.userService.getAll().subscribe(({ data }: IDataUser) => (
      this.users = data
    ))

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

    this.service.getAll().subscribe(({ data }: IDataRequisition) => {
      const requestAll = data.map((d) => (
        {
          ...d,
          title: this.form[0].options?.filter(o => o.id === d.customFormId)[0]?.descricao,
          user: this.users.filter(u => u.id == d.requesterId)[0]?.name
        }))
      this.requests = requestAll
      this.requestsFilter = requestAll
    })
  }

  filter() {
    this.requestsFilter = this.requests.filter(r => r.customFormId === this.control.value.form.id)
  }

  clickNew() {
    this.router.navigate([`register`], { relativeTo: this.route })
  }


  editOrView(id: number, type: string) {
    this.router.navigate([`${type}/${id}`], { relativeTo: this.route })
  }


}
