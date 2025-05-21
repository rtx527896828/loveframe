import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PhotoManagementComponent } from './photo-management.component';

const routes: Routes = [
  { path: '', component: PhotoManagementComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PhotoManagementRoutingModule { }
