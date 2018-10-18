import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpModule, Http } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HttpClientXsrfModule, HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { NgZorroAntdModule } from 'ng-zorro-antd';
// 全局服务
import { BaseService } from './services/base.service';
import { RoomService } from './services/room.service';
import { AlertService } from './services/alert.service';
import { LoginSessionService } from './services/loginsession.service';

import { AppRoutingModule } from './app-routing.module';
// 引入Echart
import { NgxEchartsModule } from 'ngx-echarts';




import { AppComponent } from './app.component';
import { CommonComponent } from './components/common/common.component';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { StatisticalComponent } from './components/statistical/statistical.component';
import { ProjectListComponent } from './components/project-list/project-list.component';
import { EchartComponent } from './components/common/echart/echart.component';
import { DatepickerComponent } from './components/common/datepicker/datepicker.component';
import { DataTableComponent } from './components/common/dataTable/dataTable.component';
import { DropDownComponent } from './components/common/dropdown/dropdown.component';
import { JoinComponent } from './components/room/join/join.component';
import { CreateComponent } from './components/room/create/create.component';
import { SettingsComponent } from './components/room/create/settings/settings.component';

import { ConferenceComponent } from './components/room/conference/conference.component';
import { RegisterComponent } from './components/register/register.component';

@NgModule({
  declarations: [
    AppComponent,
    CommonComponent,
    LoginComponent,
    DashboardComponent,
    HeaderComponent,
    FooterComponent,
    SidebarComponent,
    StatisticalComponent,
    ProjectListComponent,
    EchartComponent,
    DatepickerComponent,
    DataTableComponent,
    DropDownComponent,
    JoinComponent,
    CreateComponent,
    ConferenceComponent,
    SettingsComponent,
    RegisterComponent,
    
],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    NgxEchartsModule,
    HttpClientModule,
    AppRoutingModule,
    NgZorroAntdModule.forRoot()
  ],
  providers: [BaseService, RoomService, AlertService, LoginSessionService],
  bootstrap: [AppComponent]
})
export class AppModule { }
