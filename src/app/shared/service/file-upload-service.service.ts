import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

const uploadtUrl= environment.uploadFileDetatchement;
const uploadDispoUrl= environment.uploadFileDisponibilite;

@Injectable({
  providedIn: 'root'
})
export class FileUploadServiceService {

  private uploadUrl = 'votre-url-d-upload';

  constructor(private http: HttpClient) {}

  uploadFile(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file, file.name);

    return this.http.post(this.uploadUrl, formData);
  }

  uploadDocument(event:any){
    let data:FormData=new FormData();
    data.append('file',event.files[0]);
    return data;
  }

  upload(request: any,id:number): Observable<any> {
    return this.http.post(uploadtUrl+'/'+id, request);
  } 

  uploadDispo(request: any,id:number): Observable<any> {
    return this.http.post(uploadDispoUrl+'/'+id, request);
  } 

}
