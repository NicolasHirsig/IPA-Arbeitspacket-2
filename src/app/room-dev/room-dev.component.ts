import { Component, OnInit } from '@angular/core';
import { StreamChat, ChannelData, Message, User } from 'stream-chat';
import axios from 'axios';

@Component({
  selector: 'app-room-dev',
  templateUrl: './room-dev.component.html',
  styleUrls: ['./room-dev.component.scss']
})
export class RoomDevComponent implements OnInit {

  title = 'angular-chat';
  channel: ChannelData;
  username = '';
  messages: Message[] = [];
  newMessage = '';
  channelList: ChannelData[];
  chatClient: any;
  currentUser: User;

  constructor() { }

  ngOnInit(): void {
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
      console.log("RESPONSE:" + JSON.stringify(response.data));

      this.chatClient = new StreamChat(apiKey);

      this.currentUser = await this.chatClient.setUser(
        {
          id: username,
          name: username,
        },
        token
      );

      // connect to talkshop channel and listen for new messages
      const channel = this.chatClient.channel('team', 'talkshop');
      await channel.watch();
      this.channel = channel;
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
