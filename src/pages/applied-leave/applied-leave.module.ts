import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AppliedLeavePage } from './applied-leave';

@NgModule({
  declarations: [
    AppliedLeavePage,
  ],
  imports: [
    IonicPageModule.forChild(AppliedLeavePage),
  ],
})
export class AppliedLeavePageModule {}
