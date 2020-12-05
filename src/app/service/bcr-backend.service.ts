import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BcrBackendService {
  getTextUrl = 'https://hackitall-bcr.web.app/get_text';

  constructor(private http: HttpClient) { }

  getText(): Observable<JSON> {
    return this.http.get<JSON>(this.getTextUrl);
  }
}
