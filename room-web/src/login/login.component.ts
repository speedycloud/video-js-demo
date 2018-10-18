import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { AlertService, LoginSessionService } from '../_services/index';
import { Location } from '@angular/common';

@Component({
    moduleId: module.id,
    templateUrl: 'login.component.html'
})

export class LoginComponent implements OnInit {
    model: any = {};
    loading = false;
    isShake = false;
     private subscription: Subscription;

    constructor(
        private router: Router,
        private loginSession: LoginSessionService,
        private alertService: AlertService,
        private activatedRoute: ActivatedRoute,
        private location: Location ) { }

    ngOnInit() {

        this.subscription = this.activatedRoute.queryParams.subscribe((param: any) => {
            let message = param['message'];
            if (message) {
                 this.alertService.error( message);
            }

            this.location.replaceState(''); // set URL shown in the address bar to the root 
        });
    }

    private logout() {
        this.loginSession.logout()
            .subscribe(
                data => {},
                error => {});           
    }

    login() {
        this.loading = true;
        this.loginSession.login(this.model.username, this.model.password)
            .subscribe(
                user => {
                    //console.log("Login user: " + JSON.stringify(user));

                    if (user && user.role == 'admin') {
                        this.router.navigate(['/admin']);
                    }
                    else {
                        this.router.navigate(['/join']);
                    }
                },
                error => {
                    this.alertService.error(error);
                    this.loading = false;
                    this.isShake = true;
                    setTimeout(()=>{this.isShake = false}, 2000);
                });
           
    }
}
