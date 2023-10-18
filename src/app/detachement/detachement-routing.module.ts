import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DetachementComponent } from './detachement.component';
import { DetachementAgentsComponent } from './detachement-agents/detachement-agents.component';
import {CreerModifierDetachementComponent} from "./creer-modifier-detachement/creer-modifier-detachement.component";
import { DetailsDetachementComponent } from './details-detachement/details-detachement.component';
import { ElaborerProjetComponent } from './elaborer-projet/elaborer-projet.component';
import { ValiderProjetComponent } from './valider-projet/valider-projet.component';
import { DetailsDetachementAgentComponent } from './details-detachement-agent/details-detachement-agent.component';

const routes: Routes = [
  { path: '', component: DetachementComponent },
  { path: 'nouveau', component: CreerModifierDetachementComponent },
  { path: 'edit/:id',  component: CreerModifierDetachementComponent },
  { path: 'agents', component: DetachementAgentsComponent },
  { path: 'details/:id',  component: DetailsDetachementComponent },
  { path: 'details-ags/:id',  component: DetailsDetachementAgentComponent },
  { path: 'elaborer/:id',  component: ElaborerProjetComponent },
  { path: 'valider/:id',  component: ValiderProjetComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DetachementRoutingModule { }
