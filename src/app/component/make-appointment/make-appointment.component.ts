import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ModalDirective } from 'angular-bootstrap-md';
import { BcrBackendService } from 'src/app/service/bcr-backend.service';

@Component({
  selector: 'app-make-appointment',
  templateUrl: './make-appointment.component.html',
  styleUrls: ['./make-appointment.component.css']
})
export class MakeAppointmentComponent implements OnInit {
  @ViewChild('demoBasic', { static: true }) modal: ModalDirective | undefined;

  errorMessage = "Please correct the errors.";

  lat = 0;
  long = 0;

  fieldsHaveError = false;

  constructor(private bcrBackendService: BcrBackendService, private router: Router) { }

  ngOnInit(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(pos => {
        this.long = pos.coords.longitude;
        this.lat = pos.coords.latitude;
        console.log(this.lat);
        console.log(this.long);
      });
    }
  }

  onChangeReason(transactionType: any) {
    // this.currentPlaces = this.transactionPlaces[transactionType.value];
  }

  makeNewAppointment() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(pos => {
        this.long = pos.coords.longitude;
        this.lat = pos.coords.latitude;
        console.log(this.lat);
        console.log(this.long);
      });
    }

    var reason = (<HTMLInputElement>document.getElementById("defaultContactFormReason")).value;
    var date = (<HTMLInputElement>document.getElementById("defaultContactFormDate")).value;

    if (this.validateFields(reason, date)) {
      this.fieldsHaveError = false;
      // add transaction
      let appointment = {
        "type": reason,
        "date": this.formatDate(date),
        "lat": this.lat,
        "long": this.long
      };

      console.log(appointment);

      this.bcrBackendService.addAppointment(appointment).subscribe(data => {
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
    if (this.modal) {
      this.modal.show();
    }

    setTimeout(() => {
      if (this.modal) {
        this.modal.hide();
        this.router.navigateByUrl("/");
      }
    }, 3000);
  }

  validateFields(reason: string, date: string): boolean {
    let allValid = true;

    if (!reason || reason == "") {
      document.getElementById("defaultContactFormReason")?.classList.add("is-invalid");
      allValid = false;
    } else {
      document.getElementById("defaultContactFormReason")?.classList.remove("is-invalid");
    }

    if (!date || isNaN(Date.parse(date))) {
      document.getElementById("defaultContactFormDate")?.classList.add("is-invalid");
      allValid = false;
    } else {
      document.getElementById("defaultContactFormDate")?.classList.remove("is-invalid");
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
