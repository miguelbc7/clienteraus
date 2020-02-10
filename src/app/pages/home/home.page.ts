import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { HomeserviceService } from '../../services/homeservice.service';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from '@angular/fire/database';
import { CalculatePage } from '../modals/calculate/calculate.page';
import { Router } from '@angular/router';
import * as firebase from 'firebase';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  	slideOpts = {
    	initialSlide: 1,
    	speed: 400,
    	pagination: false,
    	slidesPerView: 2,
	};
	promotions;
	restaurants;
	token;
	count: any;
	count2: any;

  	constructor(
		private homeService: HomeserviceService,
		private db: AngularFireDatabase,
		private firebaseAuth: AngularFireAuth,
		private modalController: ModalController,
		private router: Router
	) {}

	ngOnInit() {
		this.getBalance();
		this.getPromotions();
		this.getRestaurants();
	}
	  
	async getPromotions() {

		this.homeService.getPromotions().then( response => {
			response.subscribe( data => {
				var array = [];
				data.product.forEach( row => {
					var price = row.price_with_iva + "";
					if(price.indexOf('.') > -1) {
						var price1: any = price.split('.')[0];
						var price2: any = price.split('.')[1];
					} else {
						var price1: any = row.price_with_iva;
						var price2: any = '00';
					}

					var a = { ingredients: row.ingredients, no_ingredients: row.no_ingredients, images: row.images, _id: row._id, name: row.name, description: row.description, nutritional_values: row.nutritional_values, fat: row.fat, carbohydrates: row.carbohydrates, protein: row.protein, total_calories: row.total_calories, iva: row.iva, eat_in_restaurant: row.eat_in_restaurant, wear: row.wear, delivery: row.delivery, status: row.status, stock: row.stock, id_restaurant: row.id_restaurant, id_promotion: row.id_promotion, __v: row.__v, price1: price1, price2: price2 }
					array.push(a);
				});

				this.promotions = array;
			});
		});
	}

	async getRestaurants() {
		this.homeService.getRestaurants().then( response => {
			response.subscribe( data => {
				var res = [];

				for(let i of Object.keys(data)) {
					var slider;

					if(data[i].slider) {
						slider = data[i].slider[0].photo
					} else {
						slider = "";
					}

					var a = { name: data[i].name, slider: slider, key: i };
					res.push(a);
				}
				
				this.restaurants = res;
			});
		});
	}

	async getBalance() {
		/* this.firebaseAuth.auth.onAuthStateChanged(user => {
			if (user) {
				let uid = user.uid; */
				var uid = localStorage.getItem('uid');

				this.db.list('clientes/' + uid + '/accounts').valueChanges().subscribe( success => {
					let c: any = 0;
					success.forEach( (row: any) => {
						c += parseFloat(row.value);
					});

					c = c.toFixed(2);

					if((c.toString()).indexOf('.') > -1) {
						this.count = (c.toString()).split('.')[0];
						this.count2 = ((c.toString()).split('.')[1]);
					} else {
						this.count = c;
						this.count2 = '00';
					}
				}, error => {
					console.log('error', error);
				});
			/* }
			else {
			  	console.log('no user')
			}
	  	}) */
	}

	async calculate() {
		const modal = await this.modalController.create({
			component: CalculatePage,
			cssClass: 'calculate'
		});

		return await modal.present();
	}
	
	async goToRestaurant(id) {
		this.router.navigate(['/detailsrestaurant', id]);
	}
}
