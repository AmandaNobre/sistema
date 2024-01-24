import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { PagesComponent } from './pages.component';
import { ComponentsModule } from '../components/components.module';
import { ToastModule } from 'primeng/toast';
import { AuthGuard } from '../services/auth.guard.service';

const routes: Routes = [
  {
    path: '',
    component: PagesComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'request', pathMatch: 'full' },
      { path: 'request', loadChildren: () => import('./request/request.module').then(module => module.RequestModule) },
      { path: 'forms', loadChildren: () => import('./forms/forms.module').then(module => module.FormModule) }
    ]
  }
]


@NgModule({
  declarations: [
    PagesComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ComponentsModule,
    ToastModule
  ],
  providers: [AuthGuard]
})
export class PagesModule { }
