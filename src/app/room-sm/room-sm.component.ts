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

  regexp: RegExp = /^[A-Za-z_]+$/;
  readyToJoin: Boolean = false;
  title = 'angular-chat';
  channel: ChannelData;
  username;
  messages: Message[] = [];
  newMessage = '';
  channelList: ChannelData[];
  chatClient: any;
  currentUser: User;

  constructor() { }

  ngOnInit(): void {
  }

  setUsername(uname: Text) {
    this.username = uname;
    this.username.toString();
    if (!this.regexp.test(this.username)) {
      document.getElementById("regexWarning").style.backgroundColor = "red";
      document.getElementById("regexWarning").style.backgroundColor = "red";
      document.getElementById("regexWarning").innerHTML = "Only alphanumeric characters and underscore are allowed. (Spaces not permitted)";
    }
    else {
      this.joinChat()
    }

  }

  async joinChat() {
    const { username } = this;
    try {
      // calls server on the join route with username, then recieves token and api key
      const response = await axios.post('http://localhost:5500/join', {
        username,
      });
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
      const channel = this.chatClient.channel('team', 'talkshop');
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

  // async sendMessage() {
  //   if (this.newMessage.trim() === '') {
  //     return;
  //   }

  //   try {
  //     await this.channel.sendMessage({
  //       text: this.newMessage,
  //     });
  //     this.newMessage = '';
  //   } catch (err) {
  //     console.log(err);
  //   }
  // }
}

export var roomnr;
