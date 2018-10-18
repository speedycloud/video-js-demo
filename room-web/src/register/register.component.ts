import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AlertService, UserService } from '../_services/index';

@Component({
    moduleId: module.id,
    templateUrl: 'register.component.html'
})

export class RegisterComponent {
    model: any = {};
    loading = false;

    constructor(
        private router: Router,
        private userService: UserService,
        private alertService: AlertService) { }

    register() {
        this.loading = true;
    
        this.userService.create(this.model)
            .subscribe(
                data => {
                    this.alertService.success('Registration successful', true);
                    this.router.navigate(['/']);
                },
                error => {
                    
                    console.log("userService.create error: " + JSON.stringify(error));     

                    if (error.status == 401) {
                        console.log("Unauthorized request (probably session has expired), logging out and redirecting to login page");
                        this.router.navigate(['/login'],  { queryParams: { message: "Session has expired. Please login. "}});                          
                    }
                    else {
                        this.alertService.error(error);
                    }
                });

    }
}
