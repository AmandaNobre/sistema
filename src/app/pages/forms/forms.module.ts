import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ListComponent } from './list/list.component';
import { FormComponent } from './form/form.component';
import { FormDynamicAngularModule } from 'form-dynamic-angular';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { FormService } from '../../services/form.service';
import { SplitButtonModule } from 'primeng/splitbutton';
import { InputSwitchModule } from 'primeng/inputswitch';
import { DialogModule } from 'primeng/dialog';
import { CalendarModule } from 'primeng/calendar';
import { OrderListModule } from 'primeng/orderlist';
import { AccordionModule } from 'primeng/accordion';
import { DividerModule } from 'primeng/divider';
import { UserService } from '../../services/user.service';
import { ComponentsModule } from 'src/app/components/components.module';
import { TitleService } from 'src/app/services/title.service';

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
    DividerModule,
    AccordionModule,
    OrderListModule,
    ButtonModule,
    CalendarModule,
    DialogModule,
    InputSwitchModule,
    SplitButtonModule,
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule,
    FormDynamicAngularModule,
    ButtonModule,
    TableModule,
    ToastModule,
    ConfirmDialogModule,
    ComponentsModule
  ],
  exports: [
    ListComponent,
    FormComponent
  ],
  providers: [
    FormService,
    MessageService,
    ConfirmationService,
    UserService,
    TitleService
  ]
})
export class FormModule { }
