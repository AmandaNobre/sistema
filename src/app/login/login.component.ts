import { Component } from '@angular/core';
import { FormControl, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { IButtonsOptional, IForm } from 'form-dynamic-angular';
import { IAuth } from '../interface';
import { LoginService } from '../services/login.service';
import { AuthenticationService } from '../services/authentication.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { HostListener } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})


export class LoginComponent {

  @HostListener('document:keypress', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.key === "Enter") {
      this.logar()
    }
  }

  constructor(
    private fb: UntypedFormBuilder,
    private loginService: LoginService,
    private authenticationService: AuthenticationService,
    private route: ActivatedRoute,
    private router: Router,
    private messageService: MessageService
  ) { }

  validateForm: boolean = false
  loading: boolean = false

  buttonsOptional: IButtonsOptional[] = [
    { label: "Salvar", onCLick: () => this.logar(), styleClass: "", icon: 'fa fa-eye' },
  ]

  form: IForm[] = [
    { label: 'Usuário', col: 'col-lg-12', type: 'text', formControl: 'username', required: true },
    { label: 'Senha', col: 'col-lg-12', type: 'password', formControl: 'password', required: true }
  ]

  control: UntypedFormGroup = this.fb.group({
    username: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
  })

  logar() {
    this.loading = true
    if (this.control.status === "VALID") {
      this.validateForm = false
      const control = this.control.value
      const payload = window.btoa(`${control.username}:${new Date().getTime()}:${control.password}`)

      this.loginService.signIn(payload).subscribe({
        next: (data: IAuth) => {
          this.loading = false
          this.authenticationService.setAuth(JSON.stringify(data))

          this.route.queryParamMap.subscribe(({ params }: any) => {
            if (params.to) {
              this.router.navigate([params.to], { relativeTo: this.route })
            } else {
              this.router.navigate([`/pages`], { relativeTo: this.route })
            }
          })

        },
        error: ({ error }) => {
          this.messageService.add({ severity: 'error', summary: 'Erro', detail: error.Extensions.erroDetail.Message });
          this.loading = false
        }
      })
    } else {
      this.validateForm = true
      this.loading = false

    }
  }
}
