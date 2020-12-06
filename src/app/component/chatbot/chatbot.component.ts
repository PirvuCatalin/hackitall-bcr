import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalDirective } from 'angular-bootstrap-md';
import { BcrBackendService } from 'src/app/service/bcr-backend.service';
import { CommonService } from 'src/app/service/common.service';

@Component({
  selector: 'app-chatbot',
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.css']
})
export class ChatbotComponent implements OnInit {
  @ViewChild('demoBasic', { static: true }) modal: ModalDirective | undefined;

  constructor(public commonService: CommonService, private bcrBackendService: BcrBackendService) { }

  userChatDisabled = false;

  messages: any = [
    // {"sender":"user", "message": "Hello chatbot!"},
    // {"sender":"bot", "message": "Hi there, how can I help you in this wonderful day?"},
    // {"sender":"user", "message": "I need some info about the X thing"},
    // {"sender":"bot", "message": "Very well then, here you go: X is very Y!"}
  ];

  ngOnInit(): void {
  }

  openModal() {
    // this.messages = [];
    if (this.modal) {
      this.modal.show();
    }
  }

  sendMessage() {
    var message = (<HTMLInputElement>document.getElementById("exampleFormControlTextarea2")).value;
    console.log(message);

    if (!message || message == "") {
      document.getElementById("exampleFormControlTextarea2")?.classList.add("is-invalid");
    } else {
      document.getElementById("exampleFormControlTextarea2")?.classList.remove("is-invalid");
      this.handleSendMessage(message);
    }

    this.updateTimes();
  }

  handleSendMessage(message: string) {
    this.userChatDisabled = true;
    this.messages.push({ "sender": "user", "message": message, "time": Date.now(), "minsAgo": 0 });
    (<HTMLInputElement>document.getElementById("exampleFormControlTextarea2")).value = "";

    this.bcrBackendService.sendMessage({message: message}).subscribe(response => {
      this.messages.push({ "sender": "bot", "message": response.response, "time": Date.now(), "minsAgo": 0 });
      this.userChatDisabled = false;
    });
  }

  updateTimes() {
    for (let index = 0; index < this.messages.length; index++) {
      this.messages[index]["minsAgo"] = Math.floor((Date.now() - this.messages[index]["time"]) / (60 * 1000));
    }
  }
}
