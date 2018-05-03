import { Component, ViewChild } from '@angular/core';
import { CommonservicesProvider } from '../../providers/commonservices/commonservices';
import { MyApp } from '../../app/app.component';
import { AlertController } from 'ionic-angular';
import { Http, Headers, RequestOptions } from '@angular/http';
import { IonicPage, NavController, NavParams, MenuController, LoadingController, Navbar } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import moment from 'moment';
import { GESTURE_PRIORITY_GO_BACK_SWIPE } from 'ionic-angular/gestures/gesture-controller';


@IonicPage()
@Component({
  selector: 'page-send-notification',
  templateUrl: 'send-notification.html',
})
export class SendNotificationPage {

  public crt_notify : FormGroup;
  public notifyCategries:any;
  public toskein_id: any = '';
  public toEmployee : boolean = false;
  public toManager : boolean = false;
  public specificId : boolean = false;
  public employee: any;
  public manager: any;
  public specific: any;
  public skeinId: any;
  public data: any;
  public id: any;
  public notifyTitle: any ='';
  public notifyCateg: any;
  public content: any ='' ;

  constructor(public commonService: CommonservicesProvider, private http: Http, public navCtrl: NavController, 
              public alertCtrl: AlertController, public navParams: NavParams, public mainServices: MyApp, 
              public loadingCtrl: LoadingController, private formBuilder: FormBuilder) {
              
      this.id= localStorage.getItem('skeinid');

      this.crt_notify = this.formBuilder.group({
        fromSkeinID : this.id,
        notifyTitle: [''],
        notifyCateg: ['Select', Validators.compose([ Validators.required])],
        content: ['', Validators.compose([ Validators.required])],
        toEmployee:  ['false', Validators.compose([Validators.required])],
        toManager:   ['false', Validators.compose([Validators.required])],
        specificId:  ['false', Validators.compose([Validators.required])],
        skein_id:    ['', Validators.compose([Validators.pattern('^SK[MTP]{0,1}[0-9]{3}$'), Validators.required])],
      });

      this.employee = true;
      this.manager = true;
      this.specific = true;

    this.notifyCategries = [{name : "general"},{name : "events"},{name : "birthday"},{name : "business"}]
    }
  
    public specId() {
      if(this.specificId == true) {
        this.employee = false;
        this.manager = false;
        this.skeinId = true;
      }else{
        this.employee = true;
        this.manager = true;
        this.skeinId = false;
      }
    }
    public toemployee(){
      if(this.toEmployee == true) {
        this.specific = false;
        this.manager = false;
      }else{
        this.specific = true;
        this.manager = true;
      }
    }
    public tomanager(){
      if(this.toManager == true) {
        this.specific = false;
        this.employee = false;
      }else {
        this.specific = true;
        this.employee = true;
      }
    }

    

  ionViewDidLoad() {
    console.log('ionViewDidLoad SendNotificationPage');
  }

  send(){
    let loading = this.loadingCtrl.create({
      spinner: 'bubbles',
      content: 'Please wait...'
    });
    loading.present();

    this.id= localStorage.getItem('skeinid');
    
    this.data = {
      fromSkeinID : this.id,
      toSkeinID: this.toskein_id,
      notify_title : this.notifyTitle,
      category: this.notifyCateg.name,
      notify_content: this.content,
      isEmployees: this.toEmployee,
      isManagers: this.toManager,
      specId: this.specificId
    }
   
    let headers = new Headers({
    'Content-Type' : 'application/json', 
    });
      
    let options = new RequestOptions({ headers: headers });
      
    //Post method to send register data
      
    this.http.post(this.commonService.api +'/'+ this.commonService.notifyAdd +'/', this.data, options)      
      .subscribe((res:any) => {
              console.log("res"+res);
              console.log("res._body"+res._body);
              let success = JSON.parse(res._body);

              loading.dismiss();
              
              this.id = '';
              this.toskein_id = '';
              this.notifyTitle = '';
              this.notifyCateg = 'Select';
              this.content = '';
              this.toEmployee = false;
              this.toManager  = false;
              this.specificId = false;

              this.mainServices.commanAlertWithOkWindow("Push notification sent", "successInfo");

              },
              err => {
                let loading = this.loadingCtrl.create({
                  spinner: 'bubbles',
                  content: 'Please wait...'
                });
                loading.present();
                console.log("Error occured"+err);
                 loading.dismiss();
                 this.mainServices.commanAlertWithOkWindow("Push notification failed", "errorInfo");
              });
              
            }

}
