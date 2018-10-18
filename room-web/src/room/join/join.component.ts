import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, RouterState, Params } from '@angular/router';
import { AlertService, RoomService } from '../../_services/index';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LocalStorageKeys } from  '../../_defs/index'

@Component({
    moduleId: module.id,
    styleUrls: ['join.component.scss'],
    templateUrl: 'join.component.html'
})


export class JoinRoomComponent implements OnInit, OnDestroy {
      
    room: any = {};
    selectedRoom: any = {};
    roomList : Array<any> = [];
    complexForm : FormGroup;
    localResolution : string;
    mixedMode : boolean = true;

   resolutions = [
       {name: "uhd_4k"},
       {name: "hd1080p"},
       {name: "hd720p"},
       {name: "r720x720"},
       {name: "xga"},
       {name: "svga"},
       {name: "vga"},
       {name: "sif"}
     ];

    constructor(
        private router: Router,
        private roomService: RoomService,
        private alertService: AlertService,
        fb: FormBuilder) {

       this.complexForm = fb.group({
                'resolution' : "vga",
                'mixing':true
        });

        this.complexForm.valueChanges.subscribe( (form: any) => {       
            console.log('form changed to:', form);       
            this.localResolution = form.resolution;
            this.mixedMode = form.mixing;
        });
    }

    ngOnInit() { 
        this.roomService.getAll()
            .subscribe(
                (rooms:any) => {
                    console.log("Rooms: " + JSON.stringify(rooms));
                    this.roomList = rooms;
                    localStorage.setItem(LocalStorageKeys.roomList, JSON.stringify(this.roomList));
                },
                error => {
                    this.alertService.error(error);

                    if (error.status == 401) {
                        console.log("Unauthorized request (probably session has expired), logging out and redirecting to login page");
                        this.router.navigate(['/login'],  { queryParams: { message: "Session has expired. Please login. "}});                          
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
        this.router.navigate(['/room/conference'],  { queryParams: { roomid: this.room._id, resolution: this.localResolution, mixing: mixing}});               
    } 

    onRoomSelectRow(listItem: any) {
        this.selectedRoom = listItem;
        this.room._id = this.selectedRoom._id;
        this.room.enableMixing=this.selectedRoom.room.enableMixing;
        console.log("selected room: ", JSON.stringify(this.selectedRoom));
    }

    onDelete(item: any) {

        console.log("Deleting room " + item._id + " (native id " + item.room._id + ")");
        this.roomService.delete(item._id)
            .subscribe(
                success => {
                    console.log("Room delete success: " + success);
                    
                    var index = this.roomList.indexOf(item);
                    this.roomList.splice(index, 1);
                    this.selectedRoom = {};                      
                    this.room = {};
                    localStorage.setItem(LocalStorageKeys.roomList, JSON.stringify(this.roomList));
                },
                error => {
                    this.alertService.error(error);
                });    

        return false;
    }

    isExpired(expiresAt: string) {
        var expDate = new Date(expiresAt)
        var now = new Date();
        return (expDate.getTime() < now.getTime());
    }

    toDate(expiresAt: string) {
        var expDate = new Date(expiresAt)        
        //return expDate.toString();
        return expDate;
    }

}
