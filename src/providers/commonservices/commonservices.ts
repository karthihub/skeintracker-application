import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class CommonservicesProvider {

  //api:any                 = "https://skeintracker.mybluemix.net";
  // api:any              = "https://www.skeinlab.com";
  // login:any            = "useAuthendication";
  // task:any             = "Task";
  // leave:any            = "Leave";
  // date:any             = "Date";
  // photosave:any        = "PhotoSave";
  // myapi:any            = "myapi";
  // forgot:any           = "useForgotPass";
  // addprojects:any      = "AddProject";
  // removeByAssignee:any = "removeByAssignee";

  api:any = "http://stracker-app-skein-tracker-application.7e14.starter-us-west-2.openshiftapps.com";
  empRegistration = "empRegistration";
  empDetailsUpdate = "empDetailsUpdate";
  useAuthendication = "useAuthendication";
  getEmpDetails = "getEmpDetails";
  updateEmpAvatar = "updateEmpAvatar";
  updateEmpStatus = "updateEmpStatus";
  addProject = "addProject";
  editProject = "editProject";
  getProjectList = "getProjectList";
  empRemoveByAssignee = "empRemoveByAssignee";
  empApplyLeave = "empApplyLeave";
  empLeaveUpdate = "empLeaveUpdate";
  getEmpLeaveList = "getEmpLeaveList";
  useForgotPass = "useForgotPass";
  empTaskAdd = "empTaskAdd";
  empTaskUpdate = "empTaskUpdate";
  getEmpTaskList = "getEmpTaskList";
  getEmpAvatar = "getEmpAvatar";
  getEmpListBYAssignee = "getEmpListBYAssignee";
  deleteProject = "deleteProject";
  getEmpDetailsALL = "getEmpDetailsALL";
  getnotifyList = "getnotifyList";
  notifyUpdate = "notifyUpdate";
  notifyAdd = "notifyAdd";
  deleteNotify = "deleteNotify";
  generateOtp  = "generateOtp";



  constructor(public http: HttpClient) {
    console.log('Hello CommonservicesProvider Provider');
  }

}
