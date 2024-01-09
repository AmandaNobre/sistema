import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IButtonsStandard, IForm, IOptions } from 'form-dynamic-angular'; import { ConfirmationService, MessageService } from 'primeng/api';
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
    { type: 'clean', onCLick: () => this.clean() },
    { type: 'filter', onCLick: () => this.filter() }
  ]

  cols: any[] = []
  allForms: any[] = []

  constructor(
    private fb: UntypedFormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private formService: FormService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit() {
    this.form = [
      { label: 'Nome', col: 'col-md-6', type: 'select', formControl: 'form' }
    ]

    this.cols = [
      { field: 'title', header: 'Nome' },
    ];

    this.getAll()
  }

  getAll() {
    this.formService.getAll().subscribe(({ data }: IDataForm) => {
      this.allForms = data
      this.form[0].options = data.map(d => ({ ...d, descricao: d.title }))
    })
  }

  filter() {
    // this.formService.filter(this.control.value.form.descricao).subscribe(data => {
    //   this.allForms = data as IOptions[]
    // })
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
