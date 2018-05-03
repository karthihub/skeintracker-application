import { Component } from '@angular/core';
import { Events, IonicPage, NavController, NavParams } from 'ionic-angular';
import { Nav, Platform, AlertController, LoadingController, ToastController } from 'ionic-angular';
import { Network } from '@ionic-native/network';
import { StatusBar } from '@ionic-native/status-bar';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { Http, Headers, RequestOptions } from '@angular/http';
import { CommonservicesProvider } from '../../providers/commonservices/commonservices';
import { MyApp } from '../../app/app.component';

@IonicPage()
@Component({
  selector: 'page-edit-profile',
  templateUrl: 'edit-profile.html',
})
export class EditProfilePage {

  public id:any;
  public data: any;
  public photos: any;
  public cameraPhoto: any;
  public base64Image: any;
  public imageOne: any;
  public tasks: any;
  public empOptions:any;
  public isMngOption:any;
  postsArray: any = {};
  pages: Array<{title: string, component: any}>;

  constructor(public commonService: CommonservicesProvider, public events: Events, private camera: Camera, 
             private http: Http, private toast: ToastController, private network: Network, 
             public loadingCtrl: LoadingController, public platform: Platform, 
             public alertCtrl: AlertController, public statusBar: StatusBar, 
             public navCtrl: NavController, public navParams: NavParams, public mainServices: MyApp) {
    this.id= localStorage.getItem('skeinid');
    console.log(this.id);
    this.empOptions = (localStorage.getItem('empOptions') == 'true');
    this.isMngOption = (localStorage.getItem('isMngOption') == 'true');
    console.log(this.empOptions +"==="+ localStorage.getItem('empOptions'))
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
      this.photos = this.base64Image;
      //localStorage.setItem("userPhoto", this.photos);
      this.view();
    }, 
    (err) => {
      console.log("errFromTakenPhoto==>>"+err);
    });
  }

  view(){
    let loading = this.loadingCtrl.create({
      spinner: 'bubbles',
      content: 'Please wait...'
    });

    loading.present();

    this.id = localStorage.getItem('skeinid');
    console.log(this.photos);
      this.data = {
       "skein_id":  this.id,
       "photos" :   this.photos
      };
      console.log("image", this.data);      
       let headers = new Headers(
         {
           'Content-Type' : 'application/json', 
        });      
      let options = new RequestOptions({ headers: headers });        
      this.http.post(this.commonService.api +'/'+ this.commonService.updateEmpAvatar +'/', this.data, options)      
        .subscribe(
        res => {
        console.log("res"+res);
        this.mainServices.commanAlertWithOkWindow("Photo added successfully", "successInfo");
        loading.dismiss();
          },
          err => {
            console.log("Error occured"+err);
            loading.dismiss();
          }
        );
  }

  uploadPhoto() {
    this.camera.getPicture({
      sourceType: this.camera.PictureSourceType.SAVEDPHOTOALBUM,
      destinationType: this.camera.DestinationType.DATA_URL, quality: 30,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    }).then((imageData) => {

      this.base64Image = 'data:image/jpeg;base64,' + imageData;
      this.photos = this.base64Image;
      //localStorage.setItem("userPhoto", this.photos);
      this.gallery();
    }, 
    (err) => {
      console.log("errFromTakenPhoto==>>"+err);
    });
  }

  gallery(){
    let loading = this.loadingCtrl.create({
      spinner: 'bubbles',
      content: 'Please wait...'
    });

    loading.present();

      this.id = localStorage.getItem('skeinid');
      console.log(this.photos);

      this.data = {
       "skein_id":  this.id,
       "photos":    this.photos
      };
      console.log("image",this.data);      
      let headers = new Headers(
        {
          'Content-Type' : 'application/json', 
        });      
      let options = new RequestOptions({ headers: headers });        
      this.http.post(this.commonService.api +'/'+ this.commonService.updateEmpAvatar +'/', this.data, options)      
        .subscribe(
        res => {
        console.log("res"+res);
        this.mainServices.commanAlertWithOkWindow("Photo updated successfully", "successInfo");
        loading.dismiss();
          },
          err => {
            console.log("Error occured"+err);
            loading.dismiss();
          }
        );
  }

  ionViewCanEnter() {
    let loading = this.loadingCtrl.create({
      spinner: 'bubbles',
      content: 'Please wait...'
    });

    loading.present();

    this.id= localStorage.getItem('skeinid');
    console.log(this.id);
    let headers = new Headers({
      'Content-Type' : 'application/json', 
    });
    let tempJSON = {
      "skein_id" : this.id
    }
    let options = new RequestOptions({ headers: headers });
    this.http.post(this.commonService.api +'/'+ this.commonService.getEmpDetailsALL+'/', tempJSON, options)
      .map(res=>res.json())
      .subscribe((data:any) => {
        let taskData = data.body;
        this.tasks = taskData;
        if(data.body[0].emp_option == '1'){
          localStorage.setItem('empOptions', "true");
        }else{
          localStorage.setItem('empOptions', "false");
        }
        this.empOptions = (data.body[0].emp_option == '1');
        console.log(this.tasks);
        if (this.tasks[0].photos == "" || this.tasks[0].photos == null ){
          loading.dismiss();
          this.photos= ("./assets/icon/avatar.png");
        }
        else{
          loading.dismiss();
          this.photos= this.tasks[0].photos;
        }
        //console.log(this.tasks);
    });
  }

  regEdit(tent:any){
    this.navCtrl.push("SignUpPage", {"tasks":tent,"frompage":"editProfile"});
  }

}
