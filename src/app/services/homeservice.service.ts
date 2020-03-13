import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Storage } from '@ionic/storage';
import { stringify } from 'querystring';

@Injectable({
  providedIn: 'root'
})
export class HomeserviceService {

  token:any ;
  base_path = environment.url;
  httpOptions = {
		headers: new HttpHeaders({
			'Content-Type': 'application/json',
			'Authorization': this.token,
		})
	}

  	constructor(
    	private http: HttpClient,
		private storage: Storage
  	) {}

  handleError(error: HttpErrorResponse) {
		if (error.error instanceof ErrorEvent) {
			console.error('An error occurred:', error.error.message);
		} else {
			console.error(
				`Backend returned code ${error.status}, ` +
				`body was: ${error.error}`);
		}
		return throwError(
		'Something bad happened; please try again later.');
	};

  async getPromotions(): Promise<any> {
		/* await this.storage.get('_token').then(res=>{
			this.token = res.token;
		}); */

		return this.http.get(this.base_path + 'products/activepromotions', {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				/* 'Authorization': this.token, */
			})
		}).pipe(
			retry(2),
			catchError(this.handleError)
		)
	}

	async getRestaurants(): Promise<any> {
		/* await this.storage.get('_token').then(res=>{
			this.token = res.token;
		}); */

		return this.http.get(this.base_path + 'restaurants', {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				/* 'Authorization': this.token, */
			})
		}).pipe(
			retry(2),
			catchError(this.handleError)
		)
	}


	getDireccion(lat:any,long:any,key:any):Observable<any> {
		//console.log(lat+long+key);
		var dir = "https://maps.googleapis.com/maps/api/geocode/json?latlng="+lat+","+long+"&key="+key;
		//console.log(dir);
		
		return this.http.get(dir);
	}
	getDireccion2(address,key:any):Observable<any> {
		//console.log(lat+long+key);
		var dir = "https://maps.googleapis.com/maps/api/geocode/json?address="+address+"&key="+key;
		//console.log(dir);
		
		return this.http.get(dir);
	}
}
