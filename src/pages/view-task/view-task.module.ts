import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ViewTaskPage } from './view-task';
import { PipesModule } from "../../pipes/pipes.module";
import {ChartsModule}  from 'ng2-charts/ng2-charts';


@NgModule({
  declarations: [
    ViewTaskPage,
  ],
  imports: [
    IonicPageModule.forChild(ViewTaskPage),
    PipesModule,
    ChartsModule
  ],
})
export class ViewTaskPageModule {}
