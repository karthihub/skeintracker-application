import { Component, Pipe, PipeTransform} from '@angular/core';
import { Events, IonicPage, NavController, MenuController, NavParams, LoadingController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { Http, Headers, RequestOptions } from '@angular/http';
import { DatePicker } from '@ionic-native/date-picker';
import { CommonservicesProvider } from '../../providers/commonservices/commonservices';
import { MyApp } from '../../app/app.component';
//import { GroupByPipe } from "../../pipes/group-by/group-by";

@IonicPage()
@Component({
  selector: 'page-employee-portal',
  templateUrl: 'employee-portal.html',
})
export class EmployeePortalPage {

  nameval:any="";
  tasks:any =[];
  id:any;
  tent:any;
  public fromdate:any;
  public todate:any;
  public dateData:any;
  myDate:any;
  public data:any;
  public photos:any;
  shownGroup = null; 
  

  constructor(public commonService: CommonservicesProvider, public events: Events, public alertCtrl: AlertController, 
             public loadingCtrl: LoadingController, private http: Http, public datePicker: DatePicker, 
             public navCtrl: NavController, private menu: MenuController, public navparams: NavParams,
             public mainServices: MyApp) {
    this.menu.swipeEnable(true);
    this.nameval = this.navparams.get("nameth");
    this.tasks = [];

  }

 
  toggleGroup(group) {
    if (this.isGroupShown(group)) {
        this.shownGroup = null;
    } else {
        this.shownGroup = group;
    }
  };
  isGroupShown(group) {
    return this.shownGroup === group;
  };

  openMenu(evt) {
    if(evt === "main"){
       this.menu.enable(true, 'employeeMenu');
    }
    this.menu.toggle();
}
  
  
  // fromCalendar(){
  //   this.datePicker.show({
  //     date: new Date(),
  //     mode: 'date',
  //     titleText: 'Choose Date',
  //     androidTheme: this.datePicker.ANDROID_THEMES.THEME_HOLO_DARK
  //   })
  //   .then(
  //     //date => console.log('Got date: ',this.date = date.getFullYear() + '-' + (date.getMonth()+1) + '-' +  date.getDate()),
  //     date => {
  //       this.fromdate = date.getFullYear() + '-' + (date.getMonth()+1) + '-' +  date.getDate();
  //       //this.fromdate =  console.log('Got date: ', date);
  //       console.log("From", this.fromdate);
  //   },
  //     err => console.log('Error occurred while getting date: ', err)
  //   );
  // }

  // toCalendar(){
  //   this.datePicker.show({
  //     date: new Date(),
  //     mode: 'date',
  //     titleText: 'Choose Date',
  //     androidTheme: this.datePicker.ANDROID_THEMES.THEME_HOLO_DARK
  //   })
  //   .then(
  //     //date => console.log('Got date: ',this.date = date.getFullYear() + '-' + (date.getMonth()+1) + '-' +  date.getDate()),
  //     date => {
  //       this.todate = date.getFullYear() + '-' + (date.getMonth()+1) + '-' +  date.getDate();
  //       //this.todate =  console.log('Got date: ', date);
  //       console.log("TO", this.todate);
  //       this.fromtodate();
  //   },
  //     err => console.log('Error occurred while getting date: ', err)
  //   );
  // }

// fromtodate(){

//   let loading = this.loadingCtrl.create({
//     spinner: 'bubbles',
//     content: 'Please wait...'
//   });

//   loading.present();
//   this.id= localStorage.getItem('skeinid');

//   this.dateData = {
//   skein_id: this.id,
//   fromdate: this.fromdate,
//   todate  : this.todate,
//   }

//   console.log(this.dateData);
   
//   let headers = new Headers(
//     {
//       'Content-Type' : 'application/json', 
//     });

//   let options = new RequestOptions({ headers: headers });

//     this.http.post(this.commonService.api +'/'+ this.commonService.date +'/', this.dateData, options)      
//     .subscribe((res:any) => {
//          console.log("RES", res._body);
//          let taskData = JSON.parse(res._body);
//          if(taskData.status == 200) {
//          this.tasks = taskData.body;
//          console.log(taskData);
//          loading.dismiss();
//          }
//          else {
//          this.tasks = [];
//          this.mainServices.commanAlertWithOkWindow("No data available on this date or please give the date format correctly", "errorInfo");
//         loading.dismiss();
//         }
//     },
//       err => {
//         console.log("Error occured"+err);
//         loading.dismiss();
//       }
//     );

//   console.log(JSON.stringify(this.data));

// }



  ionViewCanEnter() { 
    this.events.publish('user:login');

    let loading = this.loadingCtrl.create({
      spinner: 'bubbles',
      content: 'Please wait...'
    });

    loading.present();
    this.id= localStorage.getItem('skeinid');

    let headers = new Headers({
      'Content-Type' : 'application/json', 
    });
    
    let options = new RequestOptions({ headers: headers });
    this.http.post(this.commonService.api +'/'+ this.commonService.getEmpTaskList +'/', {skein_id : this.id}, options)
    .subscribe((res:any) => {
      let success:any = JSON.parse(res._body);
    console.log("res"+success);
        if(success.status == 200){
          let taskData = success.body;
          this.tasks = taskData;
          loading.dismiss();
        }else if(success.status == 401){
          loading.dismiss();
        }})  
      }
    
 

  goTo(getEvent:any){
    this.navCtrl.push("AddTaskPage", {"tasks":getEvent,"frompage":"home"});
  }

  addtask(){
    this.navCtrl.push("AddTaskPage",{"frompage":"add","tasks":""});
    //this.rootPage=AddTaskPage;
}

}
