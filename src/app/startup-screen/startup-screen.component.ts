import { Component, OnInit } from '@angular/core';
// import { changeRole } from '../ext.actions'
import { Router } from '@angular/router'
import { RouterModule } from '@angular/router';
import axios from 'axios';

@Component({
  selector: 'app-startup-screen',
  templateUrl: './startup-screen.component.html',
  styleUrls: ['./startup-screen.component.scss']
})
export class StartupScreenComponent implements OnInit {

  role: string;

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  roleSM(): void {
    this.router.navigate(['/roomsm']);
  }

  roleDev(): void {
    this.router.navigate(['/roomdev']);
  }
}
