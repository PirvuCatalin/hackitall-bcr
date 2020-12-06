import { Component, OnInit } from '@angular/core';
import { BcrBackendService } from 'src/app/service/bcr-backend.service';
import { CommonService } from 'src/app/service/common.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private bcrBackendService: BcrBackendService, public commonService: CommonService) { }

  recommendation = "";
  expenses: any = "";
  totalSpent = 0;
  futureAppointments: any = "";

  textFromBackend = "No text from backend ;(";

  ngOnInit(): void {
    this.bcrBackendService.getRecommendations().subscribe(response => {
      this.recommendation = response.response;
    });

    this.bcrBackendService.getPercentageSpent().subscribe(response => {
      var arr = [];
      for (var key in response.response) {
        if (response.response.hasOwnProperty(key)) {
          arr.push({ "key": key, "value": response.response[key] });
        }
      }
      arr = arr.sort(function (a, b) {
        return b.value - a.value;
      });
      this.expenses = arr;
    });

    this.bcrBackendService.getTotalSpent().subscribe(response => {
      this.totalSpent = response.response;
    });

    this.bcrBackendService.getFutureAppointments().subscribe(response => {
      this.futureAppointments = response.response;
    });
  }
}
