import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from "rxjs";
import { map } from 'rxjs/operators';
import { Offer } from "../models/offer.model";
import { PriceInfo } from "../models/price-info.model";
import { Category } from "../models/category.model";

@Injectable()
export class XmlSender {

  constructor(private http: HttpClient) { }

  uploadFile(fileToUpload: File): Observable<any> {
    debugger;
    const endpoint = '/api/Xml/UploadFile';
    const formData: FormData = new FormData();
   
    formData.append('fileKey', fileToUpload, fileToUpload.name);
    return this.http.post<Category[]>(endpoint, formData);
  }



  getOffers(fileName: string): Observable<Offer[]> {
    debugger;
    const endpoint = '/api/Xml/GetAllOffers';

    let params = new HttpParams();
    params = params.append('cacheKey', fileName);
    return this.http.get<Offer[]>(endpoint, { params: params });
  }

  getCategories(fileName: string): Observable<Category[]> {
    debugger;
    const endpoint = '/api/Xml/GetAllCategories';

    let params = new HttpParams();
    params = params.append('cacheKey', fileName);
    return this.http.get<Category[]>(endpoint, { params: params });
  }

}
