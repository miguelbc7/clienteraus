import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { HomeserviceService } from '../../services/homeservice.service';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from '@angular/fire/database';
import { CalculatePage } from '../modals/calculate/calculate.page';
import { Router } from '@angular/router';
import * as firebase from 'firebase';
import { ProductService } from "../../services/product.service";
import { async } from '@angular/core/testing';
import { RestaurantService } from '../../services/restaurant.service';
import { ActivatedRoute } from '@angular/router';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';

@Component({
	selector: 'app-home',
	templateUrl: './home.page.html',
	styleUrls: ['./home.page.scss'],
})

export class HomePage implements OnInit {
	products: any;
	restaurantes: boolean = false;
	productos: boolean = true;
	id:any;
	restaurantid:any;
	latLng;
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
		private route: ActivatedRoute,
		private restaurantService: RestaurantService,
		private producto: ProductService,
		private homeService: HomeserviceService,
		private db: AngularFireDatabase,
		private firebaseAuth: AngularFireAuth,
		private modalController: ModalController,
		private router: Router,
		private androidPermissions: AndroidPermissions,
		private locationAccuracy: LocationAccuracy,
		private geolocation: Geolocation
	) {}

	async ngOnInit() {
		await this.checkGPSPermission();
		await this.getBalance();
		await this.getPromotions();
		await this.getRestaurants();
		await this.getProducts('');
		this.id = this.route.snapshot.params.id;
		this.restaurantid = this.route.snapshot.params.restaurant;
	}

	async ionViewWillEnter() {
		this.checkGPSPermission();
	}

	checkGPSPermission() {
		this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION).then(
			result => {
				if (result.hasPermission) {
					console.log('hasPermission');
					this.askToTurnOnGPS();
				} else {
					console.log('no hasPermission');
					this.requestGPSPermission();
				}
			}, err => {
				console.error(err);
			}
		).catch(error => {
			console.log('error', error);
		});
	}

	requestGPSPermission() {
		this.locationAccuracy.canRequest().then((canRequest: boolean) => {
			if (canRequest) {
				this.myLocation();
			}
		});
	}

	askToTurnOnGPS() {
		this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(() => {
			this.myLocation();
		}, error => {
			console.error('Error requesting location permissions 2' + JSON.stringify(error))
		});
	}

	myLocation() {
		this.geolocation.getCurrentPosition().then( resp => {
			console.log('resp', resp);
			this.latLng = {
				lat: resp.coords.latitude,
				lng: resp.coords.longitude
			}
		}).catch((error) => {
			console.log('Error getting location', error);
		});
	}

	async getPromotions() {
		this.homeService.getPromotions().then(response => {
			response.subscribe(data => {
				var array = [];
				data.product.forEach(row => {
					var price = row.price_with_iva + "";
					if (price.indexOf('.') > -1) {
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
		await this.homeService.getRestaurants().then( response => {
			response.subscribe( async data => {
				console.log('data', data);
				var res = [];

				for await (let i of Object.keys(data)) {
					var slider;

					var dist = this.distance(this.latLng.lat, this.latLng.lng, data[i].lat, data[i].lng)

					if (data[i].slider) {
						slider = data[i].slider[0].photo;
					} else {
						slider = "";
					}

					var a = { name: data[i].name, slider: slider, key: i, dist: dist, lat: data[i].lat, lng: data[i].lng };
					res.push(a);
				}

				if(this.latLng) {
					res.sort((a, b) => {
						var origLat = this.latLng.lat,
						origLong = this.latLng.lng;
					  
						return this.distance(origLat, origLong, a.lat, a.lng) - this.distance(origLat, origLong, b.lat, b.lng);
					});
	
					console.log('res', res);
					this.restaurants = res;
				}
			});
		});
	}

	async getProducts(id) {
		this.restaurantService.getProducts(id).then(response => {
			response.subscribe( async data => {
				console.log('data', data);
				
				let producto = data.products;
				var res = [];

				for await (let i of Object.keys(producto)) {
					var a = producto;
					res.push(a);
				}

				if(this.latLng) {
					res.sort((a, b) => {
						var origLat = this.latLng.lat,
						origLong = this.latLng.lng;
					  
						return this.distance(origLat, origLong, a.lat, a.lng) - this.distance(origLat, origLong, b.lat, b.lng);
					});
	
					console.log('res', res);
					this.products = res;
				}
			});
		});
	}

	async getBalance() {
		var uid = localStorage.getItem('uid');

		this.db.list('clientes/' + uid + '/accounts').valueChanges().subscribe(success => {
			let c: any = 0;
			success.forEach((row: any) => {
				c += parseFloat(row.value);
			});

			c = c.toFixed(2);

			if ((c.toString()).indexOf('.') > -1) {
				this.count = (c.toString()).split('.')[0];
				this.count2 = ((c.toString()).split('.')[1]);
			} else {
				this.count = c;
				this.count2 = '00';
			}
		}, error => {
			console.log('error', error);
		});

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

	showContain(id) {
		if (id == 0) {
			this.restaurantes = true;
			this.productos = false;
			this.getProducts('');
		} else {
			this.restaurantes = false;
			this.productos = true;
			this.getRestaurants();
		}
	}

	async goToProduct(id,idRestaurante) {
		this.router.navigate(['/detailsproduct/' + id + '/' + idRestaurante]);
	}

	distance(lat1: any, lon1: any, lat2: any, lon2: any) {
		/* var R = 6371;
		var dLat = (lat2 - lat1) * Math.PI / 180;
		var dLon = (lon2 - lon1) * Math.PI / 180;
		var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
			Math.cos(lat1 * Math.PI / 180 ) * Math.cos(lat2 * Math.PI / 180 ) *
			Math.sin(dLon/2) * Math.sin(dLon/2);
		var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
		var d = R * c;
		if (d>1) return Math.round(d)+"km";
		else if (d<=1) return Math.round(d*1000)+"m";
		return d;
 */

		var radlat1 = Math.PI * lat1 / 180;
		var radlat2 = Math.PI * lat2 / 180;
		var theta = lon1 - lon2;
		var radtheta = Math.PI * theta / 180;
		var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
		dist = Math.acos(dist);
		dist = dist * 180 / Math.PI;
		dist = dist * 60 * 1.1515;
		dist = dist * 1.609344;

		return dist;
	}

}
