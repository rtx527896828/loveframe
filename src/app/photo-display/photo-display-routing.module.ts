import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PhotoDisplayComponent } from './photo-display.component';

const routes: Routes = [
  { path: '', component: PhotoDisplayComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PhotoDisplayRoutingModule { }
