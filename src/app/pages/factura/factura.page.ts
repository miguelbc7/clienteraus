import { Component, OnInit, Input } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { Location } from '@angular/common';
import { ModalController } from '@ionic/angular';

@Component({
	selector: 'app-factura',
	templateUrl: './factura.page.html',
	styleUrls: ['./factura.page.scss'],
})

export class FacturaPage implements OnInit {

	@Input() restaurantid: any;
	@Input() products: any;
	@Input() subtotal: any;
	@Input() iva: any;
	@Input() total: any;
	name;
	dni;
	del;
	uid;
	restaurant;
	addresses;

	constructor(
		public db: AngularFireDatabase,
		private _location: Location,
		private modalController: ModalController
	) {}

	async ngOnInit() {
		this.uid = localStorage.getItem('uid');
		await this.getName();
		await this.getAddress();
		console.log('restaurantid', this.restaurantid);
		console.log('products', this.products);
	}

	async getName() {
		var r = this.db.object('clientes/' + this.uid).valueChanges().subscribe( (data: any) => {
			console.log('data', data);
			this.name = data['name'] + ' ' + data['lastname'];
			this.dni = data['dni'];
			r.unsubscribe();
		})
	}

	async getRestaurant() {
		var r = this.db.object('restaurantes/' + this.restaurantid).valueChanges().subscribe( (data: any) => {
			console.log('data', data);
			this.restaurant = data['name'];
			r.unsubscribe();
		});
	}

	async getAddress() {
		var r = this.db.object('addresses/' + this.uid).valueChanges().subscribe( data => {
			if(data) {
				this.addresses = data;
				r.unsubscribe();
			} else {
				var r2 = this.db.object('clientes/' + this.uid).valueChanges().subscribe( data2 => {
					var addresses = {
						city: '',
						country: '',
						street: '',
						phone: '',
						zipcode: ''
					};


					if(data2['city']) {
						addresses['city'] = data2['city'];
					}

					if(data2['country']) {
						addresses['country'] = data2['city'];
					}

					if(data2['address']) {
						addresses['street'] = data2['address'];
					}

					if(data2['phone']) {
						addresses['phone'] = data2['phone'];
					}

					if(data2['zipcode']) {
						addresses['zipcode'] = data2['zipcode'];
					}

					this.addresses = addresses;
				})
			}
		})
	}

	async back() {
		this.modalController.dismiss();
	}

}
