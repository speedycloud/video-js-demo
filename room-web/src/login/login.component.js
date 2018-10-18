"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
const core_1 = require('@angular/core');
const router_1 = require('@angular/router');
const index_1 = require('../_services/index');
const common_1 = require('@angular/common');
let LoginComponent = class LoginComponent {
    constructor(router, loginSession, alertService, activatedRoute, location) {
        this.router = router;
        this.loginSession = loginSession;
        this.alertService = alertService;
        this.activatedRoute = activatedRoute;
        this.location = location;
        this.model = {};
        this.loading = false;
        this.isShake = false;
    }
    ngOnInit() {
        this.subscription = this.activatedRoute.queryParams.subscribe((param) => {
            let message = param['message'];
            if (message) {
                this.alertService.error(message);
            }
            this.location.replaceState(''); // set URL shown in the address bar to the root 
        });
    }
    logout() {
        this.loginSession.logout()
            .subscribe(data => { }, error => { });
    }
    login() {
        this.loading = true;
        this.loginSession.login(this.model.username, this.model.password)
            .subscribe(user => {
            //console.log("Login user: " + JSON.stringify(user));
            if (user && user.role == 'admin') {
                this.router.navigate(['/admin']);
            }
            else {
                this.router.navigate(['/join']);
            }
        }, error => {
            this.alertService.error(error);
            this.loading = false;
            this.isShake = true;
            setTimeout(() => { this.isShake = false; }, 2000);
        });
    }
};
LoginComponent = __decorate([
    core_1.Component({
        moduleId: module.id,
        templateUrl: 'login.component.html'
    }), 
    __metadata('design:paramtypes', [router_1.Router, index_1.LoginSessionService, index_1.AlertService, router_1.ActivatedRoute, common_1.Location])
], LoginComponent);
exports.LoginComponent = LoginComponent;
//# sourceMappingURL=login.component.js.map