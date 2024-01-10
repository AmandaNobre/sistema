import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environment.ts/environments';
import ISaveCustomForm, { IDataForm, IDataFormById } from '../interface';
import { IForm } from 'form-dynamic-angular';



@Injectable()
export class FormService {
  constructor(public http: HttpClient) { }

  getAll() {
    return this.http.get<IDataForm>(`${environment.api_url}/CustomForm/GetAll`);
  }

  remove(id: string) {
    return this.http.delete(`${environment.api_url}/CustomForm`, { body: { id } });
  }

  getById(id: string) {
    return this.http.get<IDataFormById>(`${environment.api_url}/CustomForm/GetById/${id}`)
  }

  save(payload: ISaveCustomForm) {
    return this.http.post(`${environment.api_url}/CustomForm`, payload);
  }

  edit(payload: ISaveCustomForm) {
    return this.http.put(`${environment.api_url}/CustomForm`, payload);
  }
}
