import { Component, Pipe, PipeTransform} from '@angular/core';
import { Events, IonicPage, NavController, MenuController, NavParams, LoadingController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { Http, Headers, RequestOptions } from '@angular/http';
import { DatePicker } from '@ionic-native/date-picker';
import { CommonservicesProvider } from '../../providers/commonservices/commonservices';
import { MyApp } from '../../app/app.component';

@IonicPage()
@Component({
  selector: 'page-leave-approval',
  templateUrl: 'leave-approval.html',
})
export class LeaveApprovalPage {

  public fromdate:any;
  public todate: any;
  public data: any;
  public id: any;
  public leavetype: any;
  public fromsession: any;
  public tosession: any;
  public reason: any;
  public fullname: any;
  public color: any;
  public leaveData: any;
  public approved :any;
  public rejected :any;
  shownGroup = null;  

  constructor(public commonService: CommonservicesProvider, public events: Events, public alertCtrl: AlertController, 
             public loadingCtrl: LoadingController, private http: Http, public datePicker: DatePicker, 
             public navCtrl: NavController, private menu: MenuController, public navparams: NavParams,
             public mainServices: MyApp) {

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

    let headers = new Headers({
      'Content-Type' : 'application/json', 
    });
    
    let options = new RequestOptions({ headers: headers });
    this.http.post(this.commonService.api +'/'+ this.commonService.getEmpLeaveList +'/', options)
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
        }})  }



  approve(approved:any){
    console.log("approve", approved);

    console.log("approve", approved.id);

    let loading = this.loadingCtrl.create({
      spinner: 'bubbles',
      content: 'Please wait...'
    });
  
    loading.present();
  
  //Assigning register credentials to 'this.data'
    
    this.data = {
    id:           approved.id,
    skein_id:     approved.skein_id,
    fullname:     approved.fullname,
    leavetype:    approved.leavetype,
    fromdate:     approved.fromdate,
    todate:       approved.todate,
    fromsession:  approved.fromsession,
    tosession:    approved.tosession,
    reason:       approved.reason,
    color:        "green"
    };
    
    let headers = new Headers(
      {
        'Content-Type' : 'application/json', 
      });
    
    let options = new RequestOptions({ headers: headers });

    this.http.post(this.commonService.api +'/'+ this.commonService.empLeaveUpdate +'/', this.data, options)      
    .subscribe((res:any) => {
      let success:any = JSON.parse(res._body);
    console.log("res"+success);
        if(success.status == 200){
          this.mainServices.commanAlertWithOkWindow(success.message, "successInfo");
          loading.dismiss();
          this.ionViewCanEnter();
        }else if(success.status == 401){
          loading.dismiss();
          this.mainServices.commanAlertWithOkWindow(success.message, "errorInfo");
        }})
  }

  reject(rejected:any){
    console.log("rejected", rejected);

    console.log("rejected", rejected.id);

    let loading = this.loadingCtrl.create({
      spinner: 'bubbles',
      content: 'Please wait...'
    });
  
    loading.present();
  
  //Assigning register credentials to 'this.data'
    
    this.data = {
    id:           rejected.id,
    skein_id:     rejected.skein_id,
    fullname:     rejected.fullname,
    leavetype:    rejected.leavetype,
    fromdate:     rejected.fromdate,
    todate:       rejected.todate,
    fromsession:  rejected.fromsession,
    tosession:    rejected.tosession,
    reason:       rejected.reason,
    color:        "red"
    };
    
    let headers = new Headers(
      {
        'Content-Type' : 'application/json', 
      });
    
    let options = new RequestOptions({ headers: headers });

    this.http.post(this.commonService.api +'/'+ this.commonService.empLeaveUpdate +'/', this.data, options)      
    .subscribe((res:any) => {
      let success:any = JSON.parse(res._body);
        console.log("res"+success);
        if(success.status == 200){
          this.mainServices.commanAlertWithOkWindow(success.message, "successInfo");
          loading.dismiss();
          this.ionViewCanEnter();
        }else if(success.status == 401){
          loading.dismiss();
          this.mainServices.commanAlertWithOkWindow(success.message, "errorInfo");
        }})  }

}
