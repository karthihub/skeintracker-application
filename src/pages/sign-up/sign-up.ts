import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { CommonservicesProvider } from '../../providers/commonservices/commonservices';
import { SignInPage } from '../sign-in/sign-in';
import { MyApp } from '../../app/app.component';
import * as CountryCodes from '../../app/CountryCodes.json';

@IonicPage()
@Component({
  selector: 'page-sign-up',
  templateUrl: 'sign-up.html',
})
export class SignUpPage {

  public skein_id: any;
  public fullname: any;
  public email: any;
  public mobile: any;
  public password: any;
  public data: any;
  public sign_up : FormGroup;
  public update : FormGroup;
  public generateOTP : FormGroup;
  public forgotPassword : FormGroup;
  public nonEditUserProfile:any;
  public disabled : boolean = false;
  public photos: any;
  public CountryCodes = CountryCodes;
  public mobileNoMask:any;
  public mobileNo:any;
  public edited = false;
  public forgot_Password = false;
  public generate_OTP = true;
  public empOptionUpdate:any;
  public isMngOption:any;
  nameval:any="";
  frompage:any="";
  topage:any;

  constructor(public navparams: NavParams, public commonService: CommonservicesProvider, public loadingCtrl: LoadingController,
              private formBuilder: FormBuilder, private http: Http, public navCtrl: NavController, public alertCtrl: AlertController, 
              public navParams: NavParams, public mainServices: MyApp) {
  this.sign_up = this.formBuilder.group({
    skein_id:   ['', Validators.compose([Validators.pattern('^SK[MTP]{0,1}[0-9]{3}$'), Validators.required])],
    fullname:   ['', Validators.compose([Validators.maxLength(30), Validators.required])],
    email:      ['', Validators.compose([Validators.pattern('^[a-z0-9._%+-]+@skeintech+\.[a-z]{2,4}$'), Validators.required])],
    mobile:     ['+91', Validators.compose([Validators.pattern('^[0-9+]{13,15}$'),Validators.minLength(10), Validators.maxLength(15), Validators.required])],
    password:   ['', Validators.compose([Validators.minLength(8), Validators.maxLength(12), Validators.required])],
    // ismanager:  ['', Validators.compose([Validators.required])],
    empOptions:  [false, Validators.compose([Validators.required])],
    ContryCode: ['IN']  
  });

  this.generateOTP = this.formBuilder.group({
    skein_id: ['', Validators.compose([Validators.pattern('^SK[MTP]{0,1}[0-9]{3}$'), Validators.required])],
    email:    ['', Validators.compose([Validators.pattern('^[a-z0-9._%+-]+@skeintech+\.[a-z]{2,4}$'), Validators.required])],
  });

  let otp_skeinid = localStorage.getItem('otp_skeinid');
      
  console.log(otp_skeinid);

  this.forgotPassword = this.formBuilder.group({ 
    skein_id: otp_skeinid,
    otp:      ['', Validators.compose([Validators.required])],
    password: ['', Validators.compose([Validators.minLength(8), Validators.maxLength(12), Validators.required])],
  });

  this.frompage = this.navparams.get("frompage");
  this.topage = this.navparams.get("topage");
  this.nameval =  this.navparams.get("tasks");

  this.mobileNoMask = {
    phoneNumber: ['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/],
    cardNumber: [/\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/],
    cardExpiry: [/[0-1]/, /\d/, '/', /[1-2]/, /\d/],
    orderCode: [/[a-zA-z]/, ':', /\d/, /\d/, /\d/, /\d/]
};

// this.mobileNo = "+91";
    this.empOptionUpdate = (localStorage.getItem('empOptions') == 'true');
    this.isMngOption = (localStorage.getItem('isMngOption') == 'true');

  }

  editf(){
    if(this.frompage == "editProfile"){
    //   this.update = this.formBuilder.group({
    //   skein_id: this.nameval.skein_id,
    //   fullname: this.nameval.fullname,
    //   email: this.nameval.email,
    //   mobile: this.nameval.mobile,
    // });

    this.update = this.formBuilder.group({
      id: this.nameval.id,
      skein_id: [this.nameval.skein_id, Validators.compose([Validators.pattern('^SK[MTP]{0,1}[0-9]{3}$'), Validators.required])],
      fullname: [this.nameval.fullname, Validators.compose([Validators.maxLength(30), Validators.required])],
      email:    [this.nameval.email, Validators.compose([Validators.pattern('^[a-z0-9._%+-]+@skeintech+\.[a-z]{2,4}$'), Validators.required])],
      mobile:   [this.nameval.mobile, Validators.compose([Validators.minLength(10), Validators.maxLength(15), Validators.required])], 
      ContryCode: ['IN'],
      empOptions: [this.empOptionUpdate, Validators.compose([Validators.required])]  
    });
    this.nonEditUserProfile =  Object.assign({}, this.update);
    }
  }
  
  //Signup click function
  signup(){
    let loading = this.loadingCtrl.create({
      spinner: 'bubbles',
      content: 'Please wait...'
    });
  
    loading.present();
     
    console.log(this.sign_up.value);

    let headers = new Headers(
      {
        'Content-Type' : 'application/json', 
      });

    let options = new RequestOptions({ headers: headers });
    if(this.edited ) { this.sign_up.value.ismanager = true;}
    else{this.sign_up.value.ismanager = false; } 
    
    this.sign_up.value.fcmTocken = this.mainServices.fcmTocken;
    this.sign_up.value.devicePlatform = this.mainServices.devicePlatform;
    this.sign_up.value.deviceUUID = this.mainServices.deviceUUID;
      console.log(this.sign_up.value);
    //Post method to send register data
      this.http.post(this.commonService.api +'/'+ this.commonService.empRegistration +'/', this.sign_up.value, options)      
      .subscribe((res:any) => {
          console.log("res"+res);
          let success = JSON.parse(res._body);

          switch(success.status){
            case 200:
                  this.mainServices.commanAlertWithOkWindow(success.message, "successInfo");
                  this.navCtrl.setRoot("SignInPage");
                  loading.dismiss();
                  break;
            case 401:
                  this.mainServices.commanAlertWithOkWindow(success.message, "errorInfo");
                  loading.dismiss();
                  break;  
          }
          
        }
      );

    console.log(JSON.stringify(this.data));
  }

  updated(){

    console.log(this.update.value);
    

    if(this.compare(this.nonEditUserProfile.value, this.update.value)){

    let headers = new Headers({
        'Content-Type' : 'application/json', 
    });
      
    let options = new RequestOptions({ headers: headers });
      
    //Post method to send register data
      
    this.http.post(this.commonService.api +'/'+ this.commonService.empDetailsUpdate +'/', this.update.value, options)      
    .subscribe((res:any) => {
      let success:any = JSON.parse(res._body);
      console.log(success);
          if(success.status == 200){
            if(this.update.value.empOptions){
              localStorage.setItem('empOptions', "true");
            }else{
              localStorage.setItem('empOptions', "false");
            }
            this.mainServices.commanAlertWithOkWindow(success.message, "successInfo");
            this.navCtrl.pop();
          }else if(success.status == 401){
            this.mainServices.commanAlertWithOkWindow(success.message, "errorInfo");
          }})

    }else{
      this.mainServices.commanAlertWithOkWindow("No changes have done.", "errorInfo");
    }}


  public compare (obj1, obj2) {
    //Loop through properties in object 1
    // let tempValue:boolean;
    for (var p in obj1) {
      //Check property exists on both objects
      console.log(obj1[p] +"<<==>>"+ obj2[p]);
      if(obj1[p] !== obj2[p]){
        return true;
      }else{
        
      }
    }
    return false;
  };

  otp(){
    localStorage.setItem('otp_skeinid', this.generateOTP.value.skein_id);

    let headers = new Headers({
    'Content-Type' : 'application/json', 
    });
      
    let options = new RequestOptions({ headers: headers });
      
    //Post method to send register data
      
    this.http.post(this.commonService.api +'/'+ this.commonService.generateOtp +'/', this.generateOTP.value, options)      
      .subscribe((res:any) => {
              console.log("res"+res);
              console.log("res._body"+res._body);
              let success = JSON.parse(res._body);
              if (success.status == 401){
                this.mainServices.commanAlertWithOkWindow(success.message, "errorInfo");
              }
              else if(success.status == 200){
                this.mainServices.commanAlertWithOkWindow(success.message, "successInfo");
                this.forgot_Password = true;
                this.generate_OTP = false;
              }
              });
  }

    forgot(){
      
      let headers = new Headers({
      'Content-Type' : 'application/json', 
      });
        
      let options = new RequestOptions({ headers: headers });
        
      //Post method to send register data
        
      this.http.post(this.commonService.api +'/'+ this.commonService.useForgotPass +'/', this.forgotPassword.value, options)      
        .subscribe((res:any) => {
        //console.log("res"+res);
                let success = JSON.parse(res._body);
                if (success.status == 401){
                this.mainServices.commanAlertWithOkWindow(success.message, "errorInfo");
                }
                else{
                this.mainServices.commanAlertWithOkWindow(success.message, "successInfo");
                this.navCtrl.setRoot("SignInPage");
              }
                },
                err => {
                  let loading = this.loadingCtrl.create({
                    spinner: 'bubbles',
                    content: 'Please wait...'
                  });
                
                  loading.present();
                  console.log("Error occured"+err);
                    loading.dismiss();
                }
              );
              }



  ionViewCanEnter() {
    console.log('ionViewDidLoad RegisterPage');
    this.editf();
  }

  backToLogin(){
    {
      this.navCtrl.push("SignInPage");
    }

  }

  onContryCodeChange(value, contryList){
    for (var i = 0; i < contryList.length; i++){
      if (contryList[i].code == value){
        this.mobileNo =  JSON.parse(JSON.stringify(contryList[i].dial_code).replace(/\s(?=\w+":)/g, ""));
        
      }
    }
  }

  onContryCodeChangeUpdate(value, contryList){
    for (var i = 0; i < contryList.length; i++){
      if (contryList[i].code == value){
        this.nameval.mobile =  JSON.parse(JSON.stringify(contryList[i].dial_code).replace(/\s(?=\w+":)/g, ""));
        
      }
    }
  }

  skein(dataValue) {
    console.log(dataValue);
    let val = dataValue.value;
    let skeinien = val.substring(0, 3);
    //console.log(val);
    if (skeinien == "SKM"){
      this.edited = true;
    }
    else{
      this.edited = false;
    }
  }

}
