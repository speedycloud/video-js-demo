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
const index_1 = require('../../_services/index');
const forms_1 = require('@angular/forms');
const index_2 = require('../../_defs/index');
let JoinRoomComponent = class JoinRoomComponent {
    constructor(router, roomService, alertService, fb) {
        this.router = router;
        this.roomService = roomService;
        this.alertService = alertService;
        this.room = {};
        this.selectedRoom = {};
        this.roomList = [];
        this.mixedMode = true;
        this.resolutions = [
            { name: "uhd_4k" },
            { name: "hd1080p" },
            { name: "hd720p" },
            { name: "r720x720" },
            { name: "xga" },
            { name: "svga" },
            { name: "vga" },
            { name: "sif" }
        ];
        this.complexForm = fb.group({
            'resolution': "vga",
            'mixing': true
        });
        this.complexForm.valueChanges.subscribe((form) => {
            console.log('form changed to:', form);
            this.localResolution = form.resolution;
            this.mixedMode = form.mixing;
        });
    }
    ngOnInit() {
        this.roomService.getAll()
            .subscribe((rooms) => {
            console.log("Rooms: " + JSON.stringify(rooms));
            this.roomList = rooms;
            localStorage.setItem(index_2.LocalStorageKeys.roomList, JSON.stringify(this.roomList));
        }, error => {
            this.alertService.error(error);
            if (error.status == 401) {
                console.log("Unauthorized request (probably session has expired), logging out and redirecting to login page");
                this.router.navigate(['/login'], { queryParams: { message: "Session has expired. Please login. " } });
            }
            else {
                this.alertService.error(error);
            }
        });
    }
    ngOnDestroy() { }
    joinRoom() {
        console.log('Joining room id: ' + this.room._id);
        var mixing = this.room.enableMixing ? this.mixedMode : false;
        this.router.navigate(['/room/conference'], { queryParams: { roomid: this.room._id, resolution: this.localResolution, mixing: mixing } });
    }
    onRoomSelectRow(listItem) {
        this.selectedRoom = listItem;
        this.room._id = this.selectedRoom._id;
        this.room.enableMixing = this.selectedRoom.room.enableMixing;
        console.log("selected room: ", JSON.stringify(this.selectedRoom));
    }
    onDelete(item) {
        console.log("Deleting room " + item._id + " (native id " + item.room._id + ")");
        this.roomService.delete(item._id)
            .subscribe(success => {
            console.log("Room delete success: " + success);
            var index = this.roomList.indexOf(item);
            this.roomList.splice(index, 1);
            this.selectedRoom = {};
            this.room = {};
            localStorage.setItem(index_2.LocalStorageKeys.roomList, JSON.stringify(this.roomList));
        }, error => {
            this.alertService.error(error);
        });
        return false;
    }
    isExpired(expiresAt) {
        var expDate = new Date(expiresAt);
        var now = new Date();
        return (expDate.getTime() < now.getTime());
    }
    toDate(expiresAt) {
        var expDate = new Date(expiresAt);
        //return expDate.toString();
        return expDate;
    }
};
JoinRoomComponent = __decorate([
    core_1.Component({
        moduleId: module.id,
        styleUrls: ['join.component.scss'],
        templateUrl: 'join.component.html'
    }), 
    __metadata('design:paramtypes', [router_1.Router, index_1.RoomService, index_1.AlertService, forms_1.FormBuilder])
], JoinRoomComponent);
exports.JoinRoomComponent = JoinRoomComponent;
//# sourceMappingURL=join.component.js.map