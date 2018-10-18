import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { User } from '../_models/index';
import { ENV } from '../_config/index';

@Injectable()
export class UserService {
    constructor(private http: Http) { }

    getAll() {
        let url = ENV.backend_url + '/users';
        console.log('get all users URL: ' + url);

        return this.http.get(url, <RequestOptions> {withCredentials: true})
        .map((response: Response) => response.json());
    }

     create(user: User) {
            console.log('Creating user: ' + JSON.stringify(user));
            let url = ENV.backend_url + '/users';
            console.log('create user URL: ' + url);

            return this.http.post(url, user, <RequestOptions> {withCredentials: true})
            .map((response: Response) => {
                console.log("Response: " + response);                
                let usr = response.json();
                if (usr) {
                    console.log("User registered");
                }
            });
     }

    delete(id: number) {
        console.log('Deleting user: ' + id);

        let url = ENV.backend_url  + '/users/' + id
        console.log('delete user URL: ' + url);

        return this.http.delete(url, <RequestOptions> {withCredentials: true})
            .map((response: Response) => {
                console.log("User deleted. Response: " + response);          
            })
            .catch(this.handleError);
    }

    private handleError (error: Response) {
        console.log("Error " + error);
        return Observable.throw(error || "Server Error");
    }
}