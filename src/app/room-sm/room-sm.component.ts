import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-room-sm',
  templateUrl: './room-sm.component.html',
  styleUrls: ['./room-sm.component.scss']
})
export class RoomSmComponent implements OnInit {

  roomnr: number = this.getRandom();

  constructor() { }

  ngOnInit(): void {
  }

  getRandom() {
    return Math.floor(Math.random() * 10);
  }

}

export var roomnr;
