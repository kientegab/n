import { NgModule } from '@angular/core';
import { ExtraOptions, RouterModule, Routes } from '@angular/router';
import { AppLayoutComponent } from './layout/app.layout.component';
import { DashboardPublicComponent } from './public/dashboard-public.component';
import { AuthGuard } from './shared/guard/auth.guard';
import { Authority } from './shared/constants/authority.constants';
import { AccountComponent } from './public/account/account.component';
import { AuthorizedComponent } from './public/authorized/authorized.component';
import { LogoutComponent } from './public/logout/logout.component';

const routerOptions: ExtraOptions = {
    anchorScrolling: 'enabled'
};

const routes: Routes = [
    
    {
        path: '', component: DashboardPublicComponent,
        children: [
            { path: '', loadChildren: () => import('./public/home-page/home-page.module').then(m => m.HomePageModule) },
            { path: 'account', component: AccountComponent },
            { path: 'accueil', loadChildren: () => import('./public/home-page/home-page.module').then(m => m.HomePageModule) },
            // { path: 'auth/login', data: { breadcrumb: 'Auth' }, loadChildren: () => import('./account/login/login.module').then(m => m.LoginModule) },
            { path: 'public/N_detachement', data: { breadcrumb: 'nouvelle detachement' }, loadChildren: () => import('./public/detachement/nouvelle-detachement/nouvelle-detachement.module').then(m => m.NouvelleDetachementModule) },
            { path: 'public/R_detachement', data: { breadcrumb: 'renouvellement detachement' }, loadChildren: () => import('./public/detachement/renouvelle-detachement/renouvelle-detachement.module').then(m => m.RenouvelleDetachementModule) },
            { path: 'public/F_detachement', data: { breadcrumb: 'fin detachement' }, loadChildren: () => import('./public/detachement/fin-detachement/fin-detachement.module').then(m => m.FinDetachementModule) },
            { path: 'public/RE_detachement', data: { breadcrumb: 'rectification detachement' }, loadChildren: () => import('./public/detachement/rectification-detachement/rectification-detachement.module').then(m => m.RectificationDetachementModule) },
            { path: 'public/A_detachement', data: { breadcrumb: 'annulation detachement' }, loadChildren: () => import('./public/detachement/annulation-detachement/annulation-detachement.module').then(m => m.AnnulationDetachementModule) },
           // disponibilité
            { path: 'public/N_disponibilite', data: { breadcrumb: 'nouvelle disponibilite' }, loadChildren: () => import('./public/disponibilite/nouvelle-disponibilite/nouvelle-disponibilite.module').then(m => m.NouvelleDisponibiliteModule) },
            { path: 'public/R_disponibilite', data: { breadcrumb: 'renouvellement disponibilite' }, loadChildren: () => import('./public/disponibilite/renouvelle-disponibilite/renouvelle-disponibilite.module').then(m => m.RenouvelleDisponibiliteModule) },
            { path: 'public/F_disponibilite', data: { breadcrumb: 'fin disponibilite' }, loadChildren: () => import('./public/disponibilite/fin-disponibilite/fin-disponibilite.module').then(m => m.FinDisponibiliteModule) },
            { path: 'public/RE_disponibilite', data: { breadcrumb: 'rectification disponibilite' }, loadChildren: () => import('./public/disponibilite/rectification-disponibilite/rectification-disponibilite.module').then(m => m.RectificationDisponibiliteModule) },
            { path: 'public/A_disponibilite', data: { breadcrumb: 'annulation disponibilite' }, loadChildren: () => import('./public/disponibilite/annulation-disponibilite/annulation-disponibilite.module').then(m => m.AnnulationDisponibiliteModule) },
            { path: 'public/contact', data: { breadcrumb: 'contactez nous' }, loadChildren: () => import('./public/contactez-nous/contactez-nous.module').then(m => m.ContactezNousModule) },
            { path: 'authorized', component: AuthorizedComponent },
            { path: 'oauth2/logout', component: LogoutComponent },
           
        ]
    },

    {
       // path: 'admin', component: AppLayoutComponent, canActivate: [AuthGuard],
        path: 'admin', component: AppLayoutComponent, 
        // data: {
        // authorities: [Authority.USER,Authority.ADMIN,
        //     Authority.ADD_PROFILE,Authority.VIEW_PROFILE,Authority.DELETE_PROFILE,Authority.ADD_USER,
        //     Authority.VIEW_USER,Authority.ADD_ACTIVITE,Authority.EDIT_ACTIVITE,Authority.VIEW_ACTIVITE,
        //     Authority.DELETE_ACTIVITE,Authority.ADD_ARRONDISSEMENT,Authority.EDIT_ARRONDISSEMENT,
        //     Authority.VIEW_ARRONDISSEMENT,Authority.DELETE_ARRONDISSEMENT,Authority.ADD_ASSURE,
        //     Authority.EDIT_ASSURE,Authority.VIEW_ASSURE,Authority.DELETE_ASSURE,Authority.PRINT_RECEP_ASSURE,
        //     Authority.VALID_REJET_ASSURE,Authority.ADD_CARTE,Authority.EDIT_CARTE,
        //    Authority.VIEW_CARTE,Authority.DELETE_CARTE,Authority.GEN_CARTE,
        //    Authority.PRINT_CARTE,Authority.ADD_COMMUNE,Authority.VIEW_COMMUNE,
        //    Authority.EDIT_COMMUNE,Authority.DELETE_COMMUNE,Authority.ADD_DECLARATION,Authority.EDIT_DECLARATION,
        //    Authority.VIEW_DECLARATION,Authority.DELETE_DECLARATION,Authority.ADD_DIVISION,Authority.EDIT_DIVISION,
        //    Authority.VIEW_DIVISION,Authority.DELETE_DIVISION,Authority.ADD_EMPLOI,Authority.EDIT_EMPLOI,
        //    Authority.VIEW_EMPLOI,Authority.DELETE_EMPLOI,Authority.ADD_EMPLOYEUR,Authority.EDIT_EMPLOYEUR,
        //    Authority.VALID_REJET_EMPLOYEUR,Authority.VIEW_EMPLOYEUR,Authority.DELETE_EMPLOYEUR,Authority.PRINT_EMPLOYEUR,
        //    Authority.ADD_ES,Authority.EDIT_ES,Authority.VIEW_ES,Authority.DELETE_ES,
        //    Authority.ADD_FJ,Authority.EDIT_FJ,Authority.VIEW_FJ,Authority.DELETE_FJ,
        //    Authority.ADD_GROUPE,Authority.EDIT_GROUPE,Authority.VIEW_GROUPE,Authority.DELETE_GROUPE,
        //    Authority.ADD_PAYS,Authority.EDIT_PAYS,Authority.VIEW_PAYS,Authority.DELETE_PAYS,Authority.ADD_PHOTO,
        //    Authority.EDIT_PHOTO,Authority.VIEW_PHOTO,Authority.DELETE_PHOTO,Authority.ADD_PIECE,
        //    Authority.EDIT_PIECE,Authority.VIEW_PIECE,Authority.DELETE_PIECE,Authority.ADD_PROFESSION,
        //    Authority.EDIT_PROFESSION,Authority.VIEW_PROFESSION,Authority.DELETE_PROFESSION,
        //    Authority.ADD_PROVINCE,Authority.EDIT_PROVINCE,Authority.VIEW_PROVINCE,
        //    Authority.DELETE_PROVINCE,Authority.ADD_REGION,Authority.EDIT_REGION,Authority.DELETE_REGION,
        //    Authority.VIEW_REGION,Authority.VIEW_REPORT,Authority.ADD_SECT_VILL,
        //    Authority.EDIT_SECT_VILL,Authority.VIEW_SECT_VILL,Authority.DELETE_SECT_VILL,
        //    Authority.ADD_SECTION,Authority.EDIT_SECTION,Authority.VIEW_SECTION,
        //    Authority.DELETE_SECTION,Authority.ADD_SERVEUR,Authority.EDIT_SERVEUR,Authority.VIEW_SERVEUR,
        //    Authority.DELETE_SERVEUR,Authority.ADD_TFC,Authority.EDIT_TFC,Authority.VIEW_TFC,
        //    Authority.DELETE_TFC,Authority.ADD_TYPE_ASSURE,Authority.EDIT_TYPE_ASSURE,
        //    Authority.VIEW_TYPE_ASSURE,Authority.DELETE_TYPE_ASSURE,Authority.ADD_TYPE_EMPLOYEUR,
        //    Authority.EDIT_TYPE_EMPLOYEUR,Authority.VIEW_TYPE_EMPLOYEUR,Authority.DELETE_TYPE_EMPLOYEUR,
        //    Authority.ADD_TYPE_PIECE,Authority.EDIT_TYPE_PIECE,Authority.VIEW_TYPE_PIECE,
        //    Authority.DELETE_TYPE_PIECE,Authority.ADD_FINGER,Authority.EDIT_FINGER,Authority.VIEW_FINGER,
        //    Authority.ADD_BANQUE,Authority.EDIT_BANQUE,Authority.VIEW_BANQUE,Authority.DELETE_BANQUE,
        //    Authority.ADD_CAISSE,Authority.EDIT_CAISSE,Authority.VIEW_CAISSE,
        //    Authority.DELETE_CAISSE,Authority.ADD_TYPE_COTISATION,Authority.EDIT_TYPE_COTISATION,
        //    Authority.VIEW_TYPE_COTISATION,Authority.DELETE_TYPE_COTISATION,Authority.ADD_COTISATION,
        //    Authority.EDIT_COTISATION,Authority.VIEW_COTISATION,Authority.DELETE_COTISATION     
        // ],
        // },
        children: [
            { path: '', loadChildren: () => import('./administration/administration.module').then(m => m.AdministrationModule) },
        ]
    },
    { path: 'auth/login', data: { breadcrumb: 'Auth' }, loadChildren: () => import('./account/login/login.module').then(m => m.LoginModule) },
    { path: 'detachements', data: { breadcrumb: 'Gestion des détachements' }, component: AppLayoutComponent, loadChildren: () => import('./detachement/detachement.module').then(m => m.DetachementModule) },
    { path: 'disponibilites', data: { breadcrumb: 'Gestion des disponibilités' },component: AppLayoutComponent, loadChildren: () => import('./disponibilite/disponibilite.module').then(m => m.DisponibiliteModule) },
    { path: 'stat-demandes', data: { breadcrumb: 'Gestion des statistiques de demandes' },component: AppLayoutComponent, loadChildren: () => import('./statistique/demande/demande.module').then(m => m.DemandeModule) },
    { path: 'notfound', loadChildren: () => import('./shared/notfound/notfound.module').then(m => m.NotfoundModule) },
    
    { path: '**', redirectTo: '/notfound' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes, routerOptions)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
