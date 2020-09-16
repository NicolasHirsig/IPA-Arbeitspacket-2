import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { reducer } from './ext.reducer'

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { StartupScreenComponent } from './startup-screen/startup-screen.component';
import { RoomDevComponent } from './room-dev/room-dev.component';
import { RoomSmComponent } from './room-sm/room-sm.component';

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
    StoreModule.forRoot(reducer)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
