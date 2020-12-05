import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RegisterService } from 'src/app/service/register.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginError = false;
  email: string = "";
  password: string = "";

  constructor(private registerService: RegisterService, private router: Router) { }

  ngOnInit(): void {
  }

  login() {
    var email = (<HTMLInputElement>document.getElementById("defaultLoginFormEmail")).value;
    var password = (<HTMLInputElement>document.getElementById("defaultLoginFormPassword")).value;
    if (email != null && password) {
      this.registerService.login(email, password).subscribe(data => {
        if (data.errors) {
          this.loginError = true;
        } else {
          this.loginError = false;
          this.router.navigate(['home']);
        }
        console.log("success");
        console.log(data);
      }, error => {
        console.log("error");
        console.log(error);
        this.loginError = true;
      });
    }
  }


}
