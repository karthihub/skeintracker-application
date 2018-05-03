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
  selector: 'page-project-list',
  templateUrl: 'project-list.html',
})
export class ProjectListPage {
  public projects: any;
  public data: any;

  constructor(public commonService: CommonservicesProvider, private formBuilder: FormBuilder, public events: Events, private camera: Camera, 
    private http: Http, private toast: ToastController, private network: Network, 
    public loadingCtrl: LoadingController, public platform: Platform, 
    public alertCtrl: AlertController, public statusBar: StatusBar, 
    public navCtrl: NavController, public navParams: NavParams, public mainServices: MyApp) {
  }

  addProject(){
    this.navCtrl.push("AddProjectPage", {"tasks":"", "frompage":""});
  }

  editProject(getEvent:any){
    this.navCtrl.push("AddProjectPage", {"tasks":getEvent, "frompage":"projectList"});
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
    this.http.post(this.commonService.api +'/'+ this.commonService.getProjectList +'/', options)
      .map(res=>res.json())
      .subscribe((data:any) => {
        console.log(data);
        let taskData = data.body;
        this.projects = taskData;
        loading.dismiss();
    });
          
  }

  deleteProject(getEvent:any) {


      //let  id = getEvent.id
 
      let headers = new Headers({
      'Content-Type' : 'application/json'
      });

      let tempJSON = {skein_id : getEvent.id}
      
      let options = new RequestOptions({ headers: headers });

      this.http.post(this.commonService.api +'/'+ this.commonService.deleteProject +'/',tempJSON, options)      
      .subscribe((res:any) => {
            let success:any = JSON.parse(res._body);
            console.log("res"+success);
            if(success.status == 200){
              this.mainServices.commanAlertWithOkWindow(success.message, "successInfo");
              this.navCtrl.push("ProjectListPage");
            }else if(success.status == 401){
              this.mainServices.commanAlertWithOkWindow(success.message, "errorInfo");
            }
            
            //loading.dismiss();
            
              }
            );
          
  }

}
