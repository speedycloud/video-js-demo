import { Injectable } from '@angular/core';
import { Http } from "@angular/http";
import { Observable } from 'rxjs/Observable';
import { BaseService } from '../../services/base.service';

@Injectable()
export class StatisticalService {

    constructor(private http: Http,private $http: BaseService) { }

    getInfo(): Observable<any> {
        return this.http.get('http://localhost:5000/table');
    }
    get_bill(data) {
        return this.$http.$post('/customer/api/bill', data);
    }
    isJumpLogin(error,_that){
        this.$http.isJumpLogin(error,_that)
    }
}
