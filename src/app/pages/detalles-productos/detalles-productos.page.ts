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
		this.restaurant = this.route.snapshot.params.restaurant;
		this.uid = localStorage.getItem('uid');

		this.getProduct(this.route.snapshot.params.id, this.route.snapshot.params.restaurant)
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
				console.log('data', data.product[0]);
				this.product = data.product[0];
			});
		});
	}

	async more(){
		this.cant = this.cant + 1;
	}

	async less(){
		this.cant = this.cant - 1;
		if (this.cant <= 0){
			this.cant = 0;
		}
	}

	async agregarEntrega() {
		var price = this.product.price_with_iva;
		var quantity = this.cant;
		var total = price * quantity;

		var data = {
			"price": price,
			"product": this.id,
			"productData": this.product,
			"quantity": quantity,
			"restaurant": this.restaurant,
			"total": total
		}

		this.db.list('cart/' + this.uid).push(data).then( success => {
			console.log('success', success);
			this.presentToast('El producto ha sido agregado al carrito con éxito');
		}).catch( error => {
			console.log('error', error);
		})
	}

	async back() {
		this._location.back();
	}

	async cart() {
		this.router.navigate(['/cart']);
	}
}
