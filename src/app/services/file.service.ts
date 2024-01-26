import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environment.ts/environments';
import { IDataTitle } from 'src/app/interface';


@Injectable()
export class FileService {
  constructor(public http: HttpClient) { }

  download(id: string) {
    return this.http.get(`${environment.api_url}/File/Download?id=${id}`, { responseType: 'blob' });
  }
}
