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
const loginsession_service_1 = require('./loginsession.service');
let RoomService = class RoomService {
    constructor(http, loginSession) {
        this.http = http;
        this.loginSession = loginSession;
    }
    getToken(id) {
        console.log('Requesting token for room: ' + id);
        if (!this.loginSession.isActive()) {
            this.loginSession.logout("Session has expired. Please login.");
            return Observable_1.Observable.empty();
        }
        let headers = new http_1.Headers();
        headers.append('Content-Type', 'application/json');
        let url = index_1.ENV.backend_url + '/rooms/' + id + '/token';
        console.log('getToken URL:' + url);
        return this.http.get(url, { headers: headers, withCredentials: true })
            .map((response) => {
            console.log("Get room token response: " + response);
            return response.json();
        })
            .catch(this.handleError);
    }
    create(name, options) {
        console.log('Creating room: ' + name);
        if (!this.loginSession.isActive()) {
            this.loginSession.logout("Session has expired. Please login.");
            return Observable_1.Observable.empty();
        }
        let headers = new http_1.Headers();
        headers.append('Content-Type', 'application/json');
        let room = {
            name: name,
            options: options
        };
        let url = index_1.ENV.backend_url + '/rooms/';
        console.log('createRoom URL:' + url);
        return this.http.post(url, JSON.stringify(room), { headers: headers, withCredentials: true })
            .map((response) => {
            console.log("Create room response: " + response);
            return response.json();
        })
            .catch(this.handleError);
    }
    getAll() {
        if (!this.loginSession.isActive()) {
            this.loginSession.logout("Session has expired. Please login.");
            return Observable_1.Observable.empty();
        }
        let headers = new http_1.Headers();
        headers.append('Content-Type', 'application/json');
        let url = index_1.ENV.backend_url + '/rooms/';
        return this.http.get(url, { headers: headers, withCredentials: true })
            .map((response) => {
            console.log("All rooms: " + response);
            return response.json();
        })
            .catch(this.handleError);
    }
    delete(roomId) {
        if (!this.loginSession.isActive()) {
            this.loginSession.logout("Session has expired. Please login.");
            return Observable_1.Observable.empty();
        }
        console.log('Deleting room ', roomId);
        let headers = new http_1.Headers();
        headers.append('Content-Type', 'application/json');
        let url = index_1.ENV.backend_url + '/rooms/' + roomId;
        return this.http.delete(url, { headers: headers, withCredentials: true })
            .map((response) => {
            return (true);
        })
            .catch(this.handleError);
    }
    requestRecordingUrl(roomId, recorderId) {
        /* send request for this recording's URL */
        let headers = new http_1.Headers();
        headers.append('Content-Type', 'application/json');
        let url = index_1.ENV.backend_url + '/recording/' + roomId + '/' + recorderId;
        console.log('recording URL request url:' + url);
        var body = {};
        return this.http.post(url, JSON.stringify(body), { headers: headers, withCredentials: true })
            .map((response) => {
            console.log("Request recording url room response: " + response);
            return response;
        })
            .catch(this.handleError);
    }
    handleError(error) {
        console.log("Room service error: " + error);
        return Observable_1.Observable.throw(error || "Server Error");
    }
};
RoomService = __decorate([
    core_1.Injectable(), 
    __metadata('design:paramtypes', [http_1.Http, loginsession_service_1.LoginSessionService])
], RoomService);
exports.RoomService = RoomService;
//# sourceMappingURL=room.service.js.map