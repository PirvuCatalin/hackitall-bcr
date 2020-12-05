import { Component, OnInit } from '@angular/core';
import { BcrBackendService } from 'src/app/service/bcr-backend.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private bcrBackendService: BcrBackendService) { }

  textFromBackend = "No text from backend ;(";

  ngOnInit(): void {
    this.bcrBackendService.getText().subscribe(response => {
      this.textFromBackend = JSON.stringify(response);
    })
  }

}
