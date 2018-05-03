import { Component } from '@angular/core';
import { Events, IonicPage, NavController, NavParams } from 'ionic-angular';
import { Nav, Platform, AlertController, LoadingController, ToastController } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Network } from '@ionic-native/network';
import { StatusBar } from '@ionic-native/status-bar';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { Http, Headers, RequestOptions } from '@angular/http';
import { CommonservicesProvider } from '../../providers/commonservices/commonservices';
import { MyApp } from '../../app/app.component';



@IonicPage()
@Component({
  selector: 'page-add-project',
  templateUrl: 'add-project.html',
})
export class AddProjectPage {

  public id:any;
  nameval:any="";
  frompage:any="";
  public assigned_by:any;
  public skein_id: any;
  public data: any;
  public project_logo: any;
  public project_name:any;
  public cameraPhoto: any;
  public base64Image: any;
  public imageOne: any;
  public tasks: any;
  add_project: FormGroup;
  postsArray: any = {};
  pages: Array<{title: string, component: any}>;

  constructor(public commonService: CommonservicesProvider, private formBuilder: FormBuilder, public events: Events, private camera: Camera, 
    private http: Http, private toast: ToastController, private network: Network, 
    public loadingCtrl: LoadingController, public platform: Platform, 
    public alertCtrl: AlertController, public statusBar: StatusBar, 
    public navCtrl: NavController, public navParams: NavParams, public mainServices: MyApp) {
      
      this.frompage = this.navParams.get("frompage");
      this.nameval =  this.navParams.get("tasks");

      this.id= localStorage.getItem('skeinid');
      this.assigned_by= localStorage.getItem('fullname');
      this.edit();
      if(!this.nameval.project_logo){
        this.project_logo = ("./assets/icon/avatar.png");
      }else{
        this.project_logo = this.nameval.project_logo;
      }
      

      
  }

  changeImage() {
    let alert = this.alertCtrl.create({
      buttons: [{
        text: 'Camera',
        handler: () => this.takePhoto()
      },
      {
        text: 'Gallery',
        handler: () => this.uploadPhoto()
      }
      ]
    });
    alert.present();
  }

  takePhoto() {
    const options: CameraOptions = {
      quality: 30,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      saveToPhotoAlbum: true
    }
    this.camera.getPicture(options).then((imageData) => {
      this.base64Image = 'data:image/jpeg;base64,' + imageData;
      this.project_logo = this.base64Image;
      //localStorage.setItem("userPhoto", this.photos);
      //this.view();
    }, 
    (err) => {
      console.log("errFromTakenPhoto==>>"+err);
    });
  }


  uploadPhoto() {
    this.camera.getPicture({
      sourceType: this.camera.PictureSourceType.SAVEDPHOTOALBUM,
      destinationType: this.camera.DestinationType.DATA_URL, quality: 30,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    }).then((imageData) => {

      this.base64Image = 'data:image/jpeg;base64,' + imageData;
      this.project_logo = this.base64Image;
      //localStorage.setItem("userPhoto", this.photos);
      //this.gallery();
    }, 
    (err) => {
      console.log("errFromTakenPhoto==>>"+err);
    });
  }

  addProject() {
    this.id= localStorage.getItem('skeinid');
    this.assigned_by= localStorage.getItem('fullname');

    if(this.project_name == "" || this.project_name == undefined || this.project_name == null) {
      this.mainServices.commanAlertWithOkWindow("Please select project name", "errorInfo");
    }
    else {
    let loading = this.loadingCtrl.create({
      spinner: 'bubbles',
      content: 'Please wait...'
    });
    
    this.data = {
    skein_id    : this.id,
    assigned_by : this.assigned_by,
    project_name: this.project_name,
    project_logo: this.project_logo
    }

    loading.present();

      
      let headers = new Headers(
        {
          'Content-Type' : 'application/json', 
        });      
      let options = new RequestOptions({ headers: headers });

      this.http.post(this.commonService.api +'/'+ this.commonService.addProject +'/', this.data, options)      
      .subscribe(res => {
        console.log("res"+res);
            this.mainServices.commanAlertWithOkWindow("Project Added Successfully", "successInfo");
            this.navCtrl.pop();
            loading.dismiss();
              },
                err => {
                  console.log("Error occured"+err);
                  loading.dismiss();
                });
            }
  }

    ionViewCanEnter(){
     // this.project_logo = ("./assets/icon/avatar.png");
    }

    edit(){
      this.id = this.nameval.id,
      this.skein_id = this.nameval.skein_id,
      this.assigned_by = this.nameval.assigned_by,
      this.project_name = this.nameval.project_name,
      this.project_logo = this.nameval.project_logo
    }

  updateProject() {

    this.data = {
      id: this.nameval.id,
      skein_id    : this.nameval.skein_id,
      assigned_by : this.nameval.assigned_by,
      project_name: this.project_name,
      project_logo: this.project_logo
      }

      console.log(this.data);

              
      let headers = new Headers({
      'Content-Type' : 'application/json', 
      });
      
      let options = new RequestOptions({ headers: headers });

      this.http.post(this.commonService.api +'/'+ this.commonService.editProject +'/', this.data, options)      
      .subscribe(res => {
            console.log("res"+res);
            this.mainServices.commanAlertWithOkWindow("Updated Successfully", "successInfo");
            //loading.dismiss();
            this.navCtrl.push("ProjectListPage");
              },
              err => {
            console.log("Error occured"+err);
            //loading.dismiss();
            });       
  }


}
