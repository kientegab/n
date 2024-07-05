import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Message } from 'primeng/api';
import { FileUpload } from 'primeng/fileupload';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { cloneDeep } from 'lodash';
import { Demande, IDemande } from 'src/app/shared/model/demande.model';
import { FileUploadServiceService } from 'src/app/shared/service/file-upload-service.service';

@Component({
  selector: 'app-document-upload-file',
  templateUrl: './document-upload-file.component.html',
  styleUrls: ['./document-upload-file.component.css']
})
export class DocumentUploadFileComponent implements OnInit {

  @ViewChild('df') form!: NgForm;
  @ViewChild('fileUpload') fileUpload!: FileUpload;

  isOperationInProgress: boolean | false = false;
  uploadPanelHasFiles: boolean | false = false;
  @Input() data: IDemande = new Demande();
  demande: IDemande = new Demande();

  error: string | undefined;
  showDialog = false;
  isDialogOpInProgress!: boolean;
  message: any;
  dialogErrorMessage: any;
  timeoutHandle: any;
  isOpInProgress!: boolean;
  formData!: FormData;
  isFile: boolean | boolean = false;

  selectedFile: File | null = null;

  constructor(
  private fileUploadService: FileUploadServiceService,
  private dialogRef: DynamicDialogRef,
  private dynamicDialog: DynamicDialogConfig
  
  ) { }


  ngOnInit() {
    if (this.dynamicDialog.data) {
      this.demande = cloneDeep(this.dynamicDialog.data);
      console.log(this.demande);
    }
  }

  clear(): void {
    this.isFile = false;
    this.form.resetForm();
    this.dialogRef.close();
    this.dialogRef.destroy();
  }

  clearDialogMessages() {
    this.dialogErrorMessage = null;
  }
  // Errors
  handleError(error: HttpErrorResponse) {
    console.error(`Processing Error: ${JSON.stringify(error)}`);
    this.isDialogOpInProgress = false;
    this.dialogErrorMessage = error.error.title;
  }


  showMessage(message: Message) {
    this.message = message;
    this.timeoutHandle = setTimeout(() => {
      this.message = null;
    }, 5000);
  }

  save() {
    //this.fileUpload.upload();
    this.fileUploadService.uploadDispo(this.formData, this.demande.id!).subscribe({
      next: (response) => {
        this.dialogRef.close(response);
        this.dialogRef.destroy();
        this.isFile = false;
        this.showMessage({
          severity: 'success',
          summary: 'Document sauvegardé avec succès',
        });
      },
      error: (error) => {
        this.message = { severity: 'error', summary: error.error };
        console.error("error" + JSON.stringify(error));
        this.isOpInProgress = false;
        this.isFile = false;
        this.showMessage({ severity: 'error', summary: error.error.message });

      }
    });
  }

  onUpload(event:any) {
    console.log("selectionner file", event);
    this.clearDialogMessages();
    this.isDialogOpInProgress = true;
    let id = 1;
    let data = this.fileUploadService.uploadDocument(event);
    this.fileUploadService.upload(data, id).subscribe({
      next: (response) => {
        this.dialogRef.close(response);
        this.dialogRef.destroy();
        this.showMessage({
          severity: 'success',
          summary: 'Document sauvegardé avec succès',
        });
      },
      error: (error) => {
        this.message = { severity: 'error', summary: error.error };
        console.error("error" + JSON.stringify(error));
        this.isOpInProgress = false;
        this.showMessage({ severity: 'error', summary: error.error.message });

      }
    });
  }
   

  onFileSelect(event: any): void {
    this.formData = this.fileUploadService.uploadDocument(event);
    this.isFile = true;
  }

}
