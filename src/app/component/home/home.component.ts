import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalDirective } from 'angular-bootstrap-md';
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
  currentAmount = 0;
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
      let arr = [];

      for (let index = 0; index < response.response.length; index++) {
        const element = response.response[index].date;

        var parts = element.split("/");
        var dt = new Date(parseInt(parts[2], 10),
          parseInt(parts[1], 10) - 1,
          parseInt(parts[0], 10));

        response.response[index].date = dt;
      }

      arr = response.response.sort(function (a: any, b: any) {
        return a.date - b.date;
      });

      for (let index = 0; index < arr.length; index++) {
        arr[index].date = this.formatDate(arr[index].date); 
      }

      this.futureAppointments = arr;
    });

    this.bcrBackendService.getCurrentAmount().subscribe(response => {
      this.currentAmount = response.response;
    });
  }

  formatDate(d: Date): string {
    var
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2)
      month = '0' + month;
    if (day.length < 2)
      day = '0' + day;
    return day + "/" + month + "/" + year;
  }
}
