import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { PagesComponent } from './pages.component';
import { ComponentsModule } from '../components/components.module';

const routes: Routes = [
  {
    path: '',
    component: PagesComponent,
    children: [
      { path: '', redirectTo: 'request', pathMatch: 'full' },
      { path: 'request',  loadChildren: () => import('./request/request.module').then(module => module.RequestModule) },
      { path: 'forms',  loadChildren: () => import('./forms/forms.module').then(module => module.FormModule) },
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
    ComponentsModule
  ]
})
export class PagesModule { }
