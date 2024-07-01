import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

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

  uploadDocument(event:any, id:number){
    let data:FormData=new FormData();
    data.append('file',event.files[0]);
    return data;
  }

  // upload(data: FormData, id:number): Observable<any> {
  //   return ;
  // }

}
