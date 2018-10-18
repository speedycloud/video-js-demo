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
const Observable_1 = require('rxjs/Observable');
const http_1 = require('@angular/http');
const index_1 = require('../_config/index');
let UserService = class UserService {
    constructor(http) {
        this.http = http;
    }
    getAll() {
        let url = index_1.ENV.backend_url + '/users';
        console.log('get all users URL: ' + url);
        return this.http.get(url, { withCredentials: true })
            .map((response) => response.json());
    }
    create(user) {
        console.log('Creating user: ' + JSON.stringify(user));
        let url = index_1.ENV.backend_url + '/users';
        console.log('create user URL: ' + url);
        return this.http.post(url, user, { withCredentials: true })
            .map((response) => {
            console.log("Response: " + response);
            let usr = response.json();
            if (usr) {
                console.log("User registered");
            }
        });
    }
    delete(id) {
        console.log('Deleting user: ' + id);
        let url = index_1.ENV.backend_url + '/users/' + id;
        console.log('delete user URL: ' + url);
        return this.http.delete(url, { withCredentials: true })
            .map((response) => {
            console.log("User deleted. Response: " + response);
        })
            .catch(this.handleError);
    }
    handleError(error) {
        console.log("Error " + error);
        return Observable_1.Observable.throw(error || "Server Error");
    }
};
UserService = __decorate([
    core_1.Injectable(), 
    __metadata('design:paramtypes', [http_1.Http])
], UserService);
exports.UserService = UserService;
//# sourceMappingURL=user.service.js.map