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
  addAppointmentUrl= 'https://bcr-backend.herokuapp.com/make_appointment';
  getRecommendationsUrl= 'https://bcr-backend.herokuapp.com/get_recommendations';
  getFutureAppointmentsUrl= 'https://bcr-backend.herokuapp.com/get_future_appointments';
  getPercentageSpentUrl= 'https://bcr-backend.herokuapp.com/get_percentage_spent';
  getTotalSpentUrl= 'https://bcr-backend.herokuapp.com/get_total_spent';
  sendMessageUrl= 'https://bcr-backend.herokuapp.com/get_chatbot_message';
  getCurrentAmountUrl= 'https://bcr-backend.herokuapp.com/get_total_amount';

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

  addAppointment(appointment: any): Observable<any> {
    return this.http
      .post(this.addAppointmentUrl, appointment)
      .pipe(map((response: any) => response));
  }

  getRecommendations(): Observable<any> {
    return this.http.get<JSON>(this.getRecommendationsUrl);
  }

  getFutureAppointments(): Observable<any> {
    return this.http.get<JSON>(this.getFutureAppointmentsUrl);
  }

  getPercentageSpent(): Observable<any> {
    return this.http.get<JSON>(this.getPercentageSpentUrl);
  }

  getTotalSpent(): Observable<any> {
    return this.http.get<JSON>(this.getTotalSpentUrl);
  }

  getCurrentAmount(): Observable<any> {
    return this.http.get<JSON>(this.getCurrentAmountUrl);
  }

  sendMessage(message: any): Observable<any> {
    return this.http
      .post(this.sendMessageUrl, message)
      .pipe(map((response: any) => response));
  }
}
