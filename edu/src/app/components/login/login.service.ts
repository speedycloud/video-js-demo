import { Injectable } from '@angular/core';
import { Http } from "@angular/http";
import { Observable } from 'rxjs/Observable';
import { BaseService } from '../../services/base.service';

@Injectable()
export class LoginService {

    constructor(private http: Http, private $http: BaseService) { }

    getInfo(): Observable<any> {
        return this.http.get('http://localhost:3000/api/cdnIndex');
    }

    login(params) {
        return this.$http.do_login('/api/1.0/login', params)
        // return this.http.post(this.BaseServerURL + '/overview', params, { headers: this.headers });
    }
}
