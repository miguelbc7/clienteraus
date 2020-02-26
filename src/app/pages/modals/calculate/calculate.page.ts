import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AngularFireDatabase } from '@angular/fire/database';
import { map } from 'rxjs/operators';
import { TipoPagoPage } from '../tipo-pago/tipo-pago.page';
import { ToastController } from '@ionic/angular';

@Component({
	selector: 'app-calculate',
	templateUrl: './calculate.page.html',
	styleUrls: ['./calculate.page.scss'],
})
export class CalculatePage implements OnInit {

	total;
	data;
	dataid;
	items;
	isItemAvailable;
	restaurants;

	constructor(
		private db: AngularFireDatabase,
		private modalController: ModalController,
		public toastController: ToastController
	) {}

	ngOnInit() {
		this.isItemAvailable = false;
		this.getRestaunrants();
	}
   
	async getItems(ev: any) {
		const val = ev.target.value;
	
		if (val && val.trim() != '') {
			this.isItemAvailable = true;

			if(this.items.length < 1) {
				this.getRestaunrants();

				this.items = this.items.filter((item) => {
					return (item.name.toLowerCase().indexOf(val.toLowerCase()) > -1);
				});
			} else {
				this.items = this.items.filter((item) => {
					return (item.name.toLowerCase().indexOf(val.toLowerCase()) > -1);
				});
			}
		}
	}

	async getRestaunrants() {
		this.db.object('restaurantes').valueChanges().subscribe( (success: any) => {
			console.log('success', success);
			var arr = [];
			var c = 0;

			var length = Object.keys(success).length;

			for(let s in success) {
				var a = { name: success[s].name, key: s }
				arr.push(a);
				c++;

				if(c == length) {
				console.log('success', arr);
				this.items = arr;
				}
			}
		}, error => {
			console.log('error', error);
		});
	}

	async setData(value, value2) {
		this.data = value;
		this.dataid = value2;
		this.isItemAvailable = false;
	}

	async setNumber(number: string) {
		if(this.total) {
			this.total = this.total.toString() + number.toString();
		} else {
			this.total = number.toString();
		}
	}

	async send() {
		if(!this.total) {
			this.presentToast('Debe ingresar un monto para enviar');
		}

		if(!this.data) {
			this.presentToast('Debe seleccionar un restaurante');
		}

		if(!this.dataid) {
			this.presentToast('Debe seleccionar un restaurante');
		}
	
		if((this.total) && (this.data) && (this.dataid)) {
			this.closeModal();

			const modal = await this.modalController.create({
				component: TipoPagoPage,
				componentProps: { 
				total: this.total,
				data: this.data,
				dataid: this.dataid
				},
				cssClass: 'tipoPago'
			});
			
			return await modal.present();
		}
	}

	async presentToast(message) {
		const toast = await this.toastController.create({
			message: message,
			duration: 2000
		});

		toast.present();
	}

	async closeModal() {
		this.modalController.dismiss();
  	}

	async cleanTotal() {
		this.total = '';
	}

	async keyTotal(e) {
		var a = this.total;

		if(a) {
			if(a.indexOf('.') > -1) {
				var b = a.split(',').join('.');
				this.total = b;
			}
		}
	}
}
