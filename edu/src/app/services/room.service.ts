import { Component } from '@angular/core';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { User, ENV } from './config.service';
import { LoginSessionService } from './loginsession.service';

@Injectable()
export class RoomService {
    

    constructor(private http: Http, private loginSession:LoginSessionService) {  
    }

    getToken(id: string) {
        
        console.log('Requesting token for room: ' + id);        

        // if (!this.loginSession.isActive()) {
        //     this.loginSession.logout( "Session has expired. Please login.");
        //     return Observable.empty();    
        // }

        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        let usertoken = localStorage.getItem('usertoken');

        let url = ENV.backend_url + '/rooms/' + id + '/token?usertoken='+usertoken;
        console.log('getToken URL:' + url);

        return this.http.get(url, <RequestOptions> {headers: headers,  withCredentials: true})        
            .map((response: Response) => {
                console.log("Get room token response: " + response);
                return response.json();              
            })
            .catch(this.handleError);
    }

    create(name: string, options: any) {
        console.log('Creating room: ' + name);
        
        // if (!this.loginSession.isActive()) {
        //     this.loginSession.logout( "Session has expired. Please login.");
        //     return Observable.empty();    
        // }

        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        let token = localStorage.getItem('token');

        let room = {
            name: name,
            options: options
        };

        let usertoken = localStorage.getItem('usertoken');
        let url = ENV.backend_url + '/rooms?usertoken='+usertoken;

        console.log('createRoom URL:' + url);

        return this.http.post(url, JSON.stringify(room), <RequestOptions> {headers: headers, withCredentials: true})        
            .map((response: Response) => {
                console.log("Create room response: " + response);
                return response.json();              
            })
            .catch(this.handleError);
    }


    getAll() {                
        console.log(this.loginSession.isActive()); 
        // if (this.loginSession.isActive()) {
        //     this.loginSession.logout( "Session has expired. Please login.");
        //     return Observable.empty();    
        // }

        let headers = new Headers();
        headers.append('Content-Type', 'application/json');

        let usertoken = localStorage.getItem('usertoken');
        let url = ENV.backend_url + '/rooms?usertoken='+usertoken;

        return this.http.get(url, <RequestOptions> {headers: headers, withCredentials: true})        
            .map((response: Response) => {
                console.log("All rooms: " + response);
                return response.json();              
            })
            .catch(this.handleError);
    }

    delete(roomId : string) {                
    
        // if (!this.loginSession.isActive()) {
        //     this.loginSession.logout( "Session has expired. Please login.");
        //     return Observable.empty();    
        // }

        console.log('Deleting room ', roomId);
        let headers = new Headers();
        let usertoken = localStorage.getItem('usertoken');
        headers.append('Content-Type', 'application/json');
    
        let url = ENV.backend_url + '/delete?usertoken=' + usertoken + "&roomid=" + roomId;
        return this.http.get(url, <RequestOptions> {headers: headers, withCredentials: true})        
            .map((response: Response) => {
                return(true);              
            })
            .catch(this.handleError);
    }

    requestRecordingUrl(roomId: string, recorderId: string) {

        /* send request for this recording's URL */
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        let usertoken = localStorage.getItem('usertoken');
        let url = ENV.backend_url + '/recording/' + roomId + '/' + recorderId+'?usertoken='+usertoken;
        console.log('recording URL request url:' + url);

        var body = {};

        return this.http.post(url, JSON.stringify(body), <RequestOptions> {headers: headers, withCredentials: true})        
            .map((response: Response) => {
                console.log("Request recording url room response: " + response);
                return response;              
            })
            .catch(this.handleError);
    }

    private handleError (error: Response) {
        console.log("Room service error: " + error);
        return Observable.throw(error || "Server Error");    
    }
}