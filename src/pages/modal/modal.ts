import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavParams, ViewController, Nav, NavController } from 'ionic-angular';
import { MyApp } from '../../app/app.component'

/**
 * Generated class for the ModalPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-modal-page',
  templateUrl: 'modal.html',
})
export class ModalPage {
  @ViewChild(Nav) nav: Nav;

  constructor(private navParams: NavParams, private view: ViewController, public navCtrl: NavController, 
              public mainServices: MyApp) {
  }

  ionViewWillLoad() {

  }

  closeModal() {
    this.view.dismiss();
  }

  viewModal(){
    let skeinID = localStorage.getItem('skeinid');
    console.log("++++++>>>>"), skeinID;
    if(skeinID == undefined || skeinID == null || skeinID == ''){
      this.navCtrl.push("SignInPage");
      this.view.dismiss();
      this.mainServices.commanAlertWithOkWindow("Please login to view Notifications", "errorInfo");
    }else{
      this.navCtrl.push("NotificationListPage");
    }
  }
}