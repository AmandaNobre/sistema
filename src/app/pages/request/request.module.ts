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
    ButtonModule
  ],
  exports: [
    ListComponent,
    FormComponent
  ],
  providers: [
    RequestService
  ]
})
export class RequestModule { }
