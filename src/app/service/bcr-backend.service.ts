import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class BcrBackendService {
  getTextUrl = 'https://bcr-backend.herokuapp.com/get_text';
  addTransactionUrl = 'https://bcr-backend.herokuapp.com/make_transaction';
  getTransactionsUrl= 'https://bcr-backend.herokuapp.com/get_transactions';

  constructor(private http: HttpClient) { }

  getText(): Observable<JSON> {
    return this.http.get<JSON>(this.getTextUrl);
  }

  addTransaction(transaction: any): Observable<any> {
    return this.http
      .post(this.addTransactionUrl, transaction)
      .pipe(map((response: any) => response));
  }

  getTransactions(): Observable<any> {
    return this.http.get<JSON>(this.getTransactionsUrl);
  }
}
