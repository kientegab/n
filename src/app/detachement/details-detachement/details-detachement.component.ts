import { Component, Input } from '@angular/core';
import { cloneDeep } from 'lodash';
import { Message } from 'primeng/api';
import { DynamicDialogRef, DynamicDialogConfig, DialogService } from 'primeng/dynamicdialog';
import { AviserDetachementComponent } from '../aviser-detachement/aviser-detachement.component';
import { AviserDisponibiliteComponent } from 'src/app/disponibilite/aviser-disponibilite/aviser-disponibilite.component';
import { IDemande, Demande } from 'src/app/shared/model/demande.model';
import { ActivatedRoute, Router } from '@angular/router';
import { DemandeService } from 'src/app/shared/service/demande-service.service';
import { ReceptionDetachementComponent } from '../reception-detachement/reception-detachement.component';
import { ValiderProjetComponent } from '../valider-projet/valider-projet.component';

@Component({
  selector: 'app-details-detachement',
  templateUrl: './details-detachement.component.html',
  styleUrls: ['./details-detachement.component.scss']
})
export class DetailsDetachementComponent {

  demande: IDemande = new Demande(); 
  @Input() data: IDemande = new Demande();
  idDmd: number | undefined;
  isOpInProgress!: boolean;
  isDialogOpInProgress!: boolean;
  showDialog = false;
  message: any;
  timeoutHandle: any;
  demandes: any;

  constructor(
    private dialogRef: DynamicDialogRef,
    private dialogService: DialogService,
    private demandeService: DemandeService,
    private route: ActivatedRoute,
    private router: Router
  ) {}


  ngOnInit(): void {
    // if (this.dynamicDialog.data) {
    //   this.demande = cloneDeep(this.dynamicDialog.data);
    // }
    this.idDmd = +this.route.snapshot.paramMap.get('id')!;
    this.getDemande();
    console.log("DEMANDE ========", this.demande);
  }

  /** Permet d'afficher un modal pour la reception */
  openModalReceptionner(demande: IDemande): void {
    this.dialogService.open(ReceptionDetachementComponent,
      {
        header: 'Receptionner une demande',
        width: '40%',
        contentStyle: { overflow: 'auto' },
        baseZIndex: 10000,
        maximizable: true,
        closable: true,
        data: demande
      }).onClose.subscribe(result => {
        if(result){
          this.isDialogOpInProgress = false;
          this.showMessage({ severity: 'success', summary: 'Demande receptionnée avec succès' });
        }

      });

  }
  /** Permet d'afficher un modal pour aviser une demande */
  openModalAviser(demande: IDemande): void {
    this.dialogService.open(AviserDetachementComponent,
    {
      header: 'Aviser une demande',
      width: '40%',
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000,
      maximizable: true,
      closable: true,
      data: demande
    }).onClose.subscribe(result => {
      if(result){
        this.isDialogOpInProgress = false;
        this.showMessage({ severity: 'success', summary: 'Demande avisée avec succès' });
      }

    });

  }
   /** Permet d'afficher un modal pour aviser une demande */
   openModalValiderProjet(demande: IDemande): void {
    this.dialogService.open(ValiderProjetComponent,
    {
      header: 'Valider un projet (Profil RH) ',
      width: '40%',
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000,
      maximizable: true,
      closable: true,
      data: demande
    }).onClose.subscribe(result => {
      if(result){
        this.isDialogOpInProgress = false;
        this.showMessage({ severity: 'success', summary: 'Projet validé avec succès' });
      }

    });

  }
  openModalElaborerProjet(demande:IDemande): void {
    this.router.navigate(['detachements','elaborer', demande.id]);
  }

  showMessage(message: Message) {
    this.message = message;
    this.timeoutHandle = setTimeout(() => {
      this.message = null;
    }, 5000);
  }

  clear(): void {
      this.dialogRef.close();
      this.dialogRef.destroy();
  }

  fermer(): void {
    this.router.navigate(['detachements']);
  }

  getDemande(): void {
    this.demandeService.find(this.idDmd!).subscribe(result => {
      if (result && result.body) {
        this.demande = result.body;
      }
    });
  }

}
