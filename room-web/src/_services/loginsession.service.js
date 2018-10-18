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
const http_1 = require('@angular/http');
const router_1 = require('@angular/router');
const Rx_1 = require('rxjs/Rx');
require('rxjs/add/operator/map');
require('rxjs/add/operator/catch');
const index_1 = require('../_config/index');
const index_2 = require('../_defs/index');
function getDateOffsetInSeconds(sec) {
    var date = new Date();
    const offsetinMs = sec * 1000;
    date.setTime(date.getTime() + offsetinMs);
    return date;
}
let LoginSessionService = class LoginSessionService {
    constructor(http, router) {
        this.http = http;
        this.router = router;
        this.user = null;
        this.userChanged = new core_1.EventEmitter();
        this.user = JSON.parse(localStorage.getItem(index_2.LocalStorageKeys.currentUser));
        this.expiresAt = new Date(JSON.parse(localStorage.getItem(index_2.LocalStorageKeys.loginSessionExpiration)));
        this.userChanged.emit(this.user);
    }
    login(username, password) {
        let decoded = username + ':' + password;
        let encoded = window.btoa(decoded);
        let headers = new http_1.Headers();
        headers.append('Authorization', 'Basic ' + encoded);
        let loginUrl = index_1.ENV.backend_url + '/login';
        console.log("Logging in: " + username + ", URL: " + loginUrl);
        return this.http.post(loginUrl, '', { headers: headers, withCredentials: true })
            .map((response) => {
            // login successful if there's a role in the response
            this.user = response.json().user;
            this.expiresAt = getDateOffsetInSeconds(response.json().expiresIn);
            if (this.expiresAt) {
                localStorage.setItem(index_2.LocalStorageKeys.loginSessionExpiration, JSON.stringify(this.expiresAt));
            }
            if (this.user && this.user.role) {
                localStorage.setItem(index_2.LocalStorageKeys.currentUser, JSON.stringify(this.user));
            }
            console.log("user " + this.user.username + " has been logged in, session expires at: " + this.expiresAt);
            this.userChanged.emit(this.user);
            return this.user;
        })
            .catch(this.handleError);
    }
    logout(msg) {
        // make sure user is found in the local storage
        if (!localStorage.getItem(index_2.LocalStorageKeys.currentUser)) {
            return Rx_1.Observable.empty();
        }
        console.log('Logging out: ' + this.user.username);
        this.user = null;
        this.expiresAt = null;
        localStorage.removeItem(index_2.LocalStorageKeys.currentUser);
        localStorage.removeItem(index_2.LocalStorageKeys.roomList);
        localStorage.removeItem(index_2.LocalStorageKeys.loginSessionExpiration);
        this.userChanged.emit(this.user);
        this.router.navigate(['/login'], { queryParams: { message: msg } });
        let logoutUrl = index_1.ENV.backend_url + '/logout';
        return this.http.get(logoutUrl, { withCredentials: true })
            .map((response) => {
            // remove user from local storage
            console.log("Logout success: " + response);
        })
            .catch(this.handleError);
    }
    getUser() {
        return this.user;
    }
    isActive() {
        if (!this.user) {
            //console.log("Login session is inactive: no user");
            return false;
        }
        if (!this.expiresAt) {
            console.warn("Session expiration is not set");
        }
        else if (this.expiresAt && this.expiresAt.getTime() <= Date.now()) {
            console.debug("Login session has expired at " + this.expiresAt);
            return false;
        }
        return true;
    }
    handleError(error) {
        // in a real world app, we may send the server to some remote logging infrastructure
        // instead of just logging it to the console        
        localStorage.removeItem(index_2.LocalStorageKeys.currentUser);
        localStorage.removeItem(index_2.LocalStorageKeys.roomList);
        localStorage.removeItem(index_2.LocalStorageKeys.loginSessionExpiration);
        console.error("Error " + error + ". Login session has been cleared.");
        return Rx_1.Observable.throw(error || "Server Error");
    }
};
LoginSessionService = __decorate([
    core_1.Injectable(), 
    __metadata('design:paramtypes', [http_1.Http, router_1.Router])
], LoginSessionService);
exports.LoginSessionService = LoginSessionService;
//# sourceMappingURL=loginsession.service.js.map