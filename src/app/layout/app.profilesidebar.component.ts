import { Component } from '@angular/core';
import { LayoutService } from './service/app.layout.service';
import { AuthenticationService } from '../shared/service/auth.service';
import { Router } from '@angular/router';
import { IUser, User } from '../shared/model/user';

@Component({
    selector: 'app-profilemenu',
    templateUrl: './app.profilesidebar.component.html'
})
export class AppProfileSidebarComponent {

    user: IUser = new User();
    constructor(
        public layoutService: LayoutService,
        private router: Router,
        private authService: AuthenticationService
        ) {
            // this.findUser();
         }

    get visible(): boolean {
        return this.layoutService.state.profileSidebarVisible;
    }

    set visible(_val: boolean) {
        this.layoutService.state.profileSidebarVisible = _val;
    }

    findUser():void {
        this.authService.findInfosUser().subscribe(
            {
                next: (response) => {
                    if(response){
                        this.user = response.body!;
                    }
                },
            });
    }

    logout(): void {
        this.router.navigate(['/']);
        this.authService.logout();

    }

    infos(): void {
        this.router.navigate(['/admin/account/infos-user']);
    }
}