import { Component, OnInit } from '@angular/core';
import { StreamChat, ChannelData, Message, User } from 'stream-chat';
import axios from 'axios';
import { type } from 'os';

@Component({
  selector: 'app-room-dev',
  templateUrl: './room-dev.component.html',
  styleUrls: ['./room-dev.component.scss']
})
export class RoomDevComponent implements OnInit {

  regexuname: RegExp = /^[A-Za-z_]+$/;
  regexrnumber: RegExp = /\d\d\d/
  readyToJoin: Boolean = false;
  title = 'angular-chat';
  channel: ChannelData;
  username;
  roomnumber;
  messageSent = false;
  messages: Message[] = [];
  channelList: ChannelData[];
  chatClient: any;
  currentUser: User;
  voteStr: string;

  constructor() { }

  ngOnInit(): void {
  }

  setupRoom(uname: Text, roomnumber: Text) {
    this.username = uname;
    this.username.toString();
    this.roomnumber = roomnumber;
    this.roomnumber.toString();

    if (!this.regexuname.test(this.username) || !this.regexrnumber.test(this.roomnumber)) {
      document.getElementById("regexnameWarning").style.backgroundColor = "red";
      document.getElementById("regexnameWarning").style.backgroundColor = "red";
      document.getElementById("regexnameWarning").innerHTML = "Username :Only alphanumeric characters and underscore are allowed (Spaces not permitted). <br> Room-Number: Only numbers allowed, min 3 digits.";
    }
    else {
      this.joinChat();
    }

  }

  // u wanted to change the reference of the roomnumber since u need to give it with the API-POST to the new JoinSM-route
  async joinChat() {
    const username = this.username;
    const roomnumber = this.roomnumber;

    try {
      // calls server on the join route with username, then recieves token and api key
      const response = await axios.post('http://localhost:5500/join', {
        username,
        roomnumber
      });
      console.log(response.status);
      if (response.status == 202) {
        document.getElementById("regexnameWarning").innerHTML = "Room doesn't Exist";
        return;
      }
      const { token } = response.data;
      const apiKey = response.data.api_key;

      this.chatClient = new StreamChat(apiKey);

      this.currentUser = await this.chatClient.setUser(
        {
          id: username,
          name: username,
        },
        token
      );

      // connect to channel talkshop channel and listen for new messages
      const channel = this.chatClient.channel('team', roomnumber);
      await channel.watch();
      this.channel = channel;
      this.readyToJoin = true;
      console.log("BACKEND: Room Created!")

      this.messages = channel.state.messages;
      channel.on('message.new', event => {
        // add new message to message-array
        this.messages = [...this.messages, event.message];
      });
    } catch (err) {
      console.log(err);
      return;
    }
  }

  async sendMessage(vote: number) {
    this.voteStr = vote.toString();
    if (this.voteStr === '') {
      return;
    }

    try {
      await this.channel.sendMessage({
        text: this.voteStr,
      });
    } catch (err) {
      console.log(err);
    }
    console.log(this.voteStr);
    console.log(typeof this.voteStr);
    this.messageSent = true;
    console.log(this.channel.state.messages)
  }
}
