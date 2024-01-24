import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IAuth } from '../interface';
import { environment } from 'src/environment.ts/environments';

@Injectable()
export class LoginService {
  constructor(public http: HttpClient) { }

  signIn(credential: string) {
    return this.http.post<IAuth>(`${environment.api_url}/Auth/SignIn`, { credential })
  }
}
