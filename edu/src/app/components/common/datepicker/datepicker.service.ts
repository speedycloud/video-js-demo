import { Injectable } from '@angular/core';
import { Http } from "@angular/http";
import { Observable } from 'rxjs/Observable';
import { BaseService } from '../../../services/base.service';

@Injectable()
export class DatepickerService {

    constructor(private http: Http, private $http: BaseService) { }

    get_customer() {
        return this.$http.$post('/customer/apps', {});
    }
}
