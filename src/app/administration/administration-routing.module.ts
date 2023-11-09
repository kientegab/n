import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardAdministrationComponent } from './dashboard-administration.component';

const routes: Routes = [
  { path: '', data: {breadcrumb: 'Tableau de bord'}, component: DashboardAdministrationComponent },
  { path: 'account/infos-user', loadChildren: () => import('../account/infos-user/infos-user.module').then(m => m.InfosUserModule) },
  { path: 'circuit', data: {breadcrumb: 'Gestion des circuits'}, loadChildren: () => import('./parametre/circuit/circuit.module').then(m => m.CircuitModule) },
  { path: 'ministeres', data: {breadcrumb: 'Gestion des ministeres'}, loadChildren: () => import('./parametre/ministere/ministere.module').then(m => m.MinistereModule) },
  { path: 'visas', data: {breadcrumb: 'Gestion des visas'}, loadChildren: () => import('./parametre/visa/visa.module').then(m => m.VisaModule) },
  { path: 'structures', data: {breadcrumb: 'Gestion des structures'}, loadChildren: () => import('./parametre/structure/structure.module').then(m => m.StructureModule) },
  { path: 'type-structures', data: {breadcrumb: 'Gestion des types de structures'}, loadChildren: () => import('./parametre/type-structure/type-structure.module').then(m => m.TypeStructureModule) },
  { path: 'type-demandes', data: {breadcrumb: 'Gestion des types de demandes'}, loadChildren: () => import('./parametre/type-demande/type-demande.module').then(m => m.TypeDemandeModule) },

  { path: 'motifs', data: {breadcrumb: 'Gestion des motifs'}, loadChildren: () => import('./parametre/motif/motif.module').then(m => m.MotifModule) },
  { path: 'pieces', data: {breadcrumb: 'Gestion des pieces'}, loadChildren: () => import('./parametre/piece/piece.module').then(m => m.PieceModule) },
  { path: 'articles', data: {breadcrumb: 'Gestion des articles'}, loadChildren: () => import('./parametre/article/article.module').then(m => m.ArticleModule) },
  { path: 'corps', data: {breadcrumb: 'Gestion des corps'}, loadChildren: () => import('./parametre/corps/corps.module').then(m => m.CorpsModule) },
  { path: 'ampliations', data: {breadcrumb: 'Gestion des ampliations'}, loadChildren: () => import('./parametre/ampliation/ampliation.module').then(m => m.AmpliationModule) },
  { path: 'profils', data: {breadcrumb: 'Gestion des profils'}, loadChildren: () => import('./parametre/profil/profil.module').then(m => m.ProfilModule) },
  { path: '**', redirectTo: '/notfound' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
exports: [RouterModule]
})
export class AdministrationRoutingModule { }

