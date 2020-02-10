import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AgregarEntregaPage } from '../../modals/agregar-entrega/agregar-entrega.page';
import { Router, ActivatedRoute } from '@angular/router';
import { ProductService } from '../../services/product.service';

@Component({
	selector: 'app-detalles-productos',
	templateUrl: './detalles-productos.page.html',
	styleUrls: ['./detalles-productos.page.scss'],
})

export class DetallesProductosPage implements OnInit {

	cant: number = 0;
	id: any;
	restaurant: any;
	product;

	constructor(
		public modalController: ModalController,
		private route: ActivatedRoute,
		private productService: ProductService,
		private router: Router
	) {}

  	ngOnInit() {
		this.id = this.route.snapshot.params.id;
		this.restaurant = this.route.snapshot.params.restaurant;

		this.getProduct(this.route.snapshot.params.id, this.route.snapshot.params.restaurant)
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
		const modal = await this.modalController.create({
			component: AgregarEntregaPage,
			cssClass: 'agregarEntrega2'
		});

		return await modal.present();
	}

	async back() {
		this.router.navigate(['/detailsrestaurant', this.restaurant]);
	}
}
