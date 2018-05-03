import { Component, Pipe, PipeTransform} from '@angular/core';
import { Events, IonicPage, NavController, MenuController, NavParams, LoadingController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { Http, Headers, RequestOptions } from '@angular/http';
import { DatePicker } from '@ionic-native/date-picker';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { CommonservicesProvider } from '../../providers/commonservices/commonservices';
import moment from 'moment';
import { MyApp } from '../../app/app.component';

@IonicPage()
@Component({
  selector: 'page-apply-leave',
  templateUrl: 'apply-leave.html',
})
export class ApplyLeavePage {

  public fromdate:any = "Pick from-date";
  public todate:any = "Pick to-date";
  public data: any;
  public id: any;
  public leavetype: any;
  public fromsession: any;
  public tosession: any;
  public reason: any;
  public fullname: any;
  public color:any;
  public apply_leave : FormGroup;

  constructor(private formBuilder: FormBuilder, public commonService: CommonservicesProvider, 
             public events: Events, public alertCtrl: AlertController, public loadingCtrl: LoadingController,
             private http: Http, public datePicker: DatePicker, public navCtrl: NavController, 
             private menu: MenuController, public navparams: NavParams, public mainServices: MyApp) {
    this.id = localStorage.getItem('skeinid');
    this.fullname = localStorage.getItem('fullname');
    this.color = "orange";

    this.apply_leave = this.formBuilder.group({
      skein_id   :this.id,
      fullname   :this.fullname,
      leavetype  :['Select', Validators.compose([ Validators.required])],
      fromdate   :['', Validators.compose([ Validators.required])],
      todate     :['', Validators.compose([Validators.required])],
      fromsession:['Select', Validators.compose([Validators.required])],
      tosession  :['Select', Validators.compose([Validators.required])], 
      reason     :['', Validators.compose([Validators.required])],  
      color      :this.color    
    });

  }

  fromCalendar(){
    this.datePicker.show({
      date: new Date(),
      mode: 'date',
      titleText: 'Choose Date',
      androidTheme: this.datePicker.ANDROID_THEMES.THEME_HOLO_DARK
    })
    .then(
      //date => console.log('Got date: ',this.date = date.getFullYear() + '-' + (date.getMonth()+1) + '-' +  date.getDate()),
      date => {
        this.fromdate = date.getFullYear() + '-' + (date.getMonth()+1) + '-' +  date.getDate();
        this.apply_leave.get(["fromdate"]).setValue(this.fromdate);
        //this.fromdate =  console.log('Got date: ', date);
        console.log("From", this.fromdate);
    },
      err => console.log('Error occurred while getting date: ', err)
    );
  }

  toCalendar(){
    this.datePicker.show({
      date: new Date(),
      mode: 'date',
      titleText: 'Choose Date',
      androidTheme: this.datePicker.ANDROID_THEMES.THEME_HOLO_DARK
    })
    .then(
      //date => console.log('Got date: ',this.date = date.getFullYear() + '-' + (date.getMonth()+1) + '-' +  date.getDate()),
      date => {
        this.todate = date.getFullYear() + '-' + (date.getMonth()+1) + '-' +  date.getDate();
        this.apply_leave.get(["todate"]).setValue(this.todate);
        //this.todate =  console.log('Got date: ', date);
        console.log("TO", this.todate);
    },
      err => console.log('Error occurred while getting date: ', err)
    );
  }


  applyLeave(){

    let headers = new Headers(
      {
        'Content-Type' : 'application/json', 
      });
    
    let options = new RequestOptions({ headers: headers });

    if(this.apply_leave.value.leavetype == "Select") {
      this.mainServices.commanAlertWithOkWindow("Please select the Leave Type", "errorInfo");
    }
    else if(this.apply_leave.value.fromsession == "Select") {
      this.mainServices.commanAlertWithOkWindow("Please select the From-Session", "errorInfo");
    }
    else if(this.apply_leave.value.tosession == "Select") {
      this.mainServices.commanAlertWithOkWindow("Please select the To-Session", "errorInfo");
    }
    else{
  //Post method to send register data
    
  this.http.post(this.commonService.api +'/'+ this.commonService.empApplyLeave +'/', this.apply_leave.value, options)      
  .subscribe((res:any) => {
        let success:any = JSON.parse(res._body);
        console.log("res"+success);
        if(success.status == 200){
          this.mainServices.commanAlertWithOkWindow(success.message, "successInfo");
          this.navCtrl.pop();
          this.leavetype = 'Select';
          this.fromdate = '';
          this.todate = '';
          this.fromsession = 'Select';
          this.tosession = 'Select';
          this.reason = ''; 
        }else if(success.status == 401){
          this.mainServices.commanAlertWithOkWindow(success.message, "errorInfo");
        }
      })
    }}
    
    
  

  ionViewDidLoad() {
    console.log('ionViewDidLoad ApplyLeavePage');
  }

}
