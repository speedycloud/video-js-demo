"use strict";
const router_1 = require('@angular/router');
const index_1 = require('./home/index');
const index_2 = require('./login/index');
const index_3 = require('./register/index');
const index_4 = require('./room/index');
const index_5 = require('./admin/index');
const index_6 = require('./_guards/index');
const appRoutes = [
    { path: '', component: index_1.HomeComponent, canActivate: [index_6.AuthGuard] },
    { path: 'login', component: index_2.LoginComponent, canActivate: [index_6.AuthGuard] },
    { path: 'register', component: index_3.RegisterComponent, canActivate: [index_6.AuthGuard] },
    { path: 'room/join', component: index_4.JoinRoomComponent, canActivate: [index_6.AuthGuard] },
    { path: 'room/create', component: index_4.CreateRoomComponent, canActivate: [index_6.AuthGuard] },
    { path: 'room/conference', component: index_4.ConferenceComponent, canActivate: [index_6.AuthGuard] },
    { path: 'admin', component: index_5.AdminComponent, canActivate: [index_6.AuthGuard] },
    // otherwise redirect to home
    { path: '**', redirectTo: '' }
];
exports.routing = router_1.RouterModule.forRoot(appRoutes, { useHash: true });
//# sourceMappingURL=app.routing.js.map