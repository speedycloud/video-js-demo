import {Component, OnInit } from '@angular/core';
import {LoginSessionService} from '../_services/index';

@Component({
    moduleId: module.id,
    selector: 'top-bar',
    template: '<div *ngIf="username" class="topbox" align="right"><b> {{username}} </b><input type="button"  (click)="onLogout()" value="Logout"></div><br><br>'
})

export class TopBarComponent  implements OnInit {
    public username: string = null; 

    constructor(private loginSession:LoginSessionService) { 
     }

    ngOnInit() {        

        if (this.loginSession.isActive()){
            this.username = this.loginSession.getUser().username;
        }
        this.loginSession.userChanged.subscribe ( (user:any) => {
            if (user) {
                this.username = user.username;
            } else {
                this.username = null;
            }
            // console.log("Username: " + this.username); 
        });
    }

    onLogout() {
        this.loginSession.logout();
    }
}   