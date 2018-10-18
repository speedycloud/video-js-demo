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
const index_1 = require('../_services/index');
let AuthGuard = class AuthGuard {
    constructor(router, loginSession) {
        this.router = router;
        this.loginSession = loginSession;
    }
    canActivate(route, state) {
        let user = this.loginSession.getUser();
        var isAdmin = false;
        if (user) {
            isAdmin = (user.role === 'admin');
        }
        const url = route.url.map(s => s.toString()).join('/');
        console.log('route %s', url);
        if (url != 'login' && url != '') {
            if (!this.loginSession.isActive()) {
                this.loginSession.logout("Session has expired. Please login.");
                return false;
            }
        }
        switch (url) {
            case '':
                if (!user) {
                    this.router.navigate(['/login']);
                }
                else if (isAdmin) {
                    this.router.navigate(['/admin']);
                }
                else {
                    this.router.navigate(['/room/join']);
                }
                return false;
            case 'login':
                if (this.loginSession.isActive()) {
                    this.router.navigate(['/room/join']);
                    return false;
                }
                this.loginSession.logout();
                return true;
            case 'admin':
                if (!isAdmin) {
                    this.router.navigate(['/']);
                }
                return isAdmin;
            case 'room/join':
            case 'room/create':
            case 'room/conference':
                if (!user || isAdmin) {
                    this.router.navigate(['/']);
                    return false;
                }
                return true;
            case 'register':
                if (!user || !isAdmin) {
                    this.router.navigate(['/']);
                    return false;
                }
                return true;
            default:
                this.router.navigate(['/']);
                break;
        }
        return false;
    }
};
AuthGuard = __decorate([
    core_1.Injectable(), 
    __metadata('design:paramtypes', [router_1.Router, index_1.LoginSessionService])
], AuthGuard);
exports.AuthGuard = AuthGuard;
//# sourceMappingURL=auth.guard.js.map