import { Component, Input } from '@angular/core';
import { cloneDeep } from 'lodash';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { IProfil, Profil } from 'src/app/shared/model/profil.model';

@Component({
  selector: 'app-details-profil',
  templateUrl: './details-profil.component.html',
  styleUrls: ['./details-profil.component.scss']
})
export class DetailsProfilComponent {

  profil: IProfil = new Profil();
  @Input() data: IProfil = new Profil();

  constructor(
    private dialogRef: DynamicDialogRef,
    private dynamicDialog:  DynamicDialogConfig,
) {}

  ngOnInit(): void {
    if (this.dynamicDialog.data) {
      this.profil = cloneDeep(this.dynamicDialog.data);
    }
    }

    clear(): void {
      this.dialogRef.close();
      this.dialogRef.destroy();
  }

}
