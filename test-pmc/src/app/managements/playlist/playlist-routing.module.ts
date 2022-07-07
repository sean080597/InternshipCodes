import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PlaylistFormComponent } from './playlist-form/playlist-form.component';
import { PlaylistComponent } from './playlist.component';

const routes: Routes = [
  {
    path: '',
    component: PlaylistComponent
  },
  {
    path: 'create',
    component: PlaylistFormComponent
  },
  {
    path: ':id',
    component: PlaylistFormComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PlaylistRoutingModule { }
