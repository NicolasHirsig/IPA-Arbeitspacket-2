import { Component, OnInit } from '@angular/core';
import { StreamChat, ChannelData, Message, User } from 'stream-chat';
import axios from 'axios';

@Component({
  selector: 'app-room-dev',
  templateUrl: './room-dev.component.html',
  styleUrls: ['./room-dev.component.scss'],
})
export class RoomDevComponent implements OnInit {
  regexuname: RegExp = /^[A-Za-z_]+$/;
  regexrnumber: RegExp = /\d\d\d/;
  readyToJoin: Boolean;
  title = 'angular-chat';
  channel: ChannelData;
  username;
  roomnumber;
  messages: Message[] = [];
  chatClient: any;
  currentUser: User;
  voteStr: string;
  message: any;
  showMessage: boolean;
  canvasActive: boolean;
  votes: string[] = ['0.5', '1', '2', '3', '5', '8', '13', '20', '?'];

  constructor() {}

  ngOnInit(): void {}

  setupRoom(uname: Text, roomnumber: Text) {
    this.username = uname;
    this.username.toString();
    this.roomnumber = roomnumber;
    this.roomnumber.toString();

    if (
      !this.regexuname.test(this.username) ||
      !this.regexrnumber.test(this.roomnumber)
    ) {
      this.handleResponse('regex');
    } else {
      this.joinChat();
    }
  }

  async joinChat() {
    try {
      if (this.username == 'deleteAllChannels' && this.roomnumber == '420') {
        try {
          console.log('Launched channel removal!');
          await axios.post('http://localhost:5500/deleteChannels', {});
        } catch (err) {
          console.log(err);
        }
        document.getElementById('regexnameWarning').innerHTML =
          "All rooms deleted :'D";
        return;
      }

      const response = await axios.post('http://localhost:5500/join', {
        username: this.username,
        roomnumber: this.roomnumber,
      });

      const { token } = response.data;
      console.log(response.status);
      if (response.status != 200) {
        this.handleResponse(response.status);
        return;
      }
      const apiKey = response.data.api_key;
      this.chatClient = new StreamChat(apiKey);

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

      channel.on('message.new', (event) => {
        this.messages = [...this.messages, event.message];
      });

      channel.on('message.updated', (event) => {
        this.messages = channel.state.messages;
        if (event.message.user.role === 'admin') {
          // if event.message.reveal exists, return its value (in typescrit :C), otherwise false
          this.showMessage = event.message.reveal
            ? event.message.reveal
            : false;
          // if showMessage is true, all buttons are disabled
          if (event.message.deleted == true) {
            alert('This room has been deleted!');
          }
          if (event.message.confetti == true) {
            var canvas = <HTMLCanvasElement>document.getElementById('canvas');
            canvas.style.display = 'initial';
            var ctx = canvas.getContext('2d');
            var W = window.innerWidth;
            var H = window.innerHeight;
            canvas.width = W;
            canvas.height = H;
            var counter: number = 0;
            var mp = 70; //max particles
            var particles = [];
            for (var i = 0; i < mp; i++) {
              particles.push({
                x: Math.random() * W, //x-coordinate
                y: Math.random() * H, //y-coordinate
                r: Math.random() * 8 + 1, //radius
                d: Math.random() * mp, //density
                color:
                  'rgba(' +
                  Math.floor(Math.random() * 255) +
                  ', ' +
                  Math.floor(Math.random() * 255) +
                  ', ' +
                  Math.floor(Math.random() * 255) +
                  ', 1)',
              });
            }
            function draw() {
              ctx.clearRect(0, 0, W, H);

              for (var i = 0; i < mp; i++) {
                var p = particles[i];
                ctx.beginPath();
                ctx.fillStyle = p.color;
                ctx.moveTo(p.x, p.y);
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2, true);
                ctx.fill();
              }
              counter++;
              if (counter == 500) {
                clearInterval(myInterval);
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                canvas.style.display = 'none';
              }
              update();
            }
            var angle = 0;
            function update() {
              angle += 0.01;
              for (var i = 0; i < mp; i++) {
                var p = particles[i];
                p.y += Math.cos(angle + p.d) + 1 + p.r / 2;
                p.x += Math.sin(angle) * 2;
                if (p.x > W + 5 || p.x < -5 || p.y > H) {
                  if (i % 3 > 0) {
                    particles[i] = {
                      x: Math.random() * W,
                      y: -10,
                      r: p.r,
                      d: p.d,
                      color: p.color,
                    };
                  } else {
                    if (Math.sin(angle) > 0) {
                      particles[i] = {
                        x: -5,
                        y: Math.random() * H,
                        r: p.r,
                        d: p.d,
                        color: p.color,
                      };
                    } else {
                      particles[i] = {
                        x: W + 5,
                        y: Math.random() * H,
                        r: p.r,
                        d: p.d,
                        color: p.color,
                      };
                    }
                  }
                }
              }
            }

            //animation loop
            var myInterval = setInterval(draw, 10);
          }
        }
      });

      try {
        this.message = await this.channel.sendMessage({
          text: '-',
        });
      } catch (err) {
        console.log(err);
      }
    } catch (err) {
      this.handleResponse('server');
      console.log(err);
      return;
    }
  }

  handleResponse(code) {
    document.getElementById('regexnameWarning').style.backgroundColor =
      '#CB1A11';
    document.getElementById('regexnameWarning').style.color = 'white';
    switch (code) {
      case 202:
        document.getElementById('regexnameWarning').innerHTML =
          "Room doesn't Exist";
        return;
      case 203:
        document.getElementById('regexnameWarning').innerHTML =
          'User already exists in this room';
        return;
      case 'regex':
        document.getElementById('regexnameWarning').innerHTML =
          'Username: Only alphanumeric characters and underscore (no spaces). <br> Room-Number: Only numbers allowed, min 3 digits.';
        return;
      case 'server':
        document.getElementById('regexnameWarning').style.backgroundColor =
          '#FFCC00';
        document.getElementById('regexnameWarning').style.color = 'white';
        document.getElementById('regexnameWarning').innerHTML =
          'Could not reach server. Did you start Server.js?';
        return;
    }
  }

  async updateMessage(vote) {
    if (this.voteStr === '') {
      return;
    }

    this.message.message.text = vote;
    try {
      await this.chatClient.updateMessage(this.message.message);
    } catch (err) {
      console.log(err);
    }
  }
}
