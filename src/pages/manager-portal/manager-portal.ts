import { Component, Pipe, PipeTransform } from '@angular/core';
import { Events, IonicPage, NavController, NavParams, MenuController, LoadingController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { Http, Headers, RequestOptions } from '@angular/http';
import { GroupByPipe } from "../../pipes/group-by/group-by";
import { CommonservicesProvider } from '../../providers/commonservices/commonservices';
import { MyApp } from '../../app/app.component';

@IonicPage()
@Component({
  selector: 'page-manager-portal',
  templateUrl: 'manager-portal.html',
})
export class ManagerPortalPage {

  nameval:any="";
  empOptions:any="";
  employee:any;
  public id:any;
  public data:any;
  public tasks:any;
  public employees:any;
  public filterItemsEMP:any;
  public searchTaggleBtn:boolean = false;
  public searchOption:any = false;

  constructor(private menu: MenuController, public commonService: CommonservicesProvider, 
             public events: Events, private http: Http, public loadingCtrl: LoadingController, 
             public navCtrl: NavController, public navParams: NavParams, public mainServices: MyApp) {
    this.menu.swipeEnable(true);
    this.nameval = this.navParams.get("nameth");
    // this.empOptions = this.navParams.get("empOptions");
    this.empOptions = localStorage.getItem("empOptions");
    console.log(this.empOptions);
  }

  openMenu(evt) {
    if(evt === "main"){
       this.menu.enable(true, 'managerMenu');
    }
    this.menu.toggle();
}

  ionViewCanEnter() {
    this.events.publish('user:login');

    let loading = this.loadingCtrl.create({
      spinner: 'bubbles',
      content: 'Please wait...'
    });
  
    loading.present();

    let headers = new Headers({
      'Content-Type' : 'application/json', 
    });

    let tempJSON = {"skein_id" : localStorage.getItem('skeinid')}
    let options = new RequestOptions({ headers: headers });
    this.http.post(this.commonService.api +'/'+ this.commonService.getEmpListBYAssignee +'/', tempJSON, options)
      .map(res=>res.json())
      .subscribe((data:any) => {
        console.log(data);
        let taskData = data.body;
        this.employees = taskData;
        if(this.employees.length > 0){this.searchOption = true;}else{this.searchOption = false;}
        this.filterItemsEMP =  Object.assign([{}], taskData);
        loading.dismiss();
    });
  }

  viewEmployee(employer:any){
    console.log(employer.skein_id);
    this.employee= localStorage.setItem('employeeid', employer.skein_id);
    this.navCtrl.push("ViewTaskPage");
  }

  addtask(){
    this.navCtrl.push("AddTaskPage", {"frompage":"", "tasks":"", "assignTo":"true"});
    //this.rootPage=AddTaskPage;
}

initializeItems() {
  this.employees = this.filterItemsEMP;
}

getItems(ev: any) {
  // Reset items back to all of the items
  this.initializeItems();

  // set val to the value of the searchbar
  let val = ev.target.value;

  // if the value is an empty string don't filter the items
  if (val && val.trim() != '') {
    this.employees = this.employees.filter((item) => {
      return (item.fullname.toLowerCase().indexOf(val.toLowerCase()) > -1);
    })
  }
}

searchFilter(){
  this.searchTaggleBtn = !this.searchTaggleBtn;
}

assigneeRemove(skeinID){
  this.mainServices.alertWindowWithTwoBtnsMsg = "Do you want to delete this User?";
  this.mainServices.alertWindowWithTwoBtns.confirm().then((res) => {
    let loading = this.loadingCtrl.create({
      spinner: 'bubbles',
      content: 'Please wait...'
    });
  
    loading.present();
  
    let headers = new Headers({
      'Content-Type' : 'application/json', 
    });
  
    let options = new RequestOptions({ headers: headers });
    this.http.post(this.commonService.api +'/'+ this.commonService.empRemoveByAssignee +'/', {skein_id : skeinID}, options)
    .subscribe((res:any) => {
      let success:any = JSON.parse(res._body);
    console.log("res"+success);
        if(success.status == 200){
          this.mainServices.commanAlertWithOkWindow(success.message, "successInfo");
          loading.dismiss();
          this.ionViewCanEnter();
        }else if(success.status == 401){
          this.mainServices.commanAlertWithOkWindow(success.message, "errorInfo");
          loading.dismiss();
        }})
      })
    }




}
