import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IButtonsOptional, IButtonsStandard, IForm, IOptions } from 'form-dynamic-angular';
import { RequestService } from '../../../services/request.service';
import { FormService } from 'src/app/services/form.service';
import { IDataForm, IDataUser, IMyRequisitions, IUser, TTitles } from 'src/app/interface';
import { UserService } from 'src/app/services/user.service';
import { AuthenticationService } from 'src/app/services/authentication.service';

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
    { type: 'clean', onCLick: () => this.clean(), styleClass: "p-button-outlined" },
    { type: 'filter', onCLick: () => this.filter(), styleClass: "p-button-outlined" }
  ]

  buttonsTable: IButtonsOptional[] = [
    { label: "Visualizar", icon: "pi pi-eye", onCLick: (rowData: any) => this.editOrView(rowData['id'], 'view'), styleClass: "p-button-info p-button-outlined mr-2" },
  ]

  cols: any[] = []
  requests: any[] = []
  requestsFilter: any[] = []
  users: IUser[] = []

  userId: string = ''

  constructor(
    private fb: UntypedFormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private service: RequestService,
    private formService: FormService,
    private userService: UserService,
    private authenticationService: AuthenticationService
  ) {
    this.userId = JSON.parse(this.authenticationService.getLoggedUser()).id
  }

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
      { field: 'requesterName', header: 'Usuário' },
      { field: 'status', header: 'Status' }
    ];

    this.getAll()
  }

  getAll() {
    this.service.getMyRequisitions(this.userId).subscribe(({ data }: IMyRequisitions) => {
      const titles: TTitles = Object.keys(data) as TTitles
      const requestAll = titles.map((t) => ({
        title: t,
        table: data[t].map(d => ({
          ...d
        }))
      }))
      this.requests = requestAll
      this.requestsFilter = requestAll
    })
  }

  filter() {
    this.requestsFilter = this.requests.map(t => ({ ...t, table: t.table.filter((r: { customFormId: any; }) => r.customFormId === this.control.value.form.id) }))
  }

  clickNew() {
    this.router.navigate([`register`], { relativeTo: this.route })
  }


  editOrView(id: number, type: string) {
    this.router.navigate([`${type}/${id}`], { relativeTo: this.route })
  }


  clean() {
    this.control = this.fb.group({
      form: '',
    })
    this.getAll()
  }

}
