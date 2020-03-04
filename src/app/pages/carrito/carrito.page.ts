import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { AngularFireDatabase } from '@angular/fire/database';
import { ToastController } from '@ionic/angular';
import { ModalController } from '@ionic/angular';
import { AgregarEntregaPage } from '../../modals/agregar-entrega/agregar-entrega.page';
import { BaseSuccessPage } from '../modals/base-success/base-success.page';

@Component({
	selector: 'app-carrito',
	templateUrl: './carrito.page.html',
	styleUrls: ['./carrito.page.scss'],
})

export class CarritoPage implements OnInit {

	cant: number = 0;
	products;
	address;
	billing;
	uid;
	total;
	subtotal;
	iva;
	add;
	showadd = false;
	name;
	dni;
	addresses;
	restaurantid;
	restaurant;
	del;
	
	constructor(
		public modalController: ModalController,
		private _location: Location,
		private db: AngularFireDatabase,
		public toastController: ToastController
	) {}

	async ngOnInit() {
		this.uid = localStorage.getItem('uid');
		await this.getName();
		await this.getProducts();
		await this.getAddress();
	}

	async more(id, i){
		var quantity = this.products[i].quantity + 1;
		var ref = this.db.list('cart/' + this.uid);
		var price = this.products[i].price;
		var total = parseInt(quantity) * parseFloat(price);

		ref.update(id, { quantity: quantity, total: total }).then( success => {
			this.products[i].quantity = quantity;
		}).catch( error => {
			console.log('error', error);
		});

		var t: number = 0;
		var data = this.products;

		for (let d in data) {
			t = t + parseFloat(data[d].total);
		}

		var tt = t + 5;
		var st = tt * 0.21;
		var iv = tt - st;

		this.total = tt
		this.iva = st;
		this.subtotal = iv;
	}

	async less(id, i){
		var quantity: any = this.products[i].quantity - 1;
		
		if (quantity <= 0){
			quantity = 1;
		}

		var price = this.products[i].price;
		var total = parseInt(quantity) * parseFloat(price);

		var ref = this.db.list('cart/' + this.uid);
		ref.update(id, { quantity: quantity, total: total }).then( success => {
			this.products[i].quantity = quantity;
		}).catch( error => {
			console.log('error', error);
		});

		var t: number = 0;
		var data = this.products;

		for (let d in data) {
			t = t + parseFloat(data[d].total);
		}
		
		var tt = t + 5;
		var st = tt * 0.21;
		this.total = tt
		this.iva = st;
		var iv = tt - st;
		this.subtotal = iv;
	}

	async back() {
		this._location.back();
	}

	async getName() {
		console.log('uid',  this.uid);
		var r = this.db.object('clientes/' + this.uid).valueChanges().subscribe( data => {
			console.log('data', data);
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
					console.log('data2', data2);

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

	async addAddress() {
		if(this.showadd) {
			var a = 1;
		} else {
			var a = 2;
		}

		const modal = await this.modalController.create({
			component: AgregarEntregaPage,
			cssClass: 'agregarEntrega2',
			componentProps: {
				type: a
			}
		});

		modal.onDidDismiss().then( data => {
			this.getAddress();
		}).catch( error => {
			this.getAddress();
		});

		return await modal.present();
	}

	async presentToast(message) {
		const toast = await this.toastController.create({
			message: message,
			duration: 2000
		});

		await toast.present();
	}

	async deleteProduct(key, i) {
		this.db.list('cart/' + this.uid + '/' + key).remove().then( success => {
			console.log('success', success);
		}).catch( error => {
			console.log('error', error);
		});
	}

	async cleanCart() {
		this.db.list('cart/' + this.uid).remove().then( success => {
			this.del = false;
		}).catch( error => {
			console.log('error', error);
		});
	}

	async send() {
		if(!this.showadd) {
			this.presentToast('Debe registrar una dirección para continuar');
		}

		if(Object.keys(this.products).length < 1) {
			this.presentToast('Debe agregar productos al carrito');
		}

		if((this.showadd) && (Object.keys(this.products).length > 0)) {
			var ref = this.db.list('clientes/' + this.uid);
			var ref2 = this.db.list('restaurantes/' + this.restaurantid);

			var r1 = ref.valueChanges().subscribe( (success2: any) => {
				var t =  parseFloat(this.total) - parseFloat(success2[0]['eats'].value);
				var p: number, p2: number;
				var status;

				if(t > 0) {
					if(t > parseFloat(success2[0]['propia'].value)) {
						r1.unsubscribe();
						this.presentToast('No tiene saldo suficiente en sus cuentas para pagar esa cantidad');
					} else {
						p = parseFloat(success2[0]['propia'].value) - t;
						status = 1;
					}
					p2 = 0;
				} else {
					if(parseFloat(this.total) > parseFloat(success2[0]['eats'].value)) {
						p2 = parseFloat(this.total) - parseFloat(success2[0]['eats'].value);
					} else {
						p2 = parseFloat(success2[0]['eats'].value) - parseFloat(this.total);
					}
					p = success2[0]['propia'].value;
					status = 2;
				}

				var dat = {
					eats: { 
						value: p2,
						type: 1
					},
					books: {
						value: parseFloat(success2[0]['books'].value),
						type: 2
					},
					fuel: {
						value: parseFloat(success2[0]['fuel'].value),
						type: 1
					},
					gyms: {
						value: parseFloat(success2[0]['gyms'].value),
						type: 2
					},
					kids: {
						value: parseFloat(success2[0]['kids'].value),
						type: 1
					},
					propia: {
						value: p,
						type: 3
					},
					trips: {
						value: parseFloat(success2[0]['trips'].value),
						type:   2
					}
				}

				if((status == 1 && p < 1) || (status == 2 && p2 < 1)) {
					r1.unsubscribe();
					this.presentToast('No tiene saldo suficiente en sus cuentas para pagar esa cantidad');
				} else {
					r1.unsubscribe();
					this.db.list('clientes').update(this.uid, { accounts: dat }).then( success => {
						var r2 = ref2.valueChanges().subscribe( (success: any) => {
							var price = parseFloat(success[0]) + parseFloat(this.total);
				
							this.db.list('restaurantes').update(this.restaurantid, { balance: price }).then( success2 => {
								r2.unsubscribe();
								this.cleanCart();
								this.success('El pago se ha realizado con éxito')
							});
						}, error => {
							console.log('error', error);
							r2.unsubscribe();
						}, () => {
							r2.unsubscribe();
						});
					});
				}
			});
		}
	}

	async success(message) {
		const modal = await this.modalController.create({
			component: BaseSuccessPage,
			cssClass: 'successBaseModal',
			componentProps: { message: message }
		});

		return await modal.present();
	}
}
