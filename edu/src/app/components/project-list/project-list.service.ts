import { Injectable } from '@angular/core';
import { Http } from "@angular/http";
import { Observable } from 'rxjs/Observable';
import { BaseService } from '../../services/base.service';

@Injectable()
export class ProjectLitService {

    constructor(private http: Http,private $http: BaseService) { }

    domains() {
        return this.$http.get_token('/domain', {});
    }
    get_list() {
        return this.$http.$post('/customer/app/details',{});
    }
    post_name(params) {
        return this.$http.$post('/customer/application/create', params);
    }
    delete_project(params) {
        return this.$http.$post('/customer/application/delete', params);
    }
    update_project(params) {
        return this.$http.$post('/customer/application/update', params);
    }
    isJumpLogin(error,_that){
        this.$http.isJumpLogin(error,_that)
    }
}
