import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ListComponent } from './list/list.component';
import { FormComponent } from './form/form.component';
import { RequestService } from '../../services/request.service';
import { FormDynamicAngularModule } from 'form-dynamic-angular';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { DividerModule } from 'primeng/divider';
import { FormService } from 'src/app/services/form.service';
import { UserService } from 'src/app/services/user.service';
import { OrderListModule } from 'primeng/orderlist';
import { DropdownModule } from 'primeng/dropdown';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { TabViewModule } from 'primeng/tabview';
import { ComponentsModule } from 'src/app/components/components.module';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { PanelModule } from 'primeng/panel';
import { FileService } from 'src/app/services/file.service';
import { TooltipModule } from 'primeng/tooltip';

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
    ComponentsModule,
    TabViewModule,
    AutoCompleteModule,
    OverlayPanelModule,
    DropdownModule,
    OrderListModule,
    DividerModule,
    TableModule,
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule,
    FormDynamicAngularModule,
    ButtonModule,
    ToastModule,
    ConfirmDialogModule,
    DialogModule,
    PanelModule,
    TooltipModule
  ],
  exports: [
    ListComponent,
    FormComponent
  ],
  providers: [
    RequestService,
    MessageService,
    ConfirmationService,
    FormService,
    UserService,
    AuthenticationService,
    FileService
  ]
})
export class RequestModule { }
