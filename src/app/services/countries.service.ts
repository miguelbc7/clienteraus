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

export class CountriesService {

  	token:any ;
  	base_path = "https://myraus.com/paises/paises.json";
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

	getCountries() {
		return new Promise( (resolve, reject) => {
			return this.http.get('assets/paises.json', {}).pipe(
				map(res => res)
			).subscribe( data => {
				resolve(data);
			}, error => {
				reject(error);
			});
		});
	}
}
