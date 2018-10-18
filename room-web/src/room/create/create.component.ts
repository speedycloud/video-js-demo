import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { overlayConfigFactory } from 'angular2-modal';
import { Modal, BSModalContext } from 'angular2-modal/plugins/bootstrap';
import { RoomSettings } from './settings/settings.component';
import { AlertService, RoomService } from '../../_services/index';
import { LocalStorageKeys } from  '../../_defs/index'

@Component({
    moduleId: module.id,
    templateUrl: 'create.component.html',
    providers: [Modal]
})

export class CreateRoomComponent implements OnInit {
    room: any = {};
    options: any = null;

    constructor(
        private router: Router,
        private roomService: RoomService,
        private alertService: AlertService,
        public modal: Modal) {  }

    ngOnInit() { 
        console.log(this.options);
        if (localStorage.getItem(LocalStorageKeys.roomOptions)) {
            this.options = JSON.parse(localStorage.getItem(LocalStorageKeys.roomOptions));            
        } 
        
        console.log("Stored room options: " + JSON.stringify(this.options));
    }

    createRoom() {
        console.log('Creating room: ' + this.room.name);
        
        this.roomService.create(this.room.name, this.options)
            .subscribe(
                room => {
                    console.log("Created room: " + JSON.stringify(room));
                    this.router.navigate(['/room/join']);
                },
                error => {
                    
                    console.log("createRoom error: " + JSON.stringify(error));                    

                    if (error.status == 401) {
                        console.log("Unauthorized request (probably session has expired), logging out and redirecting to login page");
                        this.router.navigate(['/login'],  { queryParams: { message: "Session has expired. Please login. "}});                          
                    }
                    else {
                        this.alertService.error(error);
                    }
                });           
    }  

    onSettings() {        	
        this.modal.open(RoomSettings, overlayConfigFactory({storedOptions: this.options}, BSModalContext))            
             .catch(err => alert("ERROR"))
             .then((dialog:any) => dialog.result)              
             .then((result) => {
                if (result) {
                    this.options = result;
                    console.log("Options: " + JSON.stringify(this.options));
                    localStorage.setItem(LocalStorageKeys.roomOptions, JSON.stringify(this.options));                      
                }
            });
    }

    onCancel() {
        this.router.navigate(['/room/join']);
        return false;
    }

}
