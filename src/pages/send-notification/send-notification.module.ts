import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SendNotificationPage } from './send-notification';

@NgModule({
  declarations: [
    SendNotificationPage,
  ],
  imports: [
    IonicPageModule.forChild(SendNotificationPage),
  ],
})
export class SendNotificationPageModule {}
