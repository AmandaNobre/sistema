import { Component } from '@angular/core';
import { FormControl, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { IButtonsOptional, IButtonsStandard, IForm } from 'form-dynamic-angular';
import { IAuth } from '../interface';
import { LoginService } from '../services/login.service';
import { AuthenticationService } from '../services/authentication.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { error } from 'jquery';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  constructor(
    private fb: UntypedFormBuilder,
    private loginService: LoginService,
    private authenticationService: AuthenticationService,
    private route: ActivatedRoute,
    private router: Router,
    private messageService: MessageService
  ) { }

  validateForm: boolean = false

  buttonsOptional: IButtonsOptional[] = [
    { label: "Salvar", onCLick: () => this.logar(), styleClass: "", icon: 'fa fa-eye' },
  ]

  form: IForm[] = [
    { label: 'Usuário', col: 'col-lg-12', type: 'text', formControl: 'username', required: true },
    { label: 'Senha', col: 'col-lg-12', type: 'text', formControl: 'password', required: true }
  ]

  control: UntypedFormGroup = this.fb.group({
    username: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
  })

  logar() {
    if (this.control.status === "VALID") {
      this.validateForm = false
      const control = this.control.value
      const payload = window.btoa(`${control.username}:${new Date().getTime()}:${control.password}`)

      this.loginService.signIn(payload).subscribe({
        next: (data: IAuth) => {
          this.authenticationService.setAuth(JSON.stringify(data))
          this.router.navigate([`/pages`], { relativeTo: this.route })
        },
        error: ({ error }) => {
          this.messageService.add({ severity: 'error', summary: 'Erro', detail: error.Extensions.erroDetail.Message });

        }
      })
    } else {
      this.validateForm = true

    }
  }
}