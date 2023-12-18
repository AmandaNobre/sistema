import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class RequestService {
  constructor(public http: HttpClient) { }

  getAllForms() {
    return this.http.get(`http://localhost:3000/forms`);
  }

  filter(type: string){
    return this.http.get(`http://localhost:3000/requests?type=${type}`)
  }

  getById(id: number){
    return this.http.get(`http://localhost:3000/requests?id=${id}`)
  }

  getAllRequests() {
    return this.http.get(`http://localhost:3000/requests`);
  }

  saveRequest(payload: any) {
    return this.http.post(`http://localhost:3000/requests`, payload);
  }

  editRequest(payload: any, id: number) {
    // console.log('payload', payload)
    return this.http.put(`http://localhost:3000/requests/${id}`, payload);
  }
}
