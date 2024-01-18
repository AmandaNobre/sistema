import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { RouterModule, Routes } from '@angular/router';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RequestInterceptor } from 'src/interceptors/request.interceptor';
import { AuthenticationService } from './services/authentication.service';
import { MessageService } from 'primeng/api';

const routes: Routes = [
  { path: '', redirectTo: 'pages', pathMatch: 'full' },
  { path: 'pages', loadChildren: () => import('./pages/pages.module').then(module => module.PagesModule) },
  { path: 'login', loadChildren: () => import('./login/login.module').then(module => module.LoginModule) }
]

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes),
    HttpClientModule,
    BrowserAnimationsModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: RequestInterceptor,
      multi: true,
    },
    AuthenticationService,
    MessageService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
