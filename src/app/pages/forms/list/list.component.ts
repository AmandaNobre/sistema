import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IButtonsStandard, IForm, IOptions } from 'form-dynamic-angular';import { ConfirmationService, MessageService } from 'primeng/api';
import { FormService } from '../service/form.service';

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
  requests: any[] = []



  constructor(
    private fb: UntypedFormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private service: FormService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {

  }

  ngOnInit() {
    this.form = [
      { label: 'Nome', col: 'col-md-6', type: 'select', formControl: 'form' }
    ]

    this.cols = [
      { field: 'descricao', header: 'Nome' },
    ];

    this.service.getAllForms().subscribe(data => {
      this.requests = data as IOptions[]
      this.form[0].options = this.requests
    })
  }

  filter() {
    this.service.filter(this.control.value.form.descricao).subscribe(data => {
      this.requests = data as IOptions[]
    })
  }

  clickNew() {
    this.router.navigate([`register`], { relativeTo: this.route })
  }

  remove(id: number) {
    this.confirmationService.confirm({
      message: 'Certeza que deseja excluir este formulário',
      header: 'Confirmação',
      icon: 'pi pi-exclamation-triangle',
      rejectButtonStyleClass: "p-button-text",
      acceptLabel: "Sim",
      rejectLabel: "Não",
      accept: () => {
        this.service.remove(id).subscribe({
          next: () => {
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Sucesso ao exclui formulário' });
            this.service.getAllForms().subscribe(data => {
              this.requests = data as IOptions[]
              this.form[0].options = this.requests
            })
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
    this.service.getAllForms().subscribe(data => {
      this.requests = data as IOptions[]
      this.form[0].options = this.requests
    })
  }

}
