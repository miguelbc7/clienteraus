import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Storage } from '@ionic/storage';
import { map } from 'rxjs/operators';

@Injectable({
	providedIn: 'root'
})

export class HomeserviceService {
  	token:any ;
  	base_path = environment.url;
  	base_path2 = environment.url3;
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
		return this.http.get(this.base_path + 'products/activepromotions', {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
			})
		}).pipe(
			retry(2),
			catchError(this.handleError)
		)
	}

	async getRestaurants(): Promise<any> {
		return this.http.get(this.base_path + 'restaurants', {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
			})
		}).pipe(
			retry(2),
			catchError(this.handleError)
		)
	}

	async recover(email) {
		return new Promise( (resolve, reject) => {
			var data = {
				email: email
			}

			return this.http.post(this.base_path2 + 'recovery/cliente', data, {
				headers: new HttpHeaders({
					'Content-Type': 'application/json',
				})
			}).pipe(
				map(res => res)
			).subscribe( data => {
				resolve('success');
			}, error => {
				reject('error');
			});
		});
	}

	getDireccion(lat:any,long:any,key:any):Observable<any> {
		var dir = "https://maps.googleapis.com/maps/api/geocode/json?latlng="+lat+","+long+"&key="+key;
		return this.http.get(dir);
	}

	getDireccion2(address,key:any):Observable<any> {
		var dir = "https://maps.googleapis.com/maps/api/geocode/json?address="+address+"&key="+key;
		return this.http.get(dir);
	}
}
