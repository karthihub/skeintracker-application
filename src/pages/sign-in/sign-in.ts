import { Component, OnChanges  } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController, LoadingController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { CommonservicesProvider } from '../../providers/commonservices/commonservices';
import { MyApp } from '../../app/app.component';

@IonicPage()
@Component({
  selector: 'page-sign-in',
  templateUrl: 'sign-in.html',
})
export class SignInPage {

  public skein_id: any;
  public password: any;
  public data: FormGroup;
  public url:any;
  empOptions : boolean;
  public edited = false;
  constructor(public commonService: CommonservicesProvider, public loadingCtrl: LoadingController, 
              private formBuilder: FormBuilder, private http: Http, public navCtrl: NavController, 
              public alertCtrl: AlertController, public navParams: NavParams, 
              private menu: MenuController, public mainServices: MyApp) {
  this.menu.swipeEnable(false);
  this.empOptions = false;
  this.data = this.formBuilder.group({
    skein_id: ['', Validators.compose([ Validators.pattern('^SK[MTP]{0,1}[0-9]{3}$'), Validators.required])],
    password: ['', Validators.compose([ Validators.minLength(8), Validators.maxLength(12), Validators.required])]
    // empOptions:['']
  });

  }

  skein(dataValue:any) {
    // let val = dataValue._value;
    // let skeinien = val.substring(0, 3);
    // //console.log(val);
    // if (skeinien == "SKM"){
    //   this.edited = true;
    // }
    // else{
    //   this.edited = false;
    // }
  }

  updateEmpOptions() {
    console.log(this.empOptions);
  }

  //Login click function
  home() {
    let loading = this.loadingCtrl.create({
      spinner: 'bubbles',
      content: 'Please wait...'
    });

    console.log("url", this.commonService.api);

    loading.present();
      
      let headers = new Headers({
          'Content-Type' : 'application/json', 
      });
      
      let options = new RequestOptions({ headers: headers });

      //Post method to send login data
  
       this.http.post(this.commonService.api +'/'+ this.commonService.useAuthendication +'/', this.data.value, options)      
      .subscribe((res:any) => {
       //console.log("--RES--"+res);
       //console.log("--body--"+res._body);
       let success:any = JSON.parse(res._body);
       //console.log("success", success); 
       //console.log(success.payload[0].ismanager);

       if(success.status==200){
        let name:any=success.body[0];
        let management = name["fullname"];
        let id_skein   = name["skein_id"];
        localStorage.setItem('skeinid', id_skein);
        localStorage.setItem('fullname', management);
        // if(success.payload[0].emp_option == "1"){
        //   localStorage.setItem('empOptions', "true");
        // }else{
        //   localStorage.setItem('empOptions', "false");
        // }
        
        this.mainServices.commanAlertWithOkWindow(success.message, "successInfo");
        if(success.body[0].ismanager == "1" && success.body[0].emp_option == "1"){
         loading.dismiss();
         console.log("true");
         localStorage.setItem('empOptions', "true");
         localStorage.setItem('isMngOption', "true");
         this.navCtrl.setRoot("ManagerPortalPage", {"nameth":name["fullname"]});
        }
        else if(success.body[0].ismanager == "1" && success.body[0].emp_option == "0"){
        loading.dismiss();
        localStorage.setItem('empOptions', "false");
         localStorage.setItem('isMngOption', "true");
        console.log("false");
        this.navCtrl.setRoot("ManagerPortalPage", {"nameth":name["fullname"]});
        }
        else {
         loading.dismiss();
         localStorage.setItem('empOptions', "false");
         localStorage.setItem('isMngOption', "false");
         this.navCtrl.setRoot("EmployeePortalPage", {"nameth":name["fullname"]});
        }

       }else if(success.status == 500 || success.status == 401 || success.status == 402){
        loading.dismiss();
        this.mainServices.commanAlertWithOkWindow(success.message, "errorInfo");
       }
       })
       //this.navCtrl.setRoot("HomePage");
      }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  register()
  {
    this.navCtrl.push("SignUpPage");
  }

  forgotPassword(){
    this.navCtrl.push("SignUpPage", {"topage":"generateOTP"});
  }

}
