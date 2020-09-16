import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { changeRole } from '../ext.actions'

@Component({
  selector: 'app-startup-screen',
  templateUrl: './startup-screen.component.html',
  styleUrls: ['./startup-screen.component.scss']
})
export class StartupScreenComponent implements OnInit {

  role: string;
  constructor(private store: Store) { }

  ngOnInit(): void {
  }

  roleSM(): void {
    this.role = "Scrum Master";
    // add router link to SM-View component
  }

  roleDev(): void {
    this.role = "Developer";
    // add router link to Dev-View component
  }
}
