import { BrowserModule } from '@angular/platform-browser';
import { NgPipesModule } from 'ngx-pipes';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule, NavController, ViewController } from 'ionic-angular';
import { HttpModule } from '@angular/http';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/Rx';
import { DatePicker } from '@ionic-native/date-picker';
import { PipesModule } from "../pipes/pipes.module";
import { Network } from '@ionic-native/network';
import { Camera, CameraOptions } from '@ionic-native/camera';
import {ChartsModule}  from 'ng2-charts/ng2-charts';
import moment from 'moment';
import { MyApp } from './app.component';
import { TextMaskModule } from 'angular2-text-mask';
import { Device } from '@ionic-native/device';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { CommonutilsProvider } from '../providers/commonutils/commonutils';
import { CommonservicesProvider } from '../providers/commonservices/commonservices';


@NgModule({
  declarations: [
    MyApp,
  ],
  imports: [
    BrowserModule, HttpModule, HttpClientModule,
    NgPipesModule,
    PipesModule,
    ChartsModule,
    TextMaskModule,
    IonicModule.forRoot(MyApp),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    DatePicker,
    Camera,
    HttpModule,
    HttpClient,
    Network,
    Device,
    MyApp,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    CommonutilsProvider,
    CommonservicesProvider
  ]
})
export class AppModule {}