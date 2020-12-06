import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RegisterService } from 'src/app/service/register.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  constructor(private registerService: RegisterService, private router: Router) { }

  uploadIdHidden = true;
  checkButtonHidden = true;
  chooseSelfieDisabled = true;
  inputDisabled = false;
  retakePhotosAlertHidden = true;
  signInDisabled = true;
  spinnerHidden = true;

  passwordOk = false;
  phoneOk = false;

  imageFile: any = null;
  idFile: any = null;

  email: string = "";
  password: string = "";
  phone: string = "";

  errorMessage: string = "Couldn't identify your face, please try retaking the photos.";

  ngOnInit(): void {
  }

  onKey(event: any) { // without type info
    this.email = event.target.value;
    this.checkIfEmail();
  }

  checkIfEmail(): boolean {
    console.log(this.email);
    if (!this.email || this.email == "" || !this.validateEmail(this.email)) {
      document.getElementById("defaultRegisterFormEmail")?.classList.add("is-invalid");
      this.chooseSelfieDisabled = true;
      return false;
    } else {
      document.getElementById("defaultRegisterFormEmail")?.classList.remove("is-invalid");
      this.chooseSelfieDisabled = false;
      return true;
    }
  }

  validateEmail(email: string) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  handleSelfieInput(file: any) {
    if (!this.checkIfEmail()) {
      document.getElementById("defaultRegisterFormEmail")?.classList.add("is-invalid");
    } else {
      this.inputDisabled = true;
      this.imageFile = file.files[0];
      this.uploadIdHidden = false;
    }

  }

  handleIDInput(file: any) {
    this.checkButtonHidden = false;
    this.idFile = file.files[0];
  }

  checkImages() {
    console.log(this.imageFile);
    console.log(this.idFile);
    this.spinnerHidden = false;
    this.registerService.uploadImages(this.email, this.imageFile, this.idFile).subscribe(data => {
      this.spinnerHidden = true;
      if (data["errors"] && data["errors"].length > 0) {
        console.log("error");
        console.log(data);
        if (data.errors == "User already exists") {
          this.errorMessage = "Email already in use. Try logging in.";
          this.inputDisabled = false;
        } else if (data.errors == "Invalid email") {
          this.errorMessage = "Invalid email address ;(";
          this.inputDisabled = false;
        }
        this.uploadIdHidden = true;
        this.checkButtonHidden = true;
        this.retakePhotosAlertHidden = false;
      } else {
        // do something, if upload success
        console.log("success");
        console.log(data);
        let uploadImagesScreen = document.getElementById("uploadImagesScreen")
        if (uploadImagesScreen) {
          uploadImagesScreen.style.display = "none";
        }
        let signupScreen = document.getElementById("signupScreen")
        if (signupScreen) {
          signupScreen.style.display = "block";
        }
      }


    }, error => {
      console.log("error");
      console.log(error);

      this.uploadIdHidden = true;
      this.checkButtonHidden = true;
      this.retakePhotosAlertHidden = false;
    });
  }

  onKeyPassword(event: any) { // without type info
    this.password = event.target.value;
    if (!this.hasNumber(this.password) || this.password.length < 8) {
      document.getElementById("defaultRegisterFormPassword")?.classList.add("is-invalid");
      this.passwordOk = false;
    } else {
      document.getElementById("defaultRegisterFormPassword")?.classList.remove("is-invalid");
      this.passwordOk = true;
    }
    this.checkSignInButton();
  }

  onKeyPhone(event: any) { // without type info
    this.phone = event.target.value;
    if (!this.hasAllDigits(this.phone) || this.phone.length != 10) {
      document.getElementById("defaultRegisterPhonePassword")?.classList.add("is-invalid");
      this.phoneOk = false;
    } else {
      document.getElementById("defaultRegisterPhonePassword")?.classList.remove("is-invalid");
      this.phoneOk = true;
    }
    this.checkSignInButton();
  }

  checkSignInButton() {
    if (this.passwordOk && this.phoneOk) {
      this.signInDisabled = false;
    } else {
      this.signInDisabled = true;
    }
  }

  hasNumber(myString: string) {
    return /\d/.test(myString);
  }

  hasAllDigits(myString: string) {
    return /^\d+$/.test(myString);
  }

  signUp() {
    this.registerService.register(this.email, this.password, this.phone).subscribe(data => {
      console.log("success");
      console.log(data);
      this.router.navigate(['login']);
    }, error => {
      console.log("error");
      console.log(error);
    });
  }

  // handleFileInput(file: any) {
  //   let fileToUpload: File = file.files[0];
  //   console.log(fileToUpload);
  //   this.registerService.uploadFile(email, imageFile, idFile).subscribe(data => {
  //     // do something, if upload success
  //     console.log("success");
  //     console.log(data);
  //   }, error => {
  //     console.log("error");
  //     console.log(error);
  //   });
  // }

}
