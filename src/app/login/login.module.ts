import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login.component';
import { RouterModule, Routes } from '@angular/router';
import { ComponentsModule } from '../components/components.module';
import { FormDynamicAngularModule } from 'form-dynamic-angular';
import { LoginService } from '../services/login.service';
import { ImageModule } from 'primeng/image';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';

const routes: Routes = [
  { path: '', component: LoginComponent },
]


@NgModule({
  declarations: [LoginComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ComponentsModule,
    FormDynamicAngularModule,
    ImageModule,
    ButtonModule,
    ToastModule
  ],
  providers: [
    LoginService,

  ]
})
export class LoginModule { }
