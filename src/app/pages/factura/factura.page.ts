import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { Location } from '@angular/common';
import { ModalController } from '@ionic/angular';

@Component({
	selector: 'app-factura',
	templateUrl: './factura.page.html',
	styleUrls: ['./factura.page.scss'],
})

export class FacturaPage implements OnInit {

	name;
	dni;
	restaurantid;
	del;
	total;
	iva;
	subtotal;
	uid;
	products: any;
	restaurant;
	addresses;

	constructor(
		public db: AngularFireDatabase,
		private _location: Location,
		private modalController: ModalController
	) {}

	ngOnInit() {
		this.uid = localStorage.getItem('uid');
		this.getName();
		this.getProducts();
		this.getAddress();
	}

	async getName() {
		var r = this.db.object('clientes/' + this.uid).valueChanges().subscribe( data => {
			this.name = data['name'] + ' ' + data['lastname'];
			this.dni = data['dni'];
			r.unsubscribe();
		})
	}

	async getProducts() {
		this.db.object('cart/' + this.uid).valueChanges().subscribe( (data: any) => {
			var arr = [];
			var t: number = 0;

			for (let d in data) {
				var a = { key: d, price: data[d].price, product: data[d].product, productData: data[d].productData, quantity: data[d].quantity, restaurant: data[d].restaurant, total: data[d].total };
				t = t + parseFloat(data[d].total);

				this.restaurantid = data[d].restaurant;

				arr.push(a);
			}

			if(arr.length >= 1) {
				this.del = true;
			} else {
				this.del = false;
			}
			
			var tt = t + 5;
			var st = tt * 0.21;
			var iv = tt - st;
			this.total = tt
			this.iva = st;
			this.subtotal = iv;

			this.products = arr;
		 	this.getRestaurant();
		}, error => {
			console.log('error', error);
		});
	}

	async getRestaurant() {
		var r = this.db.object('restaurantes/' + this.restaurantid).valueChanges().subscribe( data => {
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
