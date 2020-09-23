import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RoomDevComponent } from './room-dev/room-dev.component'
import { RoomSmComponent } from './room-sm/room-sm.component'
import { StartupScreenComponent } from './startup-screen/startup-screen.component'

const routes: Routes = [
  { path: 'roomdev', component: RoomDevComponent },
  { path: 'roomsm', component: RoomSmComponent },
  { path: '', component: StartupScreenComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
