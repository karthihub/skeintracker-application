import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ManagerPortalPage } from './manager-portal';

@NgModule({
  declarations: [
    ManagerPortalPage,
  ],
  imports: [
    IonicPageModule.forChild(ManagerPortalPage),
  ],
})
export class ManagerPortalPageModule {}
