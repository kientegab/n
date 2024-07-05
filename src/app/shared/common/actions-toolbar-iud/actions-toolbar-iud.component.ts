import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-actions-toolbar-iud',
  templateUrl: './actions-toolbar-iud.component.html',
  styleUrls: ['./actions-toolbar-iud.component.scss'],
})
export class ActionsToolbarIudComponent implements OnInit {

  @Input() enableBtnInfo!: boolean;
  @Input() enableBtnEdit!: boolean;
  @Input() enableBtnDelete!: boolean;
  @Input() enableBtnDownload!: boolean;
  @Input() enableBtnValider!: boolean;
  @Input() enableBtnPrivilege?: boolean=false ;
  @Input() enableBtnClose: boolean=false;
  @Input() enableBtnEmail: boolean=false;
  @Input() enableBtnTreat: boolean=false;
  @Input() enableBtnEval: boolean=false;
  @Input() enableBtnChanger: boolean=false;
  @Input() enableBtnEditProfil: boolean=false;
  @Input() enableBtnValidation!: boolean;
  @Input() enableBtnActe!: boolean;
  @Input() enableBtnAbandonner!: boolean;
  @Input() enableBtnRecipisse!: boolean;
  @Input() enableBtnPaiement!: boolean;

  @Output() info: EventEmitter<any> = new EventEmitter();
  @Output() edit: EventEmitter<any> = new EventEmitter();
  @Output() delete: EventEmitter<any> = new EventEmitter();
  @Output() privilege: EventEmitter<any> = new EventEmitter();
  @Output() close: EventEmitter<any> = new EventEmitter();
  @Output() email: EventEmitter<any> = new EventEmitter();
  @Output() treat: EventEmitter<any> = new EventEmitter();
  @Output() evaluer: EventEmitter<any> = new EventEmitter();
  @Output() changer: EventEmitter<any> = new EventEmitter();
  @Output() editProfil: EventEmitter<any> = new EventEmitter();
  @Output() download: EventEmitter<any> = new EventEmitter();
  @Output() validation: EventEmitter<any> = new EventEmitter();
  @Output() valider: EventEmitter<any> = new EventEmitter();
  @Output() acte: EventEmitter<any> = new EventEmitter();
  @Output() abandonner: EventEmitter<any> = new EventEmitter();
  @Output() generate: EventEmitter<any> = new EventEmitter();
  @Output() paiement: EventEmitter<any> = new EventEmitter();
  // items: MenuItem[] = [];

  constructor() { }

  ngOnInit(): void {
    // this.items = [
    //   {
    //       label: 'Détails',
    //       icon: 'pi pi-eye',
    //       items: [
    //           {
    //               label: 'Delete',
    //               icon: 'pi pi-fw pi-trash'
    //           },
    //           {
    //               separator: true
    //           },
    //           {
    //               label: 'Export',
    //               icon: 'pi pi-fw pi-external-link'
    //           }
    //       ]
    //   },
    // ];
  }

  fireInfo() {
    this.info.emit();
  }

  fireEdit() {
    this.edit.emit();
  }

  fireDelete() {
    this.delete.emit();
  }

  fireActe() {
    this.acte.emit();
  }

  firePrivilege() {
    this.privilege.emit();
  }
  fireClose() {
    this.close.emit();
  }
  fireEmail() {
    this.email.emit();
  }

  fireTreat() {
    this.treat.emit();
  }
  fireEvaluer(){
   this.evaluer.emit();
  }
  fireChanger(){
  this.changer.emit();
  }

  fireEditProfil(){
    this.editProfil.emit();
    }

  fireDownload(){
    this.download.emit()
  }
  fireValidation() {
    this.validation.emit();
  }
  fireValider() {
    this.valider.emit();
  }

  fireAbandonner() {
    this.abandonner.emit();
  }

  fireGenerate(){
    this.generate.emit()
  }

    firePaiement(){
        this.paiement.emit()
    }
}
