import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TypeDemandeDisComponent } from './type-demande-dis.component';

const routes: Routes = [
  {
      path:"",
      component: TypeDemandeDisComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TypeDemandeDisRoutingModule { }
