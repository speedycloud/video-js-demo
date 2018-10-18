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
const index_1 = require('../_services/index');
const router_1 = require('@angular/router');
let AdminComponent = class AdminComponent {
    constructor(userService, router) {
        this.userService = userService;
        this.router = router;
        this.users = [];
    }
    ngOnInit() {
        this.loadAllUsers();
    }
    deleteUser(id) {
        this.userService.delete(id).subscribe(() => { this.loadAllUsers(); });
    }
    loadAllUsers() {
        this.userService.getAll().subscribe(users => { this.users = users; });
    }
};
AdminComponent = __decorate([
    core_1.Component({
        moduleId: module.id,
        templateUrl: 'admin.component.html'
    }), 
    __metadata('design:paramtypes', [index_1.UserService, router_1.Router])
], AdminComponent);
exports.AdminComponent = AdminComponent;
//# sourceMappingURL=admin.component.js.map