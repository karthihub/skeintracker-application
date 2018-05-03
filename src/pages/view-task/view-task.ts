import { Component, Pipe, PipeTransform } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, Navbar } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { Http, Headers, RequestOptions } from '@angular/http';
import { DatePicker } from '@ionic-native/date-picker';
import { CommonservicesProvider } from '../../providers/commonservices/commonservices';
import { MyApp } from '../../app/app.component';
//import { GroupByPipe } from "../../pipes/group-by/group-by";
import {ChartsModule}  from 'ng2-charts/ng2-charts';
import moment from 'moment';
import { ViewChild } from '@angular/core';
import { Slides } from 'ionic-angular';
import { flatten } from '@angular/compiler';

@IonicPage()
@Component({
  selector: 'page-view-task',
  templateUrl: 'view-task.html',
})

export class ViewTaskPage {
  tasks:any;
  id:any;
  public fromdate:any;
  public todate:any;
  public dateData:any;
  myDate:any;
  public data:any;
  shownGroup = null;
  public chartView:any=false;
  public chartViewWeekly:any = false;
  public chartViewMonthly:any = false;
  public barChartViewLabel:any = "";
  public barChartMonthView:any = false;
  public showingDataStr = "";
  public viewTaskTaggle:boolean = false;
  // Doughnut
  public doughnutChartLabels:any = [];
  public doughnutChartData:any = [];
  public doughnutChartType:string = 'doughnut';
  public todayTask:any; public yesterdayTask:any; public lastWeekTask:any; public lastMonthTask:any;
  public currentDate = moment().format('YYYY-MM-DD');
  public lastDate = moment(this.currentDate).add(-1, 'day').format('YYYY-MM-DD');
  public chartDTLSingleDate:any = [];
  public customChartView = false;

  //Sider Components
  public sliderData:any = [{name : "Today"}, {name :"Yesterday"} , {name :"Last Week"}, {name :"Last Month"}];
  @ViewChild(Slides) slides: Slides;
  @ViewChild(Navbar) navBar: Navbar;
  public taskData:any;
  public canvasView:Boolean = false;

  //Bar Chart
  public barChartOptions:any = {
    scaleShowVerticalLines: false,
    responsive: true,
    scales: {
      xAxes: [{
          gridLines: {
              display: false
          }
      }],
      yAxes: [{
        scaleLabel: {
          display: true,
          padding:10
        },
        ticks: {
          min: 0,
          max: 8,
          stepSize: 1         
        }
      }]
  },
      legend: {
        display: false,
        labels: {
            fontColor: '#2ea2ad'
        }
    },
    animation: {
      onComplete: function () {
          var chartInstance = this.chart,
          ctx = chartInstance.ctx;
          ctx.textAlign = 'end';
          ctx.textBaseline = 'left';
          this.data.datasets.forEach(function (dataset, i) {
              var meta = chartInstance.controller.getDatasetMeta(i);
              meta.data.forEach(function (bar, index) {
                  var data = dataset.data[index];
                  if(data > 0){
                  ctx.fillText(data, bar._model.x - 5, bar._model.y + 5);
                }
              });
          });
      }
  }
  };
  public barChartLabels:string[] = [];
  public barChartColors:any = [{
    backgroundColor: ["PINK","INDIANRED","LIGHTSALMON","GOLD","LAVENDER","BLUEVIOLET","PURPLE","MEDIUMSLATEBLUE","GREENYELLOW","MEDIUMSEAGREEN","MEDIUMAQUAMARINE","AQUA","DODGERBLUE","NAVY","BLANCHEDALMOND","CHOCOLATE","DARKGRAY","ROSYBROWN","GOLDENROD","LIGHTBLUE","SALMON","CRIMSON","ORANGERED","PALEGOLDENROD","LAVENDER"]
 }];
  public barChartType:string = 'horizontalBar';
  public barChartLegend:boolean = true;
  public barChartDataList:any = [];
  public barChartView:any = false;
  public barChartData:any[] = [{data: this.barChartDataList, label: 'Series A'}];
  public totalHours:any;


  constructor(public alertCtrl: AlertController, public commonService: CommonservicesProvider, 
              public loadingCtrl: LoadingController, public datePicker: DatePicker, private http: Http, 
              public navCtrl: NavController, public navParams: NavParams, public mainServices: MyApp) {
    this.tasks = [];
  }

  countDecimals(value) {
    if(Math.floor(value) === value) return 0;
    return value.toString().split(".")[1].length || 0; 
}

roundTo(n, digits) {
  if(digits > 2){
    var fields = n.toString().split('.');
    var num = fields[0];
    var digit = fields[1];
    var res = digit.slice(0,2);
    return num+'.'+res;
  }else{
    return n;
  }


}

  getRandomColors(){
    var tempColor = ["PINK","INDIANRED","LIGHTSALMON","GOLD","LAVENDER","BLUEVIOLET","PURPLE","MEDIUMSLATEBLUE","GREENYELLOW","MEDIUMSEAGREEN","MEDIUMAQUAMARINE","AQUA","DODGERBLUE","NAVY","BLANCHEDALMOND","CHOCOLATE","DARKGRAY","ROSYBROWN","GOLDENROD","LIGHTBLUE","SALMON","CRIMSON","ORANGERED","PALEGOLDENROD","LAVENDER","TOMATO","CORAL","FIREBRICK","CRIMSON","INDIANRED","GREENYELLOW","MEDIUMSEAGREEN","MEDIUMAQUAMARINE","AQUA","DODGERBLUE"];
    for (var i = tempColor.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = tempColor[i];
      tempColor[i] = tempColor[j];
      tempColor[j] = temp;
  }

  this.barChartColors = [{
    backgroundColor: tempColor
 }];
  
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

  ionViewCanEnter() {

    let loading = this.loadingCtrl.create({
      spinner: 'bubbles',
      content: 'Please wait...'
    });
  
    loading.present();
    this.id= localStorage.getItem('employeeid');
    console.log(this.id);

    let headers = new Headers({
      'Content-Type' : 'application/json', 
    });

    let options = new RequestOptions({ headers: headers });
    let tempJSON = {skein_id : this.id};
    this.http.post(this.commonService.api +'/'+ this.commonService.getEmpTaskList+'/', tempJSON, options)
    .map(res=>res.json())
    .subscribe((data:any) => {
      this.taskData = data.body;
      this.getRandomColors();
      this.taskDataforCurrentDay();   
      loading.dismiss();
    });
  }

  chartViewToggle(){
    this.chartView = !this.chartView;
    console.log("ChartView ==>>"+this.chartView);
  }

   
  
   // events
   public chartClicked(e:any):void {
     console.log("chartClicked==>>");
     if(e.active.length > 0){
      this.chartDTLSingleDate = [];
      this.chartDTLSingleDate.push(this.tasks[e.active[0]._index]);
     }
     
   }
  
   public chartHovered(e:any):void {
     console.log("chartHovered==>>"+ JSON.stringify(e));
   }

   public pieChartOptions: any = {
    legend: {
      position: 'right',

    } 
}

taskDataforYesterDay()
{
  let loading = this.loadingCtrl.create({
    spinner: 'bubbles',
    content: 'Please wait...'
  });
  loading.present();

  if(this.taskData){
  this.doughnutChartLabels = [];
  this.doughnutChartData = [];
  this.tasks = [];
  this.chartDTLSingleDate = [];
  this.totalHours = 0;
  this.showingDataStr = "YesterDay";
  let tempTimeTaken = 0;
  
  for(let i=0; i < this.taskData.length; i++){
    if(this.lastDate == this.taskData[i].date){
      let tempTask = {
        "task_id": this.taskData[i].task_id,
        "skein_id": this.taskData[i].skein_id,
        "projectname": this.taskData[i].projectname,
        "taskname": this.taskData[i].taskname,
        "timetaken": this.taskData[i].timetaken,
        "status": this.taskData[i].status,
        "date": this.taskData[i].date,
        "description": this.taskData[i].description
        }

        this.doughnutChartLabels.push(this.taskData[i].projectname);
        let chartHours = parseInt(this.taskData[i].timetaken)  * 12.5;
        tempTimeTaken = parseFloat(this.taskData[i].timetaken.replace(":", "."));
        this.totalHours += tempTimeTaken;
        this.doughnutChartData.push(chartHours);
        this.tasks.push(tempTask);
    }
  }
  setTimeout(()=>{    //<<<---    using ()=> syntax
    this.canvasView = true;
    loading.dismiss();
},100);
  this.chartDTLSingleDate.push(this.tasks[0]);
}else{
  this.showingDataStr = "YesterDay";
  this.tasks = [];
  loading.dismiss();
}
}

taskDataforCurrentDay()
  {
    let loading = this.loadingCtrl.create({
      spinner: 'bubbles',
      content: 'Please wait...'
    });
    loading.present();
    if(this.taskData){
      this.doughnutChartLabels = [];
      this.doughnutChartData = [];
      this.tasks = [];
      this.chartDTLSingleDate = [];
      this.totalHours = 0;
      this.showingDataStr = "Current Day";
      let tempTimeTaken = 0.00;
      for(let i=0; i < this.taskData.length; i++){
        if(this.currentDate == this.taskData[i].date){
          let tempTask = {
            "task_id": this.taskData[i].task_id,
            "skein_id": this.taskData[i].skein_id,
            "projectname": this.taskData[i].projectname,
            "taskname": this.taskData[i].taskname,
            "timetaken": this.taskData[i].timetaken,
            "status": this.taskData[i].status,
            "date": this.taskData[i].date,
            "description": this.taskData[i].description
            }

            this.doughnutChartLabels.push(this.taskData[i].projectname);
            let chartHours = parseInt(this.taskData[i].timetaken)  * 12.5;
            tempTimeTaken = parseFloat(this.taskData[i].timetaken.replace(":", "."));
            this.totalHours += tempTimeTaken;
            this.doughnutChartData.push(chartHours);
            this.tasks.push(tempTask);
        }
      }
      setTimeout(()=>{    //<<<---    using ()=> syntax
        this.canvasView = true;
        loading.dismiss();
   },100);
      
      this.chartDTLSingleDate.push(this.tasks[0]);
    }else{
      this.tasks = [];
      this.showingDataStr = "Current Day";
      loading.dismiss();
    }
        

  }

  loadDonutDataforWeekDay(index)
  {     
        this.canvasView = false;
        this.doughnutChartLabels = [];
        this.doughnutChartData = [];
        this.tasks = [];
        this.chartDTLSingleDate = [];
        let customDate:any;
        // let loading = this.loadingCtrl.create({
        //   spinner: 'bubbles',
        //   content: 'Please wait...'
        // });
        // loading.present();
        if(index == 0)
        {
          customDate = this.currentDate; 
        }else{
          customDate = moment(this.currentDate).add(-index, 'day').format('YYYY-MM-DD');
        }
        
        //alert(customDate);

        for(let i=0; i < this.taskData.length; i++){
          if(customDate == this.taskData[i].date){
            let tempTask = {
              "task_id": this.taskData[i].task_id,
              "skein_id": this.taskData[i].skein_id,
              "projectname": this.taskData[i].projectname,
              "taskname": this.taskData[i].taskname,
              "timetaken": this.taskData[i].timetaken,
              "status": this.taskData[i].status,
              "date": this.taskData[i].date,
              "description": this.taskData[i].description
              }

              this.doughnutChartLabels.push(this.taskData[i].projectname);
              let chartHours = parseInt(this.taskData[i].timetaken)  * 12.5;
              this.doughnutChartData.push(chartHours);
              this.tasks.push(tempTask);
          }
        }
        setTimeout(()=>{    //<<<---    using ()=> syntax
          this.barChartView = false;
          this.viewTaskTaggle = false;
          // loading.dismiss();
     },100);
        
        this.chartDTLSingleDate.push(this.tasks[0]);
        console.log(this.chartDTLSingleDate.length);

  }

  taskDataforLastWeek(){
    let loading = this.loadingCtrl.create({
      spinner: 'bubbles',
      content: 'Please wait...'
    });
    loading.present();
    if(this.taskData){
    this.doughnutChartLabels = [];
    this.doughnutChartData = [];
    this.tasks = [];
    this.chartDTLSingleDate = [];
    this.barChartDataList = [];
    this.barChartLabels = [];
    this.barChartData = [];
    this.totalHours = 0;
    this.showingDataStr = "Last Week";
    let i;
    let constDate = 0;
    let barLabelsData = 0;
    let tempTimeTaken:any = 0;
    let tempWeekDate:any;

      for(let j=0; j < 7; j++){
        constDate--;
        tempTimeTaken = 0;
        if(barLabelsData == 0){
          tempWeekDate = this.currentDate;
        }else{
          tempWeekDate = moment(this.currentDate).add(barLabelsData, 'day').format('YYYY-MM-DD');
        }
        
        for(i=0; i < this.taskData.length; i++){
          if(tempWeekDate == this.taskData[i].date){
            let tempTask = {
              "task_id": this.taskData[i].task_id,
              "skein_id": this.taskData[i].skein_id,
              "projectname": this.taskData[i].projectname,
              "taskname": this.taskData[i].taskname,
              "timetaken": this.taskData[i].timetaken,
              "status": this.taskData[i].status,
              "date": this.taskData[i].date,
              "description": this.taskData[i].description
              }

              // this.doughnutChartLabels.push(this.taskData[i].projectname);
              // let chartHours = parseInt(this.taskData[i].timetaken)  * 12.5;
              // this.doughnutChartData.push(chartHours);
              tempTimeTaken += parseFloat(this.taskData[i].timetaken.replace(":", "."));
              // let tmpTime = this.taskData[i].timetaken.replace(":", ".");
              // tempTimeTaken += parseFloat(this.roundTo(tmpTime, this.countDecimals(tmpTime)));
              console.log("tempTimeTaken-loop===>>"+tempTimeTaken);
              
              this.tasks.push(tempTask);
          }
        }
        console.log("tempTimeTaken-final===>>"+ tempTimeTaken);
        this.totalHours += tempTimeTaken;
        this.barChartDataList.push(this.roundTo(tempTimeTaken, this.countDecimals(tempTimeTaken)));
        if(barLabelsData == 0){
          this.barChartLabels.push(this.currentDate);
        }else{
          this.barChartLabels.push(moment(this.currentDate).add(barLabelsData, 'day').format('YYYY-MM-DD'));
        }
        barLabelsData--;
      }
      this.barChartViewLabel = "Last Week [Days Wise]";
      this.barChartData = [
        {data: this.barChartDataList, label: this.barChartViewLabel }
      ];
      //this.loadDonutDataforWeekDay(0);
      setTimeout(()=>{    //<<<---    using ()=> syntax
        // this.loadDonutDataforWeekDay(0);
        
        // console.log("barChartDataList===>>"+this.barChartDataList);
        this.totalHours = this.roundTo(this.totalHours, this.countDecimals(this.totalHours));
        this.barChartView = true;
        // console.log("barChartData===>>"+JSON.stringify(this.barChartData));
        // console.log("barChartLabels==>>"+this.barChartLabels);
        loading.dismiss();
   },1000);

   this.chartDTLSingleDate.push(this.tasks[0]);
  }else{
    this.showingDataStr = "Last Week";
    this.taskData = [];
    loading.dismiss();

  }
}

taskDataforLastMonth(){
  let loading = this.loadingCtrl.create({
    spinner: 'bubbles',
    content: 'Please wait...'
  });
  if(this.taskData){
  this.doughnutChartLabels = [];
    this.doughnutChartData = [];
    this.tasks = [];
    this.chartDTLSingleDate = [];
    this.barChartDataList = [];
    this.barChartLabels = [];
    this.barChartData = [];
    this.totalHours = 0;
    this.showingDataStr = "Last Month";
    let i;
    let constDate = 0;
    let barLabelsData = 0;
    let tempTimeTaken:any = 0;
    let tempWeekDate:any;

    loading.present();
      for(let j=0; j < 28; j++){
        constDate--;
        tempTimeTaken = 0;
        if(barLabelsData == 0){
          tempWeekDate = this.currentDate;
        }else{
          tempWeekDate = moment(this.currentDate).add(barLabelsData, 'day').format('YYYY-MM-DD');
        }
        
        for(i=0; i < this.taskData.length; i++){
          if(tempWeekDate == this.taskData[i].date){
            let tempTask = {
              "task_id": this.taskData[i].task_id,
              "skein_id": this.taskData[i].skein_id,
              "projectname": this.taskData[i].projectname,
              "taskname": this.taskData[i].taskname,
              "timetaken": this.taskData[i].timetaken,
              "status": this.taskData[i].status,
              "date": this.taskData[i].date,
              "description": this.taskData[i].description
              }

              // this.doughnutChartLabels.push(this.taskData[i].projectname);
              // let chartHours = parseInt(this.taskData[i].timetaken)  * 12.5;
              // this.doughnutChartData.push(chartHours);
              tempTimeTaken += parseFloat(this.taskData[i].timetaken.replace(":", "."));
              console.log("tempTimeTaken-loop===>>"+tempTimeTaken);
              
              this.tasks.push(tempTask);
          }
        }
        console.log("tempTimeTaken-final===>>"+ tempTimeTaken);
        this.totalHours += tempTimeTaken;
        this.barChartDataList.push(this.roundTo(tempTimeTaken, this.countDecimals(tempTimeTaken)));
        if(barLabelsData == 0){
          this.barChartLabels.push(this.currentDate);
        }else{
          this.barChartLabels.push(moment(this.currentDate).add(barLabelsData, 'day').format('YYYY-MM-DD'));
        }
        barLabelsData--;
      }
      this.barChartViewLabel = "Last Month [Days Wise]";
      this.barChartData = [
        {data: this.barChartDataList, label: this.barChartViewLabel }
      ];
      //this.loadDonutDataforWeekDay(0);
      setTimeout(()=>{    //<<<---    using ()=> syntax
        // this.loadDonutDataforWeekDay(0);
        
        // console.log("barChartDataList===>>"+this.barChartDataList);
        this.totalHours = this.roundTo(this.totalHours, this.countDecimals(this.totalHours));
        this.barChartView = true;
        // console.log("barChartData===>>"+JSON.stringify(this.barChartData));
        // console.log("barChartLabels==>>"+this.barChartLabels);
        loading.dismiss();
   },1000);

   this.chartDTLSingleDate.push(this.tasks[0]);
  }else{
    this.showingDataStr = "Last Month";
    this.taskData = [];
    loading.dismiss();

  }
}



slideChanged(index) 
  {
    console.log(index);
    if(index == 'B'){
      switch(this.showingDataStr){
        case 'Current Day':
          this.canvasView = false;
          this.getRandomColors();
          this.viewTaskTaggle = true;
          this.taskDataforLastMonth();
          //this.barChartView = true;
          this.barChartMonthView = true;
          break;
        case 'YesterDay':
          this.canvasView = false;
          this.viewTaskTaggle = false;
          this.taskDataforCurrentDay();
          this.barChartView = false;
          break;
        case 'Last Week':
          this.canvasView = false;
          this.viewTaskTaggle = false;
          this.taskDataforYesterDay();
          this.barChartView = false;
          break;
        case 'Last Month':
          this.canvasView = false;
          this.getRandomColors();
          this.viewTaskTaggle = true;
          this.taskDataforLastWeek();
          //this.barChartView = true;
          this.barChartMonthView = false;
          break;
        }
    }else{
      switch(this.showingDataStr){
        case 'Current Day':
          this.canvasView = false;
          this.viewTaskTaggle = false;
          this.taskDataforYesterDay();
          this.barChartView = false;
          break;
        case 'YesterDay':
          this.canvasView = false;
          this.getRandomColors();
          this.viewTaskTaggle = true;
          this.taskDataforLastWeek();
          // this.barChartView = true;
          this.barChartMonthView = false;
          break;
        case 'Last Week':
          this.canvasView = false;
          this.getRandomColors();
          this.viewTaskTaggle = true;
          this.taskDataforLastMonth();
          //this.barChartView = false;
          this.barChartMonthView = true;
          break;
        case 'Last Month':
          this.canvasView = false;
          this.viewTaskTaggle = false;
          this.taskDataforCurrentDay();
          this.barChartView = false;
          break;
    }

    // let currentIndex = this.slides.getActiveIndex();
    // console.log('Current index is', currentIndex);
    
  }

  }

    // Bar Chart Events
    public chartClickedBar(e:any):void {
      console.log(e);
      if(e.active.length > 0){
        this.loadDonutDataforWeekDay(e.active[0]._index);
       }
      
    }
   
    public chartHoveredBar(e:any):void {
      console.log(e);
      if(e.active.length > 0){
        this.customChartView = true;
        this.loadDonutDataforWeekDay(e.active[0]._index);
       }
    }
   
    public randomize():void {
      // Only Change 3 values
      let data = [
        Math.round(Math.random() * 100),
        59,
        80,
        (Math.random() * 100),
        56,
        (Math.random() * 100),
        40];
      let clone = JSON.parse(JSON.stringify(this.barChartData));
      clone[0].data = data;
      this.barChartData = clone;
  
}

ionViewDidLoad() {
  this.navBar.backButtonClick = (e:UIEvent)=>{
   // todo something
   console.log("Go Back");
   if(this.customChartView){
    this.customChartView = !this.customChartView;
    switch(this.showingDataStr){
      case 'Current Day':
        this.canvasView = false;
        this.taskDataforCurrentDay();
        this.barChartView = false;
        break;
      case 'YesterDay':
        this.canvasView = false;
        this.taskDataforYesterDay();
        this.barChartView = false;
        break;
      case 'Last Week':
        this.canvasView = false;
        this.getRandomColors();
        this.viewTaskTaggle = true;
        this.taskDataforLastWeek();
        // this.barChartView = true;
        this.barChartMonthView = false;
        break;
      case 'Last Month':
        this.canvasView = false;
        this.getRandomColors();
        this.viewTaskTaggle = true;
        this.taskDataforLastMonth();
        // this.barChartView = true;
        this.barChartMonthView = true;
        break;
      }
   }else{
    this.navCtrl.pop();
   }

  }
}

}
