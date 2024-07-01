import { Component } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent {
  download(){
    window.open(environment.domaine+'/assets/img/loi_sigepa.pdf','_blank');
    window.location.reload();
  }
}
