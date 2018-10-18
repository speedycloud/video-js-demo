import { Injectable } from '@angular/core';
import { Http } from "@angular/http";
import { Observable } from 'rxjs/Observable';
import { BaseService } from '../../services/base.service';

@Injectable()
export class CommonService {

    constructor(private http: Http, private $http: BaseService) { }

    // get_email() {
    //     return this.$http.$post('/customer/api/name', {});
    // }

}

