import { Component, ViewChild } from '@angular/core';
import { CommonservicesProvider } from '../../providers/commonservices/commonservices';
import { MyApp } from '../../app/app.component';
import { AlertController } from 'ionic-angular';
import { Http, Headers, RequestOptions } from '@angular/http';
import { IonicPage, NavController, NavParams, MenuController, LoadingController, Navbar } from 'ionic-angular';
import moment from 'moment';
/**
 * Generated class for the NotificationListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-notification-list',
  templateUrl: 'notification-list.html',
})

export class NotificationListPage {

  public notificationList:any;
  public catImage:any;
  public notifySingle:any;
  public notifySingleView:any;
  public isMngOption:any;
  @ViewChild(Navbar) navBar: Navbar;

  constructor(public commonService: CommonservicesProvider, private http: Http, public navCtrl: NavController, 
    public alertCtrl: AlertController, public navParams: NavParams, public mainServices: MyApp, public loadingCtrl: LoadingController) {
      this.catImage = ("./assets/imgs/birthday.jpg");
       this.notifySingleView = false;
       this.isMngOption = (localStorage.getItem('isMngOption') == 'true');
  }

  ionViewCanEnter() {

    let loading = this.loadingCtrl.create({
      spinner: 'bubbles',
      content: 'Please wait...'
    });

    loading.present();
      
      let headers = new Headers({
          'Content-Type' : 'application/json', 
      });
      
      let options = new RequestOptions({ headers: headers });

      //Post method to send login data
  
       this.http.post(this.commonService.api +'/'+ this.commonService.getnotifyList +'/', {skein_id : localStorage.getItem('skeinid')}, options)      
      .subscribe((res:any) => {

       let success:any = JSON.parse(res._body);
       if(success.status==200)
       {
        this.notificationList = success.body;
        loading.dismiss();
       }
       else if(success.status == 401)
       {
        this.notificationList = [];
        loading.dismiss();
        this.mainServices.commanAlertWithOkWindow(success.message, "errorInfo");
       }
       })
  }

  getDateText(date){

    let tempDate = moment(date);
    if (moment().diff(tempDate, 'days') == 1 || moment().diff(tempDate, 'days') == 0) {
        return tempDate.calendar().split(' ')[0]; // 'Today', 'yesterday', 'tomorrow'
    }else if(moment().diff(tempDate, 'days') >= 1){
        return moment(tempDate).format('ll'); // return tempDate.fromNow(); // '2 days ago' etc.
    }  

  }

  showSingleNotify(notifyData){

    let loading = this.loadingCtrl.create({
      spinner: 'bubbles',
      content: 'Please wait...'
    });

    loading.present();
      
      let headers = new Headers({
          'Content-Type' : 'application/json', 
      });
      
      let options = new RequestOptions({ headers: headers });

      //Post method to send login data
  
       this.http.post(this.commonService.api +'/'+ this.commonService.notifyUpdate +'/', {read : 1, message_id : notifyData.message_id}, options)      
      .subscribe((res:any) => {

       let success:any = JSON.parse(res._body);
       if(success.status==200)
       {
        this.notifySingle = [notifyData];
        if(this.notifySingle){
          this.notifySingleView = true;
        }
          loading.dismiss();
       }
       else if(success.status == 401)
       {
        loading.dismiss();
        this.mainServices.commanAlertWithOkWindow(success.message, "errorInfo");
       }
       })
  }


  deleteSingleNotify(notifyData){

    let loading = this.loadingCtrl.create({
      spinner: 'bubbles',
      content: 'Please wait...'
    });

    loading.present();
      
      let headers = new Headers({
          'Content-Type' : 'application/json', 
      });
      
      let options = new RequestOptions({ headers: headers });

      //Post method to send login data
  
       this.http.post(this.commonService.api +'/'+ this.commonService.deleteNotify +'/', {message_id : notifyData.message_id}, options)      
      .subscribe((res:any) => {

       let success:any = JSON.parse(res._body);
       if(success.status==200)
       {
          loading.dismiss();
          this.ionViewCanEnter();
          this.notifySingleView = !this.notifySingleView;
          this.mainServices.commanAlertWithOkWindow(success.message, "successInfo");
       }
       else if(success.status == 401)
       {
        loading.dismiss();
        this.mainServices.commanAlertWithOkWindow(success.message, "errorInfo");
       }
       })
  }

  pushNotificationPage(){
    this.mainServices.SendNotificationPage();
  }

  ionViewDidLoad() {
    this.navBar.backButtonClick = (e:UIEvent)=>{
      if(this.notifySingleView){
        this.ionViewCanEnter();
        this.notifySingleView = !this.notifySingleView;
      }else{
        this.navCtrl.pop();
      }
    }
  }

}
