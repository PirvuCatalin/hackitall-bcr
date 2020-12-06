import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ModalDirective } from 'angular-bootstrap-md';
import { RegisterService } from 'src/app/service/register.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  @ViewChild('demoBasic', { static: true }) modal: ModalDirective | undefined;
  @ViewChild('video', { static: true }) videoElement: ElementRef | undefined;
  @ViewChild('canvas', { static: true }) canvas: ElementRef | undefined;

  constructor(private registerService: RegisterService, private router: Router, private renderer: Renderer2) { }

  constraints = {
    video: {
      facingMode: "environment",
      width: { ideal: 4096 },
      height: { ideal: 2160 }
    }
  };

  uploadIdHidden = true;
  checkButtonHidden = true;
  chooseSelfieDisabled = true;
  inputDisabled = false;
  retakePhotosAlertHidden = true;
  signInDisabled = true;
  spinnerHidden = true;

  passwordOk = false;
  phoneOk = false;

  showSelfieCamera = true;
  showIdCamera = false;

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
      this.showIdCamera = true;
      this.showSelfieCamera = false;
    }

  }

  handleIDInput(file: any) {
    this.checkButtonHidden = false;
    this.showIdCamera = false;
    this.idFile = file.files[0];
  }

  cameras: any = null;

  startCamera() {
    if (!!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)) {
      navigator.mediaDevices.getUserMedia(this.constraints).then(this.attachVideo.bind(this)).catch(this.handleError);
    } else {
      alert('Sorry, camera not available.');
    }
  }

  handleError(error: any) {
    console.log('Error: ', error);
  }

  videoWidth = 0;
  videoHeight = 0;

  srcToFile(src: any, fileName: any, mimeType: any) {
    return (fetch(src)
      .then(function (res) { return res.arrayBuffer(); })
      .then(function (buf) { return new File([buf], fileName, { type: mimeType }); })
    );
  }

  capture() {
    this.renderer.setProperty(this.canvas?.nativeElement, 'width', this.videoWidth);
    this.renderer.setProperty(this.canvas?.nativeElement, 'height', this.videoHeight);
    this.canvas?.nativeElement.getContext('2d').drawImage(this.videoElement?.nativeElement, 0, 0);

    var canvas = <HTMLCanvasElement>document.getElementById("canvas");

    let that = this;
    this.srcToFile(canvas?.toDataURL("image/png"), "testName", "image/png")
      .then(function (file) {
        if (that.showSelfieCamera) {
          that.modal?.hide();
    
          that.cameras.getTracks().forEach(function (track: any) {
            track.stop();
          });
    
          if (!that.checkIfEmail()) {
            document.getElementById("defaultRegisterFormEmail")?.classList.add("is-invalid");
          } else {
            that.inputDisabled = true;
            that.imageFile = file;
            that.uploadIdHidden = false;
          }
    
          that.showSelfieCamera = false;
          that.showIdCamera = true;
        } else {
          that.modal?.hide();
    
          that.cameras.getTracks().forEach(function (track: any) {
            track.stop();
          });
    
          that.checkButtonHidden = false;
          that.idFile = file;
          that.showIdCamera = false;
        }
      });
  }

  attachVideo(stream: any) {
    this.cameras = stream;
    this.renderer.setProperty(this.videoElement?.nativeElement, 'srcObject', stream);
    this.renderer.listen(this.videoElement?.nativeElement, 'play', (event) => {
      this.videoHeight = this.videoElement?.nativeElement.videoHeight;
      this.videoWidth = this.videoElement?.nativeElement.videoWidth;
    });
  }

  openSelfieCamera() {
    if (this.modal) {
      this.modal.show();

      this.startCamera();
    }
  }

  checkImages() {
    var bypassChecks = (<HTMLInputElement>document.getElementById("bypassChecks")).checked;

    console.log(this.imageFile);
    console.log(this.idFile);
    this.spinnerHidden = false;

    if (bypassChecks) {
      this.registerService.bypassUploadImages(this.email, this.imageFile, this.idFile).subscribe(data => {
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
          this.showSelfieCamera = true;
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
        this.showSelfieCamera = true;
      });
    } else {
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
          this.showSelfieCamera = true;
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
        this.showSelfieCamera = true;
      });
    }


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
