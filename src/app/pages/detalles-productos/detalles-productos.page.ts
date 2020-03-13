import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { Location } from '@angular/common';
import { AngularFireDatabase } from '@angular/fire/database';
import { ToastController } from '@ionic/angular';

@Component({
	selector: 'app-detalles-productos',
	templateUrl: './detalles-productos.page.html',
	styleUrls: ['./detalles-productos.page.scss'],
})

export class DetallesProductosPage implements OnInit {

	uid;
	cant: number = 0;
	id: any;
	restaurant: any;
	restaurantid: any
	product;

	constructor(
		public modalController: ModalController,
		private route: ActivatedRoute,
		private productService: ProductService,
		private router: Router,
		private _location: Location,
		private db: AngularFireDatabase,
		public toastController: ToastController
	) {}

  	ngOnInit() {
		this.id = this.route.snapshot.params.id;
		this.restaurantid = this.route.snapshot.params.restaurant;
		console.log(this.route);
		
		this.uid = localStorage.getItem('uid');

		this.getProduct(this.route.snapshot.params.id, this.route.snapshot.params.restaurant);
		this.getRestaurant();
	}

	async presentToast(message) {
		const toast = await this.toastController.create({
			message: message,
			duration: 2000
		});

		await toast.present();
	}

	async getProduct(id, res) {
		this.productService.getProduct(id, res).then( response => {
			response.subscribe( data => {
				this.product = data.product[0];
			});
		});
	}

	async more(){
		var a: number = this.cant;
		a++;
		this.cant = a;
	}

	async less(){
		var a = this.cant;
		a--;

		if (a <= 0){
			a = 0;
		}

		this.cant = a;
	}

	async agregarEntrega() {
		if(this.cant < 1) {
			this.presentToast('Debe ingresar una cantidad');
		} else {
			var r= this.db.object('cart/' + this.uid + '/' + this.id).valueChanges().subscribe( dat => {
				r.unsubscribe();
				var quantity;
	
				if(dat) {
					quantity = (dat['quantity'] * 1) + (this.cant * 1);
				} else {
					quantity = this.cant;
				}
	
				var price = this.product.price_with_iva;
				var total: number  = parseFloat(price) * parseInt(quantity);
	
				var data = {
					"price": parseFloat(price),
					"product": this.id,
					"productData": this.product,
					"quantity": parseInt(quantity),
					"restaurant": this.restaurantid,
					"total": total
				}
	
				this.db.object('cart/' + this.uid + '/' + this.id).update(data).then( success => {
					this.presentToast('El producto ha sido agregado al carrito con éxito');
				}).catch( error => {
					console.log('error', error);
				})
			});
		}
	}

	async getRestaurant() {
		
		 
	await this.db.object('restaurantes/' + this.restaurantid).valueChanges().subscribe( data => {
			console.log(data);
			console.log(this.restaurantid);
			
			this.restaurant = data['name'];
		//	r.unsubscribe();
		});
	}
	
	async lookingCart() {
		return new Promise( (resolve, reject) => {
			this.db.object('cart/' + this.uid + '/' + this.id).valueChanges().subscribe( data => {

			});
		});
	}

	async back() {
		this._location.back();
	}

	async cart() {
		this.router.navigate(['/cart']);
	}
}
