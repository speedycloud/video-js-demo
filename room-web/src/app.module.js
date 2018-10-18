"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
const core_1 = require('@angular/core');
const platform_browser_1 = require('@angular/platform-browser');
const http_1 = require('@angular/http');
// used to create fake backend
//import { fakeBackendProvider } from './_helpers/index';
//import { MockBackend, MockConnection } from '@angular/http/testing';
//import { BaseRequestOptions } from '@angular/http';
const app_component_1 = require('./app.component');
const app_routing_1 = require('./app.routing');
const index_1 = require('./_directives/index');
const index_2 = require('./_guards/index');
const index_3 = require('./_services/index');
const index_4 = require('./home/index');
const index_5 = require('./login/index');
const index_6 = require('./register/index');
const index_7 = require('./room/index');
const index_8 = require('./admin/index');
const angular2_modal_1 = require('angular2-modal');
const bootstrap_1 = require('angular2-modal/plugins/bootstrap');
const forms_1 = require('@angular/forms');
let AppModule = class AppModule {
};
AppModule = __decorate([
    core_1.NgModule({
        imports: [
            platform_browser_1.BrowserModule,
            http_1.HttpModule,
            app_routing_1.routing,
            angular2_modal_1.ModalModule.forRoot(),
            bootstrap_1.BootstrapModalModule,
            forms_1.FormsModule,
            forms_1.ReactiveFormsModule
        ],
        declarations: [
            app_component_1.AppComponent,
            index_1.AlertComponent,
            index_1.TopBarComponent,
            index_4.HomeComponent,
            index_5.LoginComponent,
            index_6.RegisterComponent,
            index_7.JoinRoomComponent,
            index_7.CreateRoomComponent,
            index_7.ConferenceComponent,
            index_8.AdminComponent,
            index_7.RoomSettings
        ],
        providers: [
            index_2.AuthGuard,
            index_3.AlertService,
            index_3.LoginSessionService,
            index_3.UserService,
            index_3.RoomService
        ],
        bootstrap: [app_component_1.AppComponent],
        // IMPORTANT: 
        // Since 'AdditionCalculateWindow' is never explicitly used (in a template)
        // we must tell angular about it.
        entryComponents: [index_7.RoomSettings]
    }), 
    __metadata('design:paramtypes', [])
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map