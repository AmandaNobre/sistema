import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IButtonsOptional, IButtonsStandard, ICols, IForm, IOptions } from 'form-dynamic-angular'; import { ConfirmationService, MessageService } from 'primeng/api';
import { FormService } from '../../../services/form.service';
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
    { type: 'clean', onCLick: () => this.clean(), styleClass: 'p-button-outlined' },
    { type: 'filter', onCLick: () => this.filter(), styleClass: 'p-button-outlined' }
  ]

  cols: ICols[] = [
    { field: 'title', header: 'Nome' }
  ];

  allForms: any[] = []
  formsFIlter: any[] | null = null
  buttonsTable: IButtonsOptional[] = [
    { label: "Editar", icon: "pi pi-pencil", onCLick: (rowData: any) => this.editOrView(rowData['id'], 'edit'), styleClass: "p-button-warning p-button-outlined mr-2" },
    { label: "Excluir", icon: "pi pi-trash", onCLick: (rowData: any) => this.remove(rowData['id']), styleClass: "p-button-danger p-button-outlined" }
  ]

  constructor(
    private fb: UntypedFormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private formService: FormService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) { }

  ngOnInit() {
    this.form = [
      { label: 'Nome', col: 'col-md-6', type: 'select', formControl: 'form' }
    ]

    this.getAll()
  }

  getAll() {
    this.formService.getAll().subscribe(({ data }: IDataForm) => {
      this.allForms = data
      this.formsFIlter = data
      this.form[0].options = data.map(d => ({ ...d, descricao: d.title }))
    })
  }

  filter() {
    this.formsFIlter = this.allForms.filter(a => a.id === this.control.value.form.id)
  }

  clickNew() {
    this.router.navigate([`register`], { relativeTo: this.route })
  }

  remove(id: string) {
    this.confirmationService.confirm({
      message: 'Certeza que deseja excluir este formulário',
      header: 'Confirmação',
      icon: 'pi pi-exclamation-triangle',
      rejectButtonStyleClass: "p-button-text",
      acceptLabel: "Sim",
      rejectLabel: "Não",
      accept: () => {
        this.formService.remove(id).subscribe({
          next: () => {
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Sucesso ao exclui formulário' });
            this.getAll()
          }
        })
      }
    });

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
