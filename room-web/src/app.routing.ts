import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home/index';
import { LoginComponent } from './login/index';
import { RegisterComponent } from './register/index';
import { JoinRoomComponent, CreateRoomComponent, ConferenceComponent } from './room/index';
import { AdminComponent } from './admin/index';
import { AuthGuard } from './_guards/index';

const appRoutes: Routes = [
    { path: '', component: HomeComponent,             canActivate: [AuthGuard] },
    { path: 'login', component: LoginComponent,       canActivate: [AuthGuard]  },
    { path: 'register', component: RegisterComponent, canActivate: [AuthGuard]  },
    { path: 'room/join', component: JoinRoomComponent,    canActivate: [AuthGuard]  },    
    { path: 'room/create', component: CreateRoomComponent,canActivate: [AuthGuard]  },
    { path: 'room/conference', component: ConferenceComponent,canActivate: [AuthGuard]  },
    { path: 'admin', component: AdminComponent,       canActivate: [AuthGuard] },
    // otherwise redirect to home
    { path: '**', redirectTo: '' }
];

export const routing = RouterModule.forRoot(appRoutes, { useHash: true });