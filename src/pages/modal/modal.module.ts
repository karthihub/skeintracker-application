import { NgModule } from '@angular/core';
import { IonicPageModule ,IonicPage, NavParams, ViewController, Nav, NavController} from 'ionic-angular';
import { ModalPage } from './modal';

@NgModule({
  declarations: [
    ModalPage,
  ],
  imports: [
    IonicPageModule.forChild(ModalPage),
  ],
  exports: [
    ModalPage
  ]
})
export class ModalPageModule {}