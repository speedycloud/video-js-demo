import { Component, OnInit } from '@angular/core';
import { RegisterService } from "./register.service";
import { NzMessageService } from 'ng-zorro-antd';
import { Router } from '@angular/router';

import {
    FormBuilder,
    FormGroup,
    FormControl,
    Validators
} from '@angular/forms';
import { Observable } from 'rxjs/Observable';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.css'],
    providers : [RegisterService ],
})
export class RegisterComponent implements OnInit {
    phoneNumberPrefix:any;
    phoneNumber_m:any;
    validateForm: FormGroup;
    sms:any;
    submitForm = ($event, value) => {
        $event.preventDefault();
        for (const key in this.validateForm.controls) {
            this.validateForm.controls[key].markAsDirty();
        }
        console.log(value);
        this.register.post_data(value).subscribe(data=>{
            console.log(data);
            this.router.navigate(['/login']);
        },err=>{
          this._message.create('error', '注册失败', { nzDuration: 1500 });
        })
    };

    resetForm($event: MouseEvent) {
        $event.preventDefault();
        this.validateForm.reset();
        for (const key in this.validateForm.controls) {
            this.validateForm.controls[key].markAsPristine();
        }
    }

    validateConfirmPassword() {
        setTimeout(_ => {
            this.validateForm.controls['passwordConfirmation'].updateValueAndValidity();
        })
    }
    userNameAsyncValidator = (control: FormControl): any => {
        return Observable.create(function (observer) {
            setTimeout(() => {
                if (control.value === 'JasonWood') {
                    observer.next({ error: true, duplicated: true });
                } else {
                    observer.next(null);
                }
                observer.complete();
            }, 1000);
        });
    };

    getFormControl(name) {
        return this.validateForm.controls[name];
    }

    emailValidator = (control: FormControl): { [s: string]: boolean } => {

        const EMAIL_REGEXP = /^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i;
        if (!control.value) {

            return { required: true }
        } else if (!EMAIL_REGEXP.test(control.value)) {
            return { error: true, email: true };
        }
    };
    passwordConfirmationValidator = (control: FormControl): { [s: string]: boolean } => {

        if (!control.value) {

            return { required: true };
        } else if (control.value !== this.validateForm.controls['password'].value) {
            return { confirm: true, error: true };
        }
    };
    birthDayValidator = (control: FormControl): any => {
        if (new Date(control.value) > new Date()) {
            return { expired: true, error: true }
        }
    };

    smsValidator = (control: FormControl): { [s: string]: boolean } => {      
        if (!control.value) {
            return { required: true };
        } 
        if (!(control.value && control.value.length == 6)) {
            return { confirm: true, error: true };
        }
    }
    phoneValidator = (control: FormControl): { [s: string]: boolean } =>{

        if (control.value){
            console.log(control.value && control.value.length == 11);
        }
        if (!control.value) {

            return { required: true };
        } 
        if (!(control.value && control.value.length == 11)) {

            return { confirm: true, error: true };
        }
    }

    constructor(private fb: FormBuilder , private register:RegisterService, private _message: NzMessageService, private router: Router,) {
        this.validateForm = this.fb.group({
            name: ['', [Validators.required], [this.userNameAsyncValidator]],
            email: ['', [this.emailValidator]],
            // birthDay: ['', [this.birthDayValidator]],
            password: ['', [Validators.required]],
            passwordConfirmation: ['', [this.passwordConfirmationValidator]],
            phone:['',[this.phoneValidator] ],
            // phoneNumberPrefix:['',[]],
            sms: ['', [this.smsValidator]]
            // comment: ['', [Validators.required]]
        });
    }



    ngOnInit() {
    }


    post_v(){
        if(!this.phoneNumber_m){
            return;
        }
        console.log(this.phoneNumber_m);
        this.register.get_v({ phone: this.phoneNumber_m}).subscribe(data=>{
            console.log(data);
        })
    }

}
