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
const router_1 = require('@angular/router');
const angular2_modal_1 = require('angular2-modal');
const bootstrap_1 = require('angular2-modal/plugins/bootstrap');
const settings_component_1 = require('./settings/settings.component');
const index_1 = require('../../_services/index');
const index_2 = require('../../_defs/index');
let CreateRoomComponent = class CreateRoomComponent {
    constructor(router, roomService, alertService, modal) {
        this.router = router;
        this.roomService = roomService;
        this.alertService = alertService;
        this.modal = modal;
        this.room = {};
        this.options = null;
    }
    ngOnInit() {
        if (localStorage.getItem(index_2.LocalStorageKeys.roomOptions)) {
            this.options = JSON.parse(localStorage.getItem(index_2.LocalStorageKeys.roomOptions));
        }
        console.log("Stored room options: " + JSON.stringify(this.options));
    }
    createRoom() {
        console.log('Creating room: ' + this.room.name);
        this.roomService.create(this.room.name, this.options)
            .subscribe(room => {
            console.log("Created room: " + JSON.stringify(room));
            this.router.navigate(['/room/join']);
        }, error => {
            console.log("createRoom error: " + JSON.stringify(error));
            if (error.status == 401) {
                console.log("Unauthorized request (probably session has expired), logging out and redirecting to login page");
                this.router.navigate(['/login'], { queryParams: { message: "Session has expired. Please login. " } });
            }
            else {
                this.alertService.error(error);
            }
        });
    }
    onSettings() {
        this.modal.open(settings_component_1.RoomSettings, angular2_modal_1.overlayConfigFactory({ storedOptions: this.options }, bootstrap_1.BSModalContext))
            .catch(err => alert("ERROR"))
            .then((dialog) => dialog.result)
            .then((result) => {
            if (result) {
                this.options = result;
                console.log("Options: " + JSON.stringify(this.options));
                localStorage.setItem(index_2.LocalStorageKeys.roomOptions, JSON.stringify(this.options));
            }
        });
    }
    onCancel() {
        this.router.navigate(['/room/join']);
        return false;
    }
};
CreateRoomComponent = __decorate([
    core_1.Component({
        moduleId: module.id,
        templateUrl: 'create.component.html',
        providers: [bootstrap_1.Modal]
    }), 
    __metadata('design:paramtypes', [router_1.Router, index_1.RoomService, index_1.AlertService, bootstrap_1.Modal])
], CreateRoomComponent);
exports.CreateRoomComponent = CreateRoomComponent;
//# sourceMappingURL=create.component.js.map