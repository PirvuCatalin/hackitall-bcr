import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  token: string = "";


  constructor() { }

  setToken(token: string) {
    this.token = token;
    localStorage.setItem("jwt-token-verySecure", token);
  }

  getToken() {
    if (this.token == "") {
      let localToken = localStorage.getItem("jwt-token-verySecure");
      if (localToken && localToken != "") {
        return localToken;
      } else {
        return null;
      }
    } else {
      return this.token;
    }
  }

  isLoggedIn(): boolean {
    if (this.getToken() != null) {
      return true;
    } else {
      return false
    }
  }
}
