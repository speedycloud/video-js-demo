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
const index_1 = require('../_services/index');
let TopBarComponent = class TopBarComponent {
    constructor(loginSession) {
        this.loginSession = loginSession;
        this.username = null;
    }
    ngOnInit() {
        if (this.loginSession.isActive()) {
            this.username = this.loginSession.getUser().username;
        }
        this.loginSession.userChanged.subscribe((user) => {
            if (user) {
                this.username = user.username;
            }
            else {
                this.username = null;
            }
            // console.log("Username: " + this.username); 
        });
    }
    onLogout() {
        this.loginSession.logout();
    }
};
TopBarComponent = __decorate([
    core_1.Component({
        moduleId: module.id,
        selector: 'top-bar',
        template: '<div *ngIf="username" class="topbox" align="right"><b> {{username}} </b><input type="button"  (click)="onLogout()" value="Logout"></div><br><br>'
    }), 
    __metadata('design:paramtypes', [index_1.LoginSessionService])
], TopBarComponent);
exports.TopBarComponent = TopBarComponent;
//# sourceMappingURL=top_bar.component.js.map