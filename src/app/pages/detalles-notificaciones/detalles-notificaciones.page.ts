import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Storage } from '@ionic/storage';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-detalles-notificaciones',
  templateUrl: './detalles-notificaciones.page.html',
  styleUrls: ['./detalles-notificaciones.page.scss'],
})
export class DetallesNotificacionesPage implements OnInit {

  id: any;
	token: any;
	detail: any;
	base_path = environment.url;
  private sub: any;
  
  constructor(
    private route: ActivatedRoute,
		private storage: Storage,
		private http: HttpClient
  ) { }

  ngOnInit() {
    this.id = this.route.snapshot.params.id;
		console.log('id', this.id);
		this.getData();
  }

  async getData() {
		await this.storage.get('_token').then(res=>{
			this.token = res.token;
		});

		await this.storage.get('_uid').then(res=>{
			var uid = res;

			return this.http.get(this.base_path + 'showcase/' + this.id, {
				headers: new HttpHeaders({
					'Content-Type': 'application/json',
				}), params: {
					token: this.token,
				}
			}).subscribe( 
				res => { 
					this.detail = res;
				},
				err => (console.log('err', err))
			);

		});
	}

}
