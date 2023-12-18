import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ListComponent } from './list/list.component';
import { FormComponent } from './form/form.component';
import { RequestService } from './service/request.service';
import { FormDynamicAngularModule } from 'form-dynamic-angular';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';

const routes: Routes = [
  { path: '', component: ListComponent },
  { path: 'register', component: FormComponent, data: { grouppt: 'Solicitação', groupen: "Request", labelpt: 'Cadastrar Solicitação', labelen: 'Register Request' } },
  { path: ':type/:id', component: FormComponent, data: { grouppt: 'Solicitação', groupen: "Request", labelpt: 'Visualizar Solicitação', labelen: 'View Request' } },
]

@NgModule({
  declarations: [
    ListComponent,
    FormComponent
  ],
  imports: [
    TableModule,
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule,
    FormDynamicAngularModule,
    ButtonModule,
    ToastModule,
    ConfirmDialogModule,
    DialogModule
  ],
  exports: [
    ListComponent,
    FormComponent
  ],
  providers: [
    RequestService,
    MessageService,
    ConfirmationService
  ]
})
export class RequestModule { }
