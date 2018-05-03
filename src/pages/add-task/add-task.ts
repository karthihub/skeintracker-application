import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import moment from 'moment';
import { CommonservicesProvider } from '../../providers/commonservices/commonservices';
import { MyApp } from '../../app/app.component';

@IonicPage()
@Component({
  selector: 'page-add-task',
  templateUrl: 'add-task.html',
})

export class AddTaskPage {
  public projectname: any;
  public taskname: any;
  public timetaken: any;
  public status: any;
  public date: any = moment().format('YYYY-MM-DD');
  public description: any;
  public data: any;
  public id:any;
  taskData:any;
  nameval:any="";
  frompage:any="";
  assignTo:any="";
  add_task: FormGroup;
  projects = [
    {
      "name":"Buddy",
    },  
    {
      "name":"BM Offers", 
    },
    {
      "name":"DOF", 
    },
    {
      "name":"Maisarah", 
    },
    {
      "name":"Omantel", 
    },
    {
      "name":"Tranzlogix", 
    },
    {
      "name":"Criz Catch", 
    },
    {
      "name":"Skein App", 
    },
    {
      "name":"3D Team" 
    }
    ];

time = [
      { "hours":"00:30" }, { "hours":"01:00" }, { "hours":"01:30" }, { "hours":"02:00" }, { "hours":"02:30" }, { "hours":"03:00" }, { "hours":"03:30" }, { "hours":"04:00" }, { "hours":"04:30" }, { "hours":"05:00" }, { "hours":"05:30" }, { "hours":"06:00" },  { "hours":"06:30" }, { "hours":"07:00" },  { "hours":"07:30" },  { "hours":"08:00" },
    ];

constructor(public commonService: CommonservicesProvider, private formBuilder: FormBuilder, 
            public loadingCtrl: LoadingController, private http: Http, public navparams: NavParams, 
            public navCtrl: NavController, public alertCtrl: AlertController, public navParams: NavParams,
            public mainServices: MyApp) {
  this.frompage = this.navparams.get("frompage");
  this.nameval =  this.navparams.get("tasks");
  this.assignTo = this.navparams.get("assignTo");
  console.log([this.frompage, this.nameval, this.assignTo]);
  this.id= localStorage.getItem('skeinid');
  
  this.add_task = this.formBuilder.group({
    skein_id   : this.assignTo ? ['Select', Validators.compose([ Validators.required])] : this.id,
    assignedBy : this.id,
    task_id    : this.nameval.task_id,
    projectname: ['Select', Validators.compose([ Validators.required])],
    taskname   : ['', Validators.compose([ Validators.required])],
    timetaken  : ['Select', Validators.compose([ Validators.required])],
    status     : ['Select', Validators.compose([ Validators.required])],
    date       : [this.date, Validators.compose([ Validators.required])],
    description: ['', Validators.compose([ Validators.required])]
  });

  }

  editf(){
    if(this.frompage == "home"){
      this.add_task.get(["projectname"]).setValue(this.nameval.projectname);
      this.add_task.get(["taskname"]).setValue(this.nameval.taskname);
      this.add_task.get(["timetaken"]).setValue(this.nameval.timetaken);
      this.add_task.get(["status"]).setValue(this.nameval.status);
      this.add_task.get(["date"]).setValue(this.nameval.date);
      this.add_task.get(["description"]).setValue(this.nameval.description);
    }    
  }

 addtasks(){
  let loading = this.loadingCtrl.create({
    spinner: 'bubbles',
    content: 'Please wait...'
  });

  loading.present();

//Assigning register credentials to 'this.data'

  let headers = new Headers(
    {
      'Content-Type' : 'application/json', 
    });
  
  let options = new RequestOptions({ headers: headers });

  if(this.add_task.value.projectname == "Select") {
      this.mainServices.commanAlertWithOkWindow("Please select the Project name", "errorInfo");
      loading.dismiss();
  }
  else if(this.add_task.value.skein_id == "Select") {
    this.mainServices.commanAlertWithOkWindow("Please assign the Employee", "errorInfo");
    loading.dismiss();
  }
  else if(this.add_task.value.timetaken == "Select"){
      this.mainServices.commanAlertWithOkWindow("Please select the Time taken", "errorInfo");
      loading.dismiss();
  }
  else if(this.add_task.value.status == "Select" ){
      this.mainServices.commanAlertWithOkWindow("Please select the Status", "errorInfo");
      loading.dismiss();
  }

  else{
  
//Post method to send register data

this.http.post(this.commonService.api +'/'+ this.commonService.empTaskAdd +'/', this.add_task.value, options)      
.subscribe((res:any) => {
  let success:any = JSON.parse(res._body);
console.log("res"+success);
    if(success.status == 200){
      this.mainServices.commanAlertWithOkWindow(success.message, "successInfo");
      loading.dismiss();
      this.assignTo ? this.navCtrl.pop() : this.navCtrl.pop();
    }else if(success.status == 401){
      loading.dismiss();
      this.mainServices.commanAlertWithOkWindow(success.message, "errorInfo");
    }})  
  }

    }

edittasks(){

  let loading = this.loadingCtrl.create({
    spinner: 'bubbles',
    content: 'Please wait...'
  });

  loading.present();

      //Assigning register credentials to 'this.data'
        
    let headers = new Headers({
        'Content-Type' : 'application/json', 
      });
        
    let options = new RequestOptions({ headers: headers });

    if(this.add_task.value.projectname == "Select") {
      this.mainServices.commanAlertWithOkWindow("Please select the Project name", "errorInfo");
      loading.dismiss();
    }
	else if(this.add_task.value.skein_id == "Select") {
     	 this.mainServices.commanAlertWithOkWindow("Please assign the Employee", "errorInfo");
loading.dismiss();
    }    else if(this.add_task.value.timetaken == "Select"){
      this.mainServices.commanAlertWithOkWindow("Please select the Time taken", "errorInfo");
      loading.dismiss();
    }
    else if(this.add_task.value.status == "Select" ){
      this.mainServices.commanAlertWithOkWindow("Please select the Status", "errorInfo");
      loading.dismiss();
    }

    else{
        
      //Post method to send register data
        
      this.http.post(this.commonService.api +'/'+ this.commonService.empTaskUpdate +'/', this.add_task.value, options)      
      .subscribe((res:any) => {
        let success:any = JSON.parse(res._body);
      console.log("res"+success);
          if(success.status == 200){
            this.mainServices.commanAlertWithOkWindow(success.message, "successInfo");
            loading.dismiss();
            this.navCtrl.pop();
          }else if(success.status == 401){
            this.mainServices.commanAlertWithOkWindow(success.message, "errorInfo");
            loading.dismiss();
          }})  

            }
          }



  ionViewDidLoad() {
    console.log('ionViewDidLoad AddTaskPage');
    this.editf();
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
    this.http.post(this.commonService.api +'/'+ this.commonService.getEmpDetails +'/', options)
    .subscribe((res:any) => {
      let success:any = JSON.parse(res._body);
    console.log("res"+success);
        if(success.status == 200){
          this.taskData = success.body;
          loading.dismiss();
        }else if(success.status == 401){
          this.mainServices.commanAlertWithOkWindow(success.message, "errorInfo");
          loading.dismiss();
        }})  
  }

}
