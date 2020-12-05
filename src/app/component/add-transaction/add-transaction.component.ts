import { Component, OnInit } from '@angular/core';
import { BcrBackendService } from 'src/app/service/bcr-backend.service';

@Component({
  selector: 'app-add-transaction',
  templateUrl: './add-transaction.component.html',
  styleUrls: ['./add-transaction.component.css']
})
export class AddTransactionComponent implements OnInit {

  constructor(private bcrBackendService: BcrBackendService) { }

  maxDate = "";

  ngOnInit(): void {
    var dtToday = new Date();

    var month = dtToday.getMonth() + 1;
    var day = dtToday.getDate();
    var year = dtToday.getFullYear();

    let monthString;
    let dayString;
    if (month < 10)
      monthString = '0' + month.toString();
    if (day < 10)
      dayString = '0' + day.toString();

    this.maxDate = year + '-' + month + '-' + day;
  }

  fieldsHaveError = false;
  hideAddTransaction = false;
  hideWantNewTransaction = true;
  errorMessage = "Please correct the errors.";

  FASHION = "Fashion"
    GROCERIES = "Groceries"
    RESTAURANT = "Restaurant"
    LEISURE = "Leisure"
    SPORTS = "Sports"

  transactionPlaces: any = {
    "Fashion": ["Zara", "Bershka", "Pull and Bear"],
    "Groceries": ["Lidl", "Mega Image", "Kaufland"],
    "Restaurant": ["Zaitoone", "Sheherzade", "Pizza Hut"],
    "Leisure": ["Lacul Snagov", "Radisson Blu Bucharest", "Therme"],
    "Sports": ["Tactical Shooting Range", "Poligonul Iosif Sarbu", "Arena Nationala"]
  }

  currentPlaces = ["Zara", "Bershka", "Pull and Bear"];

  onChangeType(transactionType: any) {
    this.currentPlaces = this.transactionPlaces[transactionType.value];
  }

  addNewTransaction() {
    var type = (<HTMLInputElement>document.getElementById("defaultContactFormType")).value;
    var date = (<HTMLInputElement>document.getElementById("defaultContactFormDate")).value;
    var place = (<HTMLInputElement>document.getElementById("defaultContactFormPlace")).value;
    var amount = (<HTMLInputElement>document.getElementById("defaultContactFormAmount")).value;

    if (this.validateFields(type, date, place, amount)) {
      this.fieldsHaveError = false;
      // add transaction
      let transaction = {
        "transaction_type": type,
        "date": this.formatDate(date),
        "place": place,
        "amount_spent": parseFloat(amount)
      };

      console.log(transaction);

      this.bcrBackendService.addTransaction(transaction).subscribe(data => {
        if (data.errors) { // error
          this.fieldsHaveError = true;
          this.errorMessage = data.errors;
        } else { //success
          this.fieldsHaveError = false;
          this.handleSucess();
        }
        console.log("success");
        console.log(data);
      }, error => {
        console.log("error");
        console.log(error);
      });
    } else {
      //nothing
      this.fieldsHaveError = true;
    }
  }

  handleSucess() {
    this.hideAddTransaction = true;
    this.hideWantNewTransaction = false;
  }

  wantNewTransaction() {
    this.hideAddTransaction = false;
    this.hideWantNewTransaction = true;
    (<HTMLInputElement>document.getElementById("defaultContactFormType")).value = "Fashion";
    (<HTMLInputElement>document.getElementById("defaultContactFormDate")).value = "";
    (<HTMLInputElement>document.getElementById("defaultContactFormPlace")).value = "";
    (<HTMLInputElement>document.getElementById("defaultContactFormAmount")).value = "";
  }

  validateFields(type: string, date: string, place: string, amount: string): boolean {
    let allValid = true;

    if (!type || type == "") {
      document.getElementById("defaultContactFormType")?.classList.add("is-invalid");
      allValid = false;
    } else {
      document.getElementById("defaultContactFormType")?.classList.remove("is-invalid");
    }

    if (!date || isNaN(Date.parse(date))) {
      document.getElementById("defaultContactFormDate")?.classList.add("is-invalid");
      allValid = false;
    } else {
      document.getElementById("defaultContactFormDate")?.classList.remove("is-invalid");
    }

    if (!place || place == "") {
      document.getElementById("defaultContactFormPlace")?.classList.add("is-invalid");
      allValid = false;
    } else {
      document.getElementById("defaultContactFormPlace")?.classList.remove("is-invalid");
    }

    if (!amount || isNaN(parseFloat(amount))) {
      document.getElementById("defaultContactFormAmount")?.classList.add("is-invalid");
      allValid = false;
    } else {
      document.getElementById("defaultContactFormAmount")?.classList.remove("is-invalid");
    }

    return allValid;
  }

  formatDate(date: string): string {
    var d = new Date(Date.parse(date));
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
