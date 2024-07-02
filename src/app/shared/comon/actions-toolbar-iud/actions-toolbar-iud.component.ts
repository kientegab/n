import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-actions-toolbar-iud',
  templateUrl: './actions-toolbar-iud.component.html',
  styleUrls: ['./actions-toolbar-iud.component.scss']
})
export class ActionsToolbarIudComponent {

  @Input() enableBtnInfo!: boolean;
  @Input() enableBtnEdit!: boolean;
  @Input() enableBtnDelete!: boolean;
  @Input() enableBtnDownload!: boolean;
  @Input() enableBtnPrivilege?: boolean=false ;
  @Input() enableBtnClose: boolean=false;
  @Input() enableBtnEmail: boolean=false;
  @Input() enableBtnTreat: boolean=false;
  @Input() enableBtnEval: boolean=false;
  @Input() enableBtnChanger: boolean=false;
  @Input() enableBtnEditProfil: boolean=false;

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
  
  constructor() { }

  ngOnInit(): void {
    
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

  
}
