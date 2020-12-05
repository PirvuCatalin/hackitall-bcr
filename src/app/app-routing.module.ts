import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddTransactionComponent } from './component/add-transaction/add-transaction.component';
import { HomeComponent } from './component/home/home.component';
import { LoginComponent } from './component/login/login.component';
import { MakeAppointmentComponent } from './component/make-appointment/make-appointment.component';
import { RegisterComponent } from './component/register/register.component';
import { TransactionsComponent } from './component/transactions/transactions.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'add-transaction', component: AddTransactionComponent },
  { path: 'transactions', component: TransactionsComponent },
  { path: 'make-appointment', component: MakeAppointmentComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
