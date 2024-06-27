import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NouveauAgentComponent } from './nouveau-agent.component';

const routes: Routes = [
  {
    path: '', component: NouveauAgentComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NouveauAgentRoutingModule { }
