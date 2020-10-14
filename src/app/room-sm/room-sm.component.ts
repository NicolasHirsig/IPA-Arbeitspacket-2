import { Component, OnInit } from '@angular/core';
import { StreamChat, ChannelData, Message, User } from 'stream-chat';
import axios from 'axios';
import { Console } from 'console';

@Component({
  selector: 'app-room-sm',
  templateUrl: './room-sm.component.html',
  styleUrls: ['./room-sm.component.scss']
})
export class RoomSmComponent implements OnInit {

  regexuname: RegExp = /^[A-Za-z_]+$/;
  readyToCreate: Boolean;
  title = 'angular-chat';
  channel: ChannelData;
  username;
  roomnumber;
  messages: Message[] = [];
  newMessage = '';
  channelList: ChannelData[];
  chatClient: any;
  currentUser: User;
  message: any;
  showMessage: boolean;

  constructor() { }

  ngOnInit(): void {
    console.log()
  }

  setupRoom(uname: Text, roomnumber: Text) {
    this.username = uname;
    this.username.toString();
    const rand = Math.floor(Math.random() * Math.floor(9000));
    // due to the random number being converted to string, the number gets changed but stays in the realm (dont ask me why)
    this.roomnumber = rand.toString(8);

    if (!this.regexuname.test(this.username)) {
      document.getElementById("regexnameWarning").style.backgroundColor = "#CB1A11";
      document.getElementById("regexnameWarning").style.color = "white";
      document.getElementById("regexnameWarning").innerHTML = "Username: Only alphanumeric characters and underscore (no spaces).";
    }
    else {
      this.createChat();
    }
  }

  async resetMessages() {
    for (let i in this.messages) {
      let j: number = +i;
      if (this.messages[j + 1]) {
        console.log(typeof this.messages[j + 1].id);
        const message = { id: this.messages[j + 1].id, text: "" }
        try {
          await this.chatClient.updateMessage(message);
        } catch (err) {
          console.log(err);
        }
      }
    }
    this.message.message.reveal = false;
    try {
      await this.chatClient.updateMessage(this.message.message);
    } catch (err) {
      console.log(err);
    }
  }


  async createChat() {
    const username = this.username;
    const roomnumber = this.roomnumber;

    try {
      // calls server on the join route with username, then recieves token and api key
      const response = await axios.post('http://localhost:5500/create', {
        username,
        roomnumber
      });
      console.log(response.status);
      if (response.status == 202) {
        document.getElementById("regexnameWarning").innerHTML = "Room already exists";
        return;
      }
      const { token } = response.data;
      const apiKey = response.data.api_key;

      this.chatClient = new StreamChat(apiKey);

      this.currentUser = await this.chatClient.setUser(
        {
          id: username,
          name: username,
          role: "admin"
        },
        token
      );

      const channel = this.chatClient.channel('team', roomnumber);
      await channel.watch();
      this.channel = channel;
      this.readyToCreate = true;

      channel.on('message.new', event => {
        this.messages = [...this.messages, event.message];
      });

      channel.on('message.updated', event => {
        this.messages = channel.state.messages;
        console.log(event)
        if (event.message.user.role === "admin") {
          // if event.message.reveal exists, return its value (in typescrit :C)
          this.showMessage = event.message.reveal ? event.message.reveal : false;
        }
      });

      try {
        this.message = await this.channel.sendMessage({
          text: "Current Votes:",
          reveal: false
        });
      } catch (err) {
        console.log(err);
      }

    } catch (err) {
      console.log(err);
      return;
    }
  }

  async revealMessages() {
    this.message.message.reveal = true;
    try {
      await this.chatClient.updateMessage(this.message.message);
    } catch (err) {
      console.log(err);
    }
  }

  async removeRoom() {
    this.message.message.text = "the room has been closed."
    try {
      await this.chatClient.updateMessage(this.message.message);
      await axios.post('http://localhost:5500/delete', {
        roomnumber: this.roomnumber
      });
    } catch (err) {
      console.log(err);
    }
    this.readyToCreate = false;
  }
}
