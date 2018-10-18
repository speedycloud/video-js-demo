import { Component, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd';
import { Router } from '@angular/router';
import { LoginService } from './login.service';
import { LoginSessionService } from '../../services/loginsession.service';
import { AlertService } from '../../services/alert.service'
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl
} from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [LoginService, NzMessageService]
})
export class LoginComponent implements OnInit {
  validateForm: FormGroup;
  token='';
  loading = false;
  isShake = false;
  constructor(private fb: FormBuilder,
              private $http: LoginService,
              private router: Router,
              private loginSession: LoginSessionService,
              private alertService: AlertService,
              private _message: NzMessageService) {
  }

  getFormControl(name) {
    return this.validateForm.controls[name];
  }

  // 验证邮箱
  emailValidator = (control: FormControl): { [s: string]: boolean } => {
    const EMAIL_REGEXP = /^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i;
    if (!control.value) {
      return { required: true }
    } else if (!EMAIL_REGEXP.test(control.value)) {
      //return { error: true, email: true };
      return { required: true }
    }
  };

  _submitForm() {
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
    }
    // console.log(this.validateForm.value)
    let $this = this;
    this.$http.login(this.validateForm.value).subscribe(res=>{
      // console.log(res)
      this.token = JSON.parse(res['_body']);
      localStorage.setItem('usertoken', this.token['user']['usertoken']);
      localStorage.setItem('username', this.token['user']['username']);
      this._message.create('success', '恭喜，登录成功！', { nzDuration: 800 });

      // console.log(this.token)
      setTimeout(function () {
        $this.router.navigate(['/room/join']);
      }, 800)
    },err=>{
      this._message.create('error', '用户名或密码输入有误', { nzDuration: 1500 });
    })
  }

  private logout() {
        this.loginSession.logout()
            .subscribe(
                data => {},
                error => {});           
    }

  login() {
      this.loading = true;
      this.loginSession.login(this.validateForm.value.email, this.validateForm.value.password)
          .subscribe(
              user => {
                  //console.log("Login user: " + JSON.stringify(user));

                  if (user && user.role == 'admin') {
                      this.router.navigate(['/admin']);
                  }
                  else {
                      this.router.navigate(['/room/join']);
                  }
              },
              error => {
                  this.alertService.error(error);
                  this.loading = false;
                  this.isShake = true;
                  setTimeout(()=>{this.isShake = false}, 2000);
              });
         
  }

  ngOnInit() {
    this.validateForm = this.fb.group({
      "email": [null, [this.emailValidator]],
      "password": [null, [Validators.required]]
    });
  }

}
