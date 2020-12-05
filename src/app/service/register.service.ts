import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CommonService } from '../service/common.service';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {
  uploadFileUrl = 'https://bcr-backend.herokuapp.com/validate_images';
  registerUrl = 'https://bcr-backend.herokuapp.com/register';
  loginUrl = 'https://bcr-backend.herokuapp.com/login';

  constructor(private http: HttpClient, private commonService: CommonService) { }

  uploadImages(email: string, imageFile: any, idFile: any): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('email', email);
    formData.append('file_image', imageFile);
    formData.append('file_id', idFile);
    return this.http
      .post(this.uploadFileUrl, formData)
      .pipe(map((response: any) => response));
  }

  register(email: string, password: string, phone: string): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('email', email);
    formData.append('password', password);
    formData.append('phone', phone);
    return this.http
      .post(this.registerUrl, formData)
      .pipe(map((response: any) => response));
  }

  login(email: any, password: any): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('email', email);
    formData.append('password', password);
    return this.http
      .post(this.loginUrl, formData)
      .pipe(map((response: any) => {
        this.commonService.setToken(response.response);
        return response;
      }));
  }
}
