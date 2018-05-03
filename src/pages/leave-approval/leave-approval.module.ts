import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LeaveApprovalPage } from './leave-approval';

@NgModule({
  declarations: [
    LeaveApprovalPage,
  ],
  imports: [
    IonicPageModule.forChild(LeaveApprovalPage),
  ],
})
export class LeaveApprovalPageModule {}
