import { Injectable } from '@angular/core';
import { Http, Jsonp,Headers, RequestOptions } from "@angular/http";
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd';
@Injectable()
export class BaseService {

  private
  constructor(private http: Http,private router: Router,private _message: NzMessageService) { }
  BaseServerURL = "https://speedyrtc.xdylive.cn";
  loginURL = "https://speedyrtc.xdylive.cn";

  to_querystring(data) {
    let ret = [];
    for (var k in data) {
      let v = data[k];
      ret.push(k + "=" + v);
    }
    return ret.join("&");
  }

  url(path) {
    return path;
  }
  url_token(path, params) {
    let token = localStorage.getItem('token');
    params['token'] = token;
    return this.url(path + '?' + this.to_querystring(params));
  }

  get (path) {
      // const config = {headers: {'Access-Control-Allow-Origin': 'application/x-www-form-urlencoded'}};
      return this.http.get(this.url(path));
  }

  get_token(path, params) {
    // let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8' })
    return this.http.get(this.url_token(path, params), { withCredentials: true })
      // let token = localStorage.getItem('token');
      // if(token){
      //   let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8' })
      //   return this.http.get(this.url_token(path, params), { headers: headers , withCredentials: true })
      // }else{
      //   this.router.navigate(['/login']);
      // }

  }

  post_url_token(path) {
    let token = localStorage.getItem('token');
    return this.url(this.BaseServerURL + path + '?token=' + token);
  }

  $post(path, data) {
    let token = localStorage.getItem('token');
    let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8' })
    let params = Object.assign({}, { "token": token},data)
    return this.http.post(this.BaseServerURL + path, params, { headers: headers })
    // let token = localStorage.getItem('token');
    // let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8' });
    // return this.http.post(this.url(path),data);
    // if(token){
    //   let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8' });
    //   return this.http.post(this.url(path), JSON.stringify(data), { headers: headers, withCredentials: true });
    // }else{
    //   this.router.navigate(['/login']);
    // }

  }

  do_login(path,data) {
    console.log(path)
    console.log(data)
    let decoded = data["email"] + ':' + data["password"];
    let encoded = window.btoa(decoded);
    let headers = new Headers();
    headers.append('Authorization', 'Basic ' + encoded);
    headers.append('Content-Type', 'application/json');
    let options = new RequestOptions({ headers: headers, withCredentials: true });
    return this.http.post(this.BaseServerURL + path, {}, options);
  }

  domains(){
    return this.http.get(this.BaseServerURL + this.url('/domain'))
  }

  isJumpLogin(error, _that) {
    if (error.status === 403) {
      localStorage.removeItem('token');
      this.router.navigate(['/login']);
    }
  }

}
