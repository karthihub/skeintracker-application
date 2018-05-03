import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EmployeePortalPage } from './employee-portal';
import { PipesModule } from "../../pipes/pipes.module";

@NgModule({
  declarations: [
    EmployeePortalPage,
  ],
  imports: [
    IonicPageModule.forChild(EmployeePortalPage),
    PipesModule
  ],
})
export class EmployeePortalPageModule {}
