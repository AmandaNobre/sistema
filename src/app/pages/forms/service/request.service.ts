import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class RequestService {
  constructor(public http: HttpClient) { }

  getAllForms() {
    return this.http.get(`http://localhost:3000/forms`);
  }

  filter(type: string) {
    return this.http.get(`http://localhost:3000/forms?descricao=${type}`)
  }

  getById(id: number) {
    return this.http.get(`http://localhost:3000/forms?id=${id}`)
  }

  save(payload: any) {
    return this.http.post(`http://localhost:3000/forms`, payload);
  }

  edit(payload: any, id: number) {
    return this.http.put(`http://localhost:3000/forms/${id}`, payload);
  }
}
