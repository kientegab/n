import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DisponibiliteComponent } from './disponibilite.component';
import { DisponibiliteAgentsComponent } from './disponibilite-agents/disponibilite-agents.component';
import { CreerModifierDisponibiliteComponent } from './creer-modifier-disponibilite/creer-modifier-disponibilite.component';
import { DetailsDisponibiliteComponent } from './details-disponibilite/details-disponibilite.component';
import { DetailsDisponibiliteAgentComponent } from './details-disponibilite-agent/details-disponibilite-agent.component';

const routes: Routes = [
  {
    path: '',  component: DisponibiliteComponent
  },
  {
    path: 'agents',  component: DisponibiliteAgentsComponent
  }
  ,
  {
    path: 'nouveau',  component: CreerModifierDisponibiliteComponent
  },
  {
    path: 'details',  component: DetailsDisponibiliteComponent
  },
  { path: 'details-ags/:id',  component: DetailsDisponibiliteAgentComponent },
    {
        path: 'edit/:id',  component: CreerModifierDisponibiliteComponent
    },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DisponibiliteRoutingModule { }
