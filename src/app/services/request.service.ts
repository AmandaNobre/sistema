import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IRequisition } from '../interface';
import { environment } from 'src/environment.ts/environments';

@Injectable()
export class RequestService {
  constructor(public http: HttpClient) { }

  filter(type: string) {
    return this.http.get(`http://localhost:3000/requests?type=${type}`)
  }

  getById(id: number) {
    return this.http.get(`http://localhost:3000/requests?id=${id}&_expand=form`)
  }

  getAllRequests() {
    return this.http.get(`http://localhost:3000/requests?_expand=form`);
  }

  save(payload: IRequisition) {
    return this.http.post(`${environment.api_url}/Requisition/New`, payload);
  }

  editRequest(payload: any, id: number) {
    return this.http.put(`http://localhost:3000/requests/${id}`, payload);
  }
}
