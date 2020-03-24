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

export class SmsService {
	token:any ;
  	base_path = environment.url2;
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


	getSms(phone) {
		return new Promise( (resolve, reject) => {
			var body = 'Para confirmar su registro en Raus debe ingresar el siguiente codigo: ';

			var data = {
				to: phone,
				body: body
			}

			return this.http.post(this.base_path + 'sms/EnviarCodigo', data, {
				headers: new HttpHeaders({
					'Content-Type': 'application/json',
				})
			}).pipe(
				map(res => res)
			).subscribe( data => {
				if(data) {
					resolve('success');
				}
			}, error => {
				if(error) {
					reject('error');
				}
			});
		});
	}

	verifySms(code) {
		return new Promise( (resolve, reject) => {
			var data = {
				codigo: code,
			}

			return this.http.post(this.base_path + 'sms/VerificarCodigo', data, {
				headers: new HttpHeaders({
					'Content-Type': 'application/json',
				})
			}).pipe(
				map(res => res)
			).subscribe( data => {
				if(data) {
					resolve('success');
				}
			}, error => {
				if(error) {
					reject('error');
				}
			});
		});
	}
	  
}
