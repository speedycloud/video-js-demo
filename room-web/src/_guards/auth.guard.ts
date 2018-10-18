import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { LoginSessionService } from '../_services/index'

@Injectable()
export class AuthGuard implements CanActivate {
    
    constructor(private router: Router , private loginSession:LoginSessionService ) { 
        
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {

        let user = this.loginSession.getUser();
        var isAdmin = false;

        if (user) {
            isAdmin = (user.role === 'admin');
        }  

        const url = route.url.map(s => s.toString()).join('/');
        console.log('route %s' , url);

        if (url != 'login' && url != '') {
            if (!this.loginSession.isActive()) {
                this.loginSession.logout( "Session has expired. Please login.");
                return false;
            }
        }

        switch (url)
        {
            case '':
                if (!user) {
                    this.router.navigate(['/login']);
                } else if (isAdmin) {
                    this.router.navigate(['/admin']);
                } else {
                    this.router.navigate(['/room/join']);
                }                
                return false;

            case 'login': 
                if (this.loginSession.isActive()) {
                    this.router.navigate(['/room/join']);
                    return false;
                }

                this.loginSession.logout();
                return true; 
                
            case 'admin':
                if (!isAdmin) {
                    this.router.navigate(['/']);
                }
                return isAdmin;

            case 'room/join':
            case 'room/create':
            case 'room/conference':
                if (!user || isAdmin) {
                    this.router.navigate(['/']);
                    return false;
                }
                return true;

            case 'register':
                if (!user || !isAdmin) {
                    this.router.navigate(['/']);
                    return false;
                }
                return true;                

            default: 
                this.router.navigate(['/']);
                break; 
        }

        return false;
    }    
}