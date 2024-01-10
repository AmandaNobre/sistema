import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IAproveOrReject, IDataRequisition, IDataRequisitionById, IRequisitionSave } from '../interface';
import { environment } from 'src/environment.ts/environments';

@Injectable()
export class RequestService {
  constructor(public http: HttpClient) { }

  getById(id: string) {
    return this.http.get<IDataRequisitionById>(`${environment.api_url}/Requisition/GetById/${id}`);
  }

  getAll() {
    return this.http.get<IDataRequisition>(`${environment.api_url}/Requisition/GetAll`);
  }

  save(payload: IRequisitionSave) {
    return this.http.post(`${environment.api_url}/Requisition/New`, payload);
  }

  approveOrReject(payload: IAproveOrReject, type: string) {
    return this.http.put(`${environment.api_url}/Requisition/${type}`, payload);
  }
}
