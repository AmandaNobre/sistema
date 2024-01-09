import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environment.ts/environments';
import ISaveCustomForm, { IDataForm, IDataFormById } from '../interface';



@Injectable()
export class FormService {
  constructor(public http: HttpClient) { }

  getAll() {
    return this.http.get<IDataForm>(`${environment.api_url}/CustomForm/GetAll`);
  }

  remove(id: string) {
    return this.http.delete(`${environment.api_url}/CustomForm`, { body: { id } });
  }

  getAllCargos() {
    return this.http.get(`http://localhost:3000/cargos`);
  }

  filter(type: string) {
    return this.http.get(`http://localhost:3000/forms?descricao=${type}`)
  }

  getById(id: string) {
    return this.http.get<IDataFormById>(`${environment.api_url}/CustomForm/GetById/${id}`)
  }

  save(payload: ISaveCustomForm) {
    return this.http.post(`${environment.api_url}/CustomForm`, payload);
  }

  edit(payload: any, id: number) {
    return this.http.put(`http://localhost:3000/forms/${id}`, payload);
  }
}
