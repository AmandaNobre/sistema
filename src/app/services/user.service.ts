import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environment.ts/environments';
import { IDataUser } from 'src/app/interface';


@Injectable()
export class UserService {
  constructor(public http: HttpClient) { }

  getAll() {
    return this.http.get<IDataUser>(`${environment.api_url}/User/GetAll`);
  }
}
