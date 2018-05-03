import { Component, Pipe, PipeTransform} from '@angular/core';
import { Events, IonicPage, NavController, MenuController, NavParams, LoadingController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { Http, Headers, RequestOptions } from '@angular/http';
import { DatePicker } from '@ionic-native/date-picker';
import { CommonservicesProvider } from '../../providers/commonservices/commonservices';
import { MyApp } from '../../app/app.component';

@IonicPage()
@Component({
  selector: 'page-applied-leave',
  templateUrl: 'applied-leave.html',
})
export class AppliedLeavePage {

  public data: any;
  public id: any;
  public leaveData:any;
  shownGroup = null;
  
  
  constructor(public commonService: CommonservicesProvider, public events: Events, 
              public alertCtrl: AlertController, public loadingCtrl: LoadingController, 
              private http: Http, public datePicker: DatePicker, public navCtrl: NavController, 
              private menu: MenuController, public navparams: NavParams, public mainServices: MyApp) {
    this.id= localStorage.getItem('skeinid');
  }


  
  toggleGroup(group) {
    if (this.isGroupShown(group)) {
        this.shownGroup = null;
    } else {
        this.shownGroup = group;
    }
  };
  isGroupShown(group) {
    return this.shownGroup === group;
  };

  

  ionViewCanEnter() {

    let loading = this.loadingCtrl.create({
      spinner: 'bubbles',
      content: 'Please wait...'
    });

    loading.present();
    this.id= localStorage.getItem('skeinid');

    let headers = new Headers({
      'Content-Type' : 'application/json', 
    });
    
    let options = new RequestOptions({ headers: headers });
    this.http.post(this.commonService.api +'/'+ this.commonService.getEmpLeaveList +'/', {skein_id : this.id}, options)
    .subscribe((res:any) => {
      let success:any = JSON.parse(res._body);
      console.log("res"+success);
      if(success.status == 200){
        let taskData = success.body;
        this.leaveData = taskData;
        console.log(this.leaveData);
        loading.dismiss();
      }else if(success.status == 401){
        this.mainServices.commanAlertWithOkWindow(success.message, "errorInfo");
      }
    });
    console.log('ionViewDidLoad AppliedLeavePage');
  }

}
