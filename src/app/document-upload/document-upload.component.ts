import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Message } from 'primeng/api';
import { FileUpload } from 'primeng/fileupload';
import { FileUploadServiceService } from '../shared/service/file-upload-service.service';

@Component({
  selector: 'app-document-upload',
  templateUrl: './document-upload.component.html',
  styleUrls: ['./document-upload.component.css']
})
export class DocumentUploadComponent implements OnInit {

  @ViewChild('df') form!: NgForm;
  @ViewChild('fileUpload') fileUpload!: FileUpload;

  isOperationInProgress: boolean | false = false;
  uploadPanelHasFiles: boolean | false = false;

  uploadedFiles: any[] = [];


  message: Message | undefined;

  selectedFile: File | null = null;

  constructor(
  private fileUploadService: FileUploadServiceService
  
  ) { }


  ngOnInit() {

  }



  save() {
    this.fileUpload.upload();
  }

  upload(event:any, id: number) {
    let data = this.fileUploadService.uploadDocument(event, id);
    // this.fileUploadService.uploadFil(data, id).subscribe(response => { 
    //   this.isDialogOpInProgress = false;
    //   this.showMessage({ severity: 'success', summary: 'Signature enregistrer avec succes' });
    // }, error => this.handleError(error));
  }
   
  onUpload(event: any): void {
  }

  onFileSelect(event: any): void {
    this.uploadPanelHasFiles = true;
    if (event) {
      const file = event.files[0];
      if (file.type === 'application/pdf') {
        this.selectedFile = file;
      } else {
        alert('Veuillez sélectionner un fichier PDF.');
        this.selectedFile = null;
      }
    }
    console.log(this.selectedFile);
  }

  onFileRemove() {
    this.uploadPanelHasFiles = false;
  }

  // Messages

  // handleError(error: HttpErrorResponse) {
  //   console.log(`Processing Error: ${JSON.stringify(error)}`);
  //   this.isOperationInProgress = false;
  //   this.showMessage(error.error.message, Severity.error);
  // }

  // showMessage(message: string, severity: Severity) {
  //   this.message = { severity: severity, summary: 'Message', detail: message };
  //   setTimeout(() => {
  //     this.message = null;
  //   }, 5000);
  // }

}
