import { Component, OnInit } from '@angular/core';
import { StreamChat, ChannelData, Message, User } from 'stream-chat';
import axios from 'axios';
import { Console } from 'console';

@Component({
  selector: 'app-room-sm',
  templateUrl: './room-sm.component.html',
  styleUrls: ['./room-sm.component.scss'],
})
export class RoomSmComponent implements OnInit {
  regexuname: RegExp = /^[A-Za-z_]+$/;
  readyToCreate: Boolean;
  title = 'angular-chat';
  username;
  roomnumber;
  messages: Message[] = [];
  newMessage = '';
  channelList: ChannelData[];
  chatClient: any;
  currentUser: User;
  message: any;
  showMessage: boolean;

  constructor() {}

  ngOnInit(): void {
    console.log();
  }

  setupRoom(uname: Text, roomnumber: Text) {
    this.username = uname;
    this.username.toString();
    const rand = Math.floor(Math.random() * Math.floor(9000));
    // due to the random number being converted to string, the number gets changed but stays in the realm (dont ask me why)
    this.roomnumber = rand.toString(8);

    if (!this.regexuname.test(this.username)) {
      document.getElementById('regexnameWarning').style.backgroundColor =
        '#CB1A11';
      document.getElementById('regexnameWarning').style.color = 'white';
      document.getElementById('regexnameWarning').innerHTML =
        'Username: Only alphanumeric characters and underscore (no spaces).';
    } else {
      this.createChat();
    }
  }

  async createChat() {
    try {
      // calls server on the join route with username, then recieves token and api key
      const response = await axios.post('http://localhost:5500/create', {
        username: this.username,
        roomnumber: this.roomnumber,
      });
      console.log(response.status);
      if (response.status == 202) {
        document.getElementById('regexnameWarning').innerHTML =
          'Room already exists';
        return;
      }
      const { token } = response.data;
      const apiKey = response.data.api_key;

      this.chatClient = new StreamChat(apiKey);

      this.currentUser = await this.chatClient.setUser(
        {
          id: this.username,
          name: this.username,
          role: 'admin',
        },
        token
      );

      const channel = this.chatClient.channel('team', this.roomnumber);
      await channel.watch();
      this.readyToCreate = true;

      channel.on('message.new', (event) => {
        this.messages = [...this.messages, event.message];
      });

      channel.on('message.updated', (event) => {
        this.messages = channel.state.messages;
      });

      try {
        this.message = await channel.sendMessage({
          text: 'Votes:',
          reveal: false,
          deleted: false,
          confetti: false,
        });
      } catch (err) {
        console.log(err);
      }
    } catch (err) {
      document.getElementById('regexnameWarning').style.backgroundColor =
        '#FFCC00';
      document.getElementById('regexnameWarning').style.color = 'white';
      document.getElementById('regexnameWarning').innerHTML =
        'Could not reach server. Did you start Server.js?';
      console.log(err);
      return;
    }
  }

  async resetMessages() {
    for (let i in this.messages) {
      let j: number = +i;
      if (this.messages[j + 1]) {
        const message = { id: this.messages[j + 1].id, text: '-' };
        try {
          await this.chatClient.updateMessage(message);
        } catch (err) {
          console.log(err);
        }
      }
    }
    this.message.message.reveal = false;
    this.showMessage = false;
    this.message.message.confetti = false;
    try {
      await this.chatClient.updateMessage(this.message.message);
    } catch (err) {
      console.log(err);
    }
  }

  async revealMessages() {
    // iterate through message array to count them all together
    let k: number = 0;
    for (let i in this.messages) {
      let j: number = +i;
      if (
        this.messages[j + 1] &&
        this.messages[j + 1].text !== '?' &&
        this.messages[j + 1].text !== '-'
      ) {
        k = k + +this.messages[j + 1].text;
      }
    }
    k = k / (this.messages.length - 1);
    this.message.message.text = 'Ø = ' + k;
    this.message.message.reveal = true;
    this.showMessage = true;
    if (this.messages.length > 2) {
      this.addConfetti();
    }
    try {
      await this.chatClient.updateMessage(this.message.message);
    } catch (err) {
      console.log(err);
    }
  }

  // checks messages if they have the same value. If they do, display confetti animation
  async addConfetti() {
    const value = this.messages[1].text;
    var counter = 0;
    for (let i in this.messages) {
      let j: number = +i;
      if (this.messages[j + 1] && this.messages[j + 1].text == value) {
        counter++;
      }
    }
    if (counter == this.messages.length - 1) {
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

      this.message.message.confetti = true;
      try {
        await this.chatClient.updateMessage(this.message.message);
      } catch (err) {
        console.log(err);
      }
    }
  }

  async removeRoom() {
    try {
      this.message.message.deleted = true;
      try {
        await this.chatClient.updateMessage(this.message.message);
      } catch (err) {
        console.log(err);
      }
      await axios.post('http://localhost:5500/delete', {
        roomnumber: this.roomnumber,
      });
    } catch (err) {
      console.log(err);
    }
    this.readyToCreate = false;
    this.messages = []; // emptying the messages array so it dont keep the old ones
  }

  // reveals voters that haven't voted yet
  async revealVoters() {
    var voters = [];
    console.log(this.messages);
    for (let i in this.messages) {
      if (this.messages[i] && this.messages[i].text == '-') {
        voters.push(this.messages[i].user.id);
      }
    }
    alert("These voters haven't voted yet: \n" + voters);
  }
}
