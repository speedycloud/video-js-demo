import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CommonComponent } from './components/common/common.component';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';

import { StatisticalComponent } from './components/statistical/statistical.component';
import { ProjectListComponent } from './components/project-list/project-list.component';
import { JoinComponent } from './components/room/join/join.component';
import { CreateComponent } from './components/room/create/create.component';
import { ConferenceComponent } from './components/room/conference/conference.component';
import { RegisterComponent } from "./components/register/register.component";

const routes: Routes = [
  
  { path: 'login', component: LoginComponent },
  { path: 'room', component: CommonComponent,
    children:[
        { path: 'join', component: JoinComponent},
        { path: 'create', component: CreateComponent},
        { path: 'conference', component: ConferenceComponent},
    ]
  },
    { path: 'register', component: RegisterComponent },
  { path: '**', redirectTo: 'login', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes,{useHash:true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
