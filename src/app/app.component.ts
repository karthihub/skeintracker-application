import { Component, ViewChild } from '@angular/core';
import { Events, Nav, Platform, AlertController, LoadingController, ToastController, Modal, ModalController, ModalOptions, ViewController } from 'ionic-angular';
import { Network } from '@ionic-native/network';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { HttpModule } from '@angular/http';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Device } from '@ionic-native/device';
import { SignInPage } from '../pages/sign-in/sign-in';
import { SignUpPage } from '../pages/sign-up/sign-up';
import { EmployeePortalPage } from '../pages/employee-portal/employee-portal';
import { ManagerPortalPage } from '../pages/manager-portal/manager-portal';
import { AddTaskPage } from '../pages/add-task/add-task';
import { ViewTaskPage } from '../pages/view-task/view-task';
import { EditProfilePage } from '../pages/edit-profile/edit-profile';
import { ApplyLeavePage } from '../pages/apply-leave/apply-leave';
import { AppliedLeavePage } from '../pages/applied-leave/applied-leave';
import { LeaveApprovalPage } from '../pages/leave-approval/leave-approval';
import { AboutPage } from '../pages/about/about';
import { CommonservicesProvider } from '../providers/commonservices/commonservices';
import { AddProjectPage } from '../pages/add-project/add-project';
import { ProjectListPage } from '../pages/project-list/project-list';
import { NotificationListPage } from '../pages/notification-list/notification-list';
import { SendNotificationPage } from '../pages/send-notification/send-notification';
import { ModalPage } from '../pages/modal/modal';


declare var FirebasePlugin:any;
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;


  rootPage: any = "SignInPage";
  public id:any;
  public data: any;
  public photos: any;
  public cameraPhoto: any;
  public base64Image: any;
  public imageOne: any;
  public tasks: any;
  public fcmTocken:any; 
  public devicePlatform:any;
  public deviceUUID:any;
  postsArray: any = {};
  pages: Array<{title: string, component: any}>;
  public commanAlertWithOkBtnVar:any;
  public alertWindowWithTwoBtnsMsg:any;

  constructor(public commonService: CommonservicesProvider, public events: Events, private camera: Camera, 
              private http: Http, private toast: ToastController, private network: Network, public loadingCtrl: LoadingController,
              public platform: Platform, public alertCtrl: AlertController, public statusBar: StatusBar, 
              public splashScreen: SplashScreen, public device: Device, public modalCtrl: ModalController) {
    this.initializeApp();
    
    events.subscribe('user:login', () => {
      this.loggedIn();
    });
  }

  // commanModuleWindow(){
  //   let profileModal = this.modalCtrl.create(Profile, { userId: 8675309 });
  //   profileModal.present();
  // }

  loggedIn(){

    this.id= localStorage.getItem('skeinid');
    //console.log(this.id);
    let headers = new Headers({
      'Content-Type' : 'application/json', 
    });

    let tempJSON = {
      "skein_id" : this.id
    }
    
    let options = new RequestOptions({ headers: headers });
    this.http.post(this.commonService.api +'/'+ this.commonService.getEmpAvatar +'/', tempJSON, options)
      .map(res=>res.json()).subscribe((data:any) => {
        this.tasks = data.body;
        console.log("loggedIn==>>", this.tasks[0].photos);
        if (this.tasks[0].photos == "" || this.tasks[0].photos == null){
          this.photos= ("./assets/icon/avatar.png");
        }
        else{
          this.photos= this.tasks[0].photos;
        }
        //console.log(this.photos);
    });

  }

  initializeApp() {
    localStorage.clear();
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.devicePlatform = this.device.platform;
      this.deviceUUID = this.device.uuid;
      setTimeout(() => {
        this.splashScreen.hide();
      }, 1000);
      
     this.fcmNotification();

      
    });

    //function to find the network status
    this.network.onConnect().subscribe(data => {
      console.log(data)
      this.displayNetworkUpdate(data.type);
    }, error => console.error(error));
   
    this.network.onDisconnect().subscribe(data => {
      console.log(data)
      this.displayNetworkUpdate(data.type);
    }, error => console.error(error));

  }
   
   //it is used for network connection toast
   displayNetworkUpdate(connectionState: string) {
    let networkType = this.network.type;
    this.toast.create({
      message: `You are now ${connectionState} via ${networkType}`,
      duration: 3000
    }).present();
  }

  applyLeave() {
    this.nav.push("ApplyLeavePage");
  }

  appliedLeave() {
    this.nav.push("AppliedLeavePage");
  }

  approveLeave() {
    this.nav.push("LeaveApprovalPage");
  }

  settings() {
    this.nav.push("EditProfilePage");
  }

  about() {
    this.nav.push("AboutPage");
  }

  projectList(){
    this.nav.push("ProjectListPage");
  }

  NotificationList(){
    this.nav.push("NotificationListPage");
  }

  SendNotificationPage(){
    this.nav.push("SendNotificationPage");
  }

  logout(){
    let loading = this.loadingCtrl.create({
      spinner: 'bubbles',
      content: 'Please wait...'
    });
  
    loading.present();
    localStorage.clear();
    this.nav.setRoot("SignInPage");
    loading.dismiss();
  }

  public commanAlertWithOkWindow(msg, cssClass){
  //   this.commanAlertWithOkBtnVar = this.alertCtrl.create ({
  //     title: "Skein Tracker",
  //     message : msg,
  //     buttons: ['OK']
  //  }); 
  //  this.commanAlertWithOkBtnVar.present();
  this.commanAlertWithOkBtnVar = this.toast.create({
    message: msg,
    duration: 3000,
    position: 'top',
    cssClass: cssClass
  });

  this.commanAlertWithOkBtnVar.onDidDismiss(() => {
    console.log('Dismissed toast');
  });

  this.commanAlertWithOkBtnVar.present();


  }

    fcmNotification(){

      FirebasePlugin.getToken((token)=> {
        this.fcmTocken = token;
        console.log("Token value is",token);
      }, (error)=>{
          console.log("error in token fcm processing",error);
      });

      FirebasePlugin.onNotificationOpen((notification:any)=>{
        console.log("notification from firebase",notification);
        if(notification){
          this.commanModuleWindow();
      }},(error)=>{
          console.log("notification from firebase",error);
      });

      FirebasePlugin.onTokenRefresh(function(token) {
        console.log("refreshedToken value is",token);
      }, (error)=>{
        console.log("error in token fcm processing",error);
      });
      
    }
         
  


    public alertWindowWithTwoBtns = {
      confirm: (msg?, title?) => {
        return new Promise((resolve, reject) => {
          let alert = this.alertCtrl.create({
            title: title || 'Confirm',
            message: msg || this.alertWindowWithTwoBtnsMsg,
            buttons: [
              {
                text: 'Cancel',
                role: 'cancel',
                handler: () => {
                  reject(false);
                }
              },
              {
                text: 'Ok',
                handler: () => {
                  resolve(true);
                }
              }
            ]
          });
          alert.present();
        });
  
      },
      alert: (msg, title?) => {
        let alert = this.alertCtrl.create({
          title: title || 'Alert',
          subTitle: msg,
          buttons: ['Dismiss']
        });
  
        alert.present();
      }
    }


    commanModuleWindow() {

      const myModalOptions: ModalOptions = {
        enableBackdropDismiss: false
      };
  
      const myModalData = {
        name: 'Paul Halliday',
        occupation: 'Developer'
      };
  
      const myModal: Modal = this.modalCtrl.create('ModalPage', { data: myModalData }, myModalOptions);
  
      myModal.present();
  
      myModal.onDidDismiss((data) => {
        console.log("I have dismissed.");
        console.log(data);
      });
  
      myModal.onWillDismiss((data) => {
        console.log("I'm about to dismiss");
        console.log(data);
      });
  
    }

}
