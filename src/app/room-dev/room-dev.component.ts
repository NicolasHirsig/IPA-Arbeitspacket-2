import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { StreamChat, ChannelData, Message, User, AnyResource } from 'stream-chat';
import axios from 'axios';
import { type } from 'os';
import { randomBytes } from 'crypto';
import { typeofExpr } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'app-room-dev',
  templateUrl: './room-dev.component.html',
  styleUrls: ['./room-dev.component.scss'],
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class RoomDevComponent implements OnInit {

  regexuname: RegExp = /^[A-Za-z_]+$/;
  regexrnumber: RegExp = /\d\d\d/
  readyToJoin: Boolean;
  title = 'angular-chat';
  channel: ChannelData;
  username;
  roomnumber;
  messages: Message[] = [];
  channelList: ChannelData[];
  chatClient: any;
  currentUser: User;
  voteStr: string;
  message: any;
  importantMessage: string;
  showMessage: boolean;

  constructor(private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
  }

  setupRoom(uname: Text, roomnumber: Text) {
    this.username = uname;
    this.username.toString();
    this.roomnumber = roomnumber;
    this.roomnumber.toString();

    if (!this.regexuname.test(this.username) || !this.regexrnumber.test(this.roomnumber)) {
      this.handleResponse('regex');
    }
    else {
      this.joinChat();
    }
  }

  // u wanted to change the reference of the roomnumber since u need to give it with the API-POST to the new JoinSM-route
  async joinChat() {
    try {
      console.log(this.username);
      if (this.username == "deleteAllChannels" && this.roomnumber == "420") {
        try {
          console.log("Launched channel removal!");
          await axios.post('http://localhost:5500/deleteChannels', {
          });
        } catch (err) {
          console.log(err);
        }
        document.getElementById("regexnameWarning").innerHTML = "All rooms deleted :'D";
        return;
      }
      // calls server on the join route with username, then recieves token and api key
      const response = await axios.post('http://localhost:5500/join', {
        username: this.username,
        roomnumber: this.roomnumber
      });

      const { token } = response.data;
      console.log(response.status);
      const apiKey = response.data.api_key;
      this.chatClient = new StreamChat(apiKey);

      if (response.status != 200) {
        this.handleResponse(response.status);
      }

      this.currentUser = await this.chatClient.setUser(
        {
          id: this.username,
          name: this.username,
        },
        token
      );

      // connect to channel and listen for new messages
      const channel = this.chatClient.channel('team', this.roomnumber);
      await channel.watch();
      this.channel = channel;
      this.readyToJoin = true;

      this.messages = channel.state.messages;

      channel.on('message.new', event => {
        // add new message to message-array
        this.messages = [...this.messages, event.message];
      });

      channel.on('message.updated', event => {
        this.messages = channel.state.messages;
        if (event.message.user.role === "admin") {
          console.log(event.message.reveal);
          // if event.message.reveal exists, return its value (in typescrit :C), otherwise false
          this.showMessage = event.message.reveal ? event.message.reveal : false;
          console.log(event.message.deleted);
          if (event.message.deleted == true) {
            alert("This room has been deleted!");
          }
        }
      });

      try {
        this.message = await this.channel.sendMessage({
          text: "-"
        });
      } catch (err) {
        console.log(err);
      }

      console.log(this.messages);

    } catch (err) {
      console.log(err);
      return;
    }
  }

  handleResponse(code) {
    document.getElementById("regexnameWarning").style.backgroundColor = "#CB1A11";
    document.getElementById("regexnameWarning").style.color = "white";
    switch (code) {
      case 202:
        document.getElementById("regexnameWarning").innerHTML = "Room doesn't Exist";
        return;
      case 203:
        document.getElementById("regexnameWarning").innerHTML = "User already exists in this room";
        return;
      case 'regex':
        document.getElementById("regexnameWarning").innerHTML = "Username: Only alphanumeric characters and underscore (no spaces). <br> Room-Number: Only numbers allowed, min 3 digits.";
        return;
    }
  }

  async updateMessage(vote) {
    if (this.voteStr === '') {
      return;
    }

    this.message.message.text = vote;
    try {
      console.log(this.message);
      await this.chatClient.updateMessage(this.message.message);
    } catch (err) {
      console.log(err);
    }
  }
}
