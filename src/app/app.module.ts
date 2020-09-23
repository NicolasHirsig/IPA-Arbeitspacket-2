import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { StartupScreenComponent } from './startup-screen/startup-screen.component';
import { RoomDevComponent } from './room-dev/room-dev.component';
import { RoomSmComponent } from './room-sm/room-sm.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    AppComponent,
    StartupScreenComponent,
    RoomDevComponent,
    RoomSmComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
