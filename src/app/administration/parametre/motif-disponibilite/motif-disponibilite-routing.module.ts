import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {MotifDisponibiliteComponent} from "./motif-disponibilite.component";

const routes: Routes = [
    {
        path: '', component: MotifDisponibiliteComponent,
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MotifDisponibiliteRoutingModule { }
