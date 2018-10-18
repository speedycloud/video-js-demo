import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Http, Headers, RequestOptions, Response } from '@angular/http';

@Injectable()
export class RegisterService {

    constructor(private http: Http) { }

    //获取验证码
    get_v(data){
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        return this.http.post('https://speedyrtc.xdylive.cn/api/1.0/sms', data, <RequestOptions>{ headers: headers, withCredentials: true });
    }


    post_data(data){
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        return this.http.post('https://speedyrtc.xdylive.cn/api/1.0/signup', data, <RequestOptions>{ headers: headers, withCredentials: true });
    }


}
