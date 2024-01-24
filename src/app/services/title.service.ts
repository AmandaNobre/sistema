import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environment.ts/environments';
import { IDataTitle } from 'src/app/interface';


@Injectable()
export class TitleService {
  constructor(public http: HttpClient) { }

  getAll() {
    return this.http.get<IDataTitle>(`${environment.api_url}/Title/GetAll`);
  }
}
