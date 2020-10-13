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
  regexrnumber: RegExp = /\d\d\d/
  readyToJoin: Boolean = false;
  title = 'angular-chat';
  channel: ChannelData;
  username;
  roomnumber;
  messages: Message[] = [];
  newMessage = '';
  channelList: ChannelData[];
  chatClient: any;
  currentUser: User;

  constructor() { }

  ngOnInit(): void {
    console.log()
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
        },
        token
      );

      // connect to channel talkshop channel and listen for new messages
      const channel = this.chatClient.channel('team', roomnumber);
      await channel.watch();
      this.channel = channel;
      this.readyToJoin = true;

      this.messages = channel.state.messages;

      channel.on('message.new', event => {
        // add new message to message-array
        this.messages = [...this.messages, event.message];
      });

      channel.on('message.updated', event => {
        // add new message to message-array
        this.messages = channel.state.messages;
      });

    } catch (err) {
      console.log(err);
      return;
    }
  }

  async removeRoom() {
    const username = this.username;
    const roomnumber = this.roomnumber;

    const response = await axios.post('http://localhost:5500/delete', {
      username,
      roomnumber
    });
    this.readyToJoin = false;

  }
}
