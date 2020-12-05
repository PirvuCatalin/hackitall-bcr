import { Component, OnInit } from '@angular/core';
import { BcrBackendService } from 'src/app/service/bcr-backend.service';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.css']
})
export class TransactionsComponent implements OnInit {

  constructor(private bcrBackendService: BcrBackendService) { }

  transactions:any = [];

  ngOnInit(): void {
    this.bcrBackendService.getTransactions().subscribe(response => {
      this.transactions = response.response;
      console.log(this.transactions);
    })
  }
}
