import { Injectable , EventEmitter} from '@angular/core';
import { Http, Headers, Response, RequestOptionsArgs } from '@angular/http';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { ENV, LocalStorageKeys } from './config.service'

function getDateOffsetInSeconds(sec: number) {
    var date = new Date();
    const offsetinMs = sec*1000;    
    date.setTime(date.getTime() + offsetinMs);
    return date;    
}

@Injectable()
export class LoginSessionService {

    private user:any = null;
    public userChanged:EventEmitter<any> = new EventEmitter();
    private expiresAt: Date;
    private token: string;

    constructor(private http: Http, private router: Router) { 
        this.user = JSON.parse(localStorage.getItem(LocalStorageKeys.currentUser));
        this.expiresAt = new Date(JSON.parse(localStorage.getItem(LocalStorageKeys.loginSessionExpiration)));
        this.token = localStorage.getItem(LocalStorageKeys.Token)

        this.userChanged.emit(this.user);                
    }

    login(username: string, password: string) {

        let decoded = username + ':' + password;
        let encoded = window.btoa(decoded);
        
        let headers = new Headers();
        headers.append('Authorization', 'Basic ' + encoded);

        let loginUrl = ENV.backend_url + '/login';
        console.log("Logging in: " + username + ", URL: " + loginUrl);

        return this.http.post(loginUrl, '', <RequestOptionsArgs> {headers: headers, withCredentials: true})
            .map((response: Response) => {
                                
                // login successful if there's a role in the response
                this.user = response.json().user;
                this.expiresAt = getDateOffsetInSeconds(response.json().expiresIn);
                this.token = response.json().token;

                if (this.expiresAt) {                    
                    localStorage.setItem(LocalStorageKeys.loginSessionExpiration, JSON.stringify(this.expiresAt));
                }                

                if (this.user && this.user.role) {                    
                    localStorage.setItem(LocalStorageKeys.currentUser, JSON.stringify(this.user));
                }

                if (this.token) {                    
                    localStorage.setItem(LocalStorageKeys.Token, JSON.stringify(this.token));
                }

                console.log("user " + this.user.username + " has been logged in, session expires at: " + this.expiresAt);

                this.userChanged.emit(this.user);
                return this.user;
            })
            .catch(this.handleError);
    }

    logout(msg?:string) {
        // make sure user is found in the local storage
        if (!localStorage.getItem(LocalStorageKeys.currentUser)) {            
            return Observable.empty();
        }

        console.log('Logging out: ' + this.user.username);                    

        this.user = null;
        this.expiresAt = null;
        localStorage.removeItem(LocalStorageKeys.currentUser);
        localStorage.removeItem(LocalStorageKeys.roomList);
        localStorage.removeItem(LocalStorageKeys.loginSessionExpiration);

        this.userChanged.emit(this.user);
        
        this.router.navigate(['/login'],  { queryParams: { message: msg}});

        let logoutUrl = ENV.backend_url + '/logout';

        return this.http.get(logoutUrl, <RequestOptionsArgs> {withCredentials: true})
            .map((response: Response) => {
                // remove user from local storage
                console.log("Logout success: " + response)                
            })
            .catch(this.handleError);
    }

    getUser():any {
        return this.user;
    }

    isActive(): boolean {
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

    private handleError (error: Response) {
        // in a real world app, we may send the server to some remote logging infrastructure
        // instead of just logging it to the console        
        localStorage.removeItem(LocalStorageKeys.currentUser);
        localStorage.removeItem(LocalStorageKeys.roomList);
        localStorage.removeItem(LocalStorageKeys.loginSessionExpiration);
        console.error("Error " + error + ". Login session has been cleared.");

        return Observable.throw(error || "Server Error");
    }

}