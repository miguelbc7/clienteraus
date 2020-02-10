import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Storage } from '@ionic/storage';

@Injectable({
	providedIn: 'root'
})

export class RestaurantService {

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

	async getSchedules(id): Promise<any> {
		var data = {
			id_restaurant: id
		}

		return this.http.post(this.base_path + 'scheduless/get', data, {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
			})
		}).pipe(
			retry(2),
			catchError(this.handleError)
		)
	}

	async getProducts(id): Promise<any> {
		var data = {
			id_restaurant: id
		}

		return this.http.post(this.base_path + 'products/list', data, {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
			})
		}).pipe(
			retry(2),
			catchError(this.handleError)
		)
	}
 	
}

