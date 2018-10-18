import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';

// used to create fake backend
//import { fakeBackendProvider } from './_helpers/index';
//import { MockBackend, MockConnection } from '@angular/http/testing';
//import { BaseRequestOptions } from '@angular/http';

import { AppComponent }  from './app.component';
import { routing }        from './app.routing';

import { AlertComponent , TopBarComponent } from './_directives/index';
import { AuthGuard } from './_guards/index';
import { AlertService, LoginSessionService, UserService, RoomService } from './_services/index';
import { HomeComponent } from './home/index';
import { LoginComponent } from './login/index';
import { RegisterComponent } from './register/index';
import { JoinRoomComponent, CreateRoomComponent, ConferenceComponent, RoomSettings } from './room/index';
import { AdminComponent } from './admin/index';

import { ModalModule } from 'angular2-modal';
import { BootstrapModalModule } from 'angular2-modal/plugins/bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
    imports: [
        BrowserModule,
        HttpModule,
        routing,
        ModalModule.forRoot(),
        BootstrapModalModule,
        FormsModule,
        ReactiveFormsModule
    ],
    declarations: [
        AppComponent,
        AlertComponent,
        TopBarComponent,
        HomeComponent,
        LoginComponent,
        RegisterComponent,
        JoinRoomComponent,
        CreateRoomComponent,
        ConferenceComponent,
        AdminComponent,
        RoomSettings
    ],
    providers: [
        AuthGuard,        
        AlertService,
        LoginSessionService,
        UserService,
        RoomService

        // providers used to create fake backend
        //fakeBackendProvider,
        //MockBackend,
        //BaseRequestOptions
    ],
    bootstrap: [AppComponent],
    // IMPORTANT: 
    // Since 'AdditionCalculateWindow' is never explicitly used (in a template)
    // we must tell angular about it.
    entryComponents: [ RoomSettings ]
})

export class AppModule { }