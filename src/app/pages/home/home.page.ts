import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { HomeserviceService } from '../../services/homeservice.service';
import { AngularFireAuth } from '@angular/fire/auth';
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
import { ExplorarPage } from '../modals/explorar/explorar.page';
import { parse } from 'querystring';

@Component({
	selector: 'app-home',
	templateUrl: './home.page.html',
	styleUrls: ['./home.page.scss'],
})

export class HomePage implements OnInit {
	products: any;
	restaurantes: boolean = false;
	productos: boolean = true;
	id: any;
	uid: any;
	restaurantid: any;
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
	name;
	status: any = {
		comer: false,
		salud: false,
		cuidado: false,
		fuel: false,
		entretenimiento: false,
		kids: false,
		deporte: false,
		viajes: false,
		alimentos: false,
		transporte: false
	}

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
	) { }

	async ngOnInit() { }

	async notificaciones() {
		this.router.navigate(['/notifications']);
	}

	async cart() {
		this.router.navigate(['/cart']);
	}

	async explorar() {
		console.log('status', this.status);
		const modal = await this.modalController.create({
			component: ExplorarPage,
			componentProps: {
				status: this.status
			},
			cssClass: 'modalExplorar',
		});

		modal.onDidDismiss().then((data: any) => {
			console.log('data', data.data);
			this.status = data.data;
			this.getRestaurants();
		});

		return await modal.present();
	}

	ionViewWillEnter() {
		this.id = this.route.snapshot.params.id;
		this.restaurantid = this.route.snapshot.params.restaurant;
		this.uid = localStorage.getItem('uid');

		this.callFunctions();
	}

	callFunctions() {
		this.checkGPSPermission();
		this.getName();
		this.checkGPSPermission();
		this.getBalance();
		this.getPromotions();
		this.getRestaurants();
		this.getProducts('');
	}

	getName() {
		this.db.object('clientes/' + this.uid).valueChanges().subscribe((success: any) => {
			var name = success['name'];
			var lastname = success['lastname'];
			this.name = name + ' ' + lastname;
		}, error => {
			console.log('error', error);
		});
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
		this.geolocation.getCurrentPosition().then(resp => {
			this.latLng = {
				lat: resp.coords.latitude,
				lng: resp.coords.longitude
			}

			this.getName();
			this.getBalance();
			this.getPromotions();
			this.getRestaurants();
			this.getProducts('');
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
		await this.homeService.getRestaurants().then(response => {
			response.subscribe(async data => {

				var res = [];

				var st = [];
				var sta: any = this.status;

				//	console.log('sta', sta);

				if (sta.comer) {
					st.push('#Comer');
				} else if (sta.salud) {
					st.push('#Salud');
				} else if (sta.cuidado) {
					st.push('#Cuidado');
				} else if (sta.fuel) {
					st.push('#Fuel');
				} else if (sta.entretenimiento) {
					st.push('#Entretenimiento');
				} else if (sta.kids) {
					st.push('#kids');
				} else if (sta.deporte) {
					st.push('#Deporte');
				} else if (sta.viajes) {
					st.push('#Viajes');
				} else if (sta.alimentos) {
					st.push('#Alimentos');
				} else if (sta.transporte) {
					st.push('#Transporte');
				}

				for await (let i of Object.keys(data)) {
					var slider;
					console.log(data[i].estatus);

					if (data[i].estatus == 1) {



						if (this.latLng) {
							var dist = this.distance(this.latLng.lat, this.latLng.lng, data[i].lat, data[i].lng);
						    var dist2=	dist.toFixed(2);
							
							
						} else {
							var dist = 0;
						}

						if (data[i].slider) {
							slider = data[i].slider[0].photo;
						} else {
							slider = "";
						}

						var cate = data[i].categories;
						var cat = [];

						if (st.length > 0) {
							console.log('a');
							//	console.log(Object.keys(cate));

							for (var c of Object.keys(cate)) {
								if (st.indexOf(cate[c].name) > -1) {
									cat.push(cate[c].name);
									var a = { name: data[i].name, slider: slider, key: i, dist: dist2, lat: data[i].lat, lng: data[i].lng, categories: cat };
									//	console.log(a);

									res.push(a);

								}
							}
						} else {
							//	console.log('b');
							for (var c of Object.keys(cate)) {
								cat.push(cate[c].name);
							}

							var a = { name: data[i].name, slider: slider, key: i, dist: dist2, lat: data[i].lat, lng: data[i].lng, categories: cat };
							res.push(a);
						}
					}

					if (this.latLng) {
						res.sort((a, b) => {
							var origLat = this.latLng.lat,
								origLong = this.latLng.lng;

							return this.distance(origLat, origLong, a.lat, a.lng) - this.distance(origLat, origLong, b.lat, b.lng);
						});

						this.restaurants = res;
					} else {
						console.log('else',res);
						
						this.restaurants = res;
					}

					//	console.log('res', res);
				}
			});
		});
	}

	async getProducts(id) {
		

			this.restaurantService.getProducts(id).then(response => {
				response.subscribe(async data => {
				let	producto = data.products;
				console.log('tortugo',producto);
				
					var res = [];
					for await (let i of Object.keys(producto)) {
						var price1, price2;
						

					

							console.log(producto[i].status, 'statussss');

							if (producto[i].status == true) {

								if ((producto[i].price_with_iva).toString().indexOf('.') > -1) {
									price1 = (producto[i].price_with_iva.toString()).split('.')[0];
									price2 = (producto[i].price_with_iva.toString()).split('.')[1];
								} else {
									price1 = producto[i].price_with_iva;
									price2 = '00';
								}
								console.log('allanbrito',producto[i].id_restaurant);
								  
								var a = { images: producto[i].images, name: producto[i].name, price1: price1, price2: price2, description: producto[i].description,_id:producto[i]._id,id_restaurant:producto[i].id_restaurant};
								res.push(a);
							}

							if (this.latLng) {
								res.sort((a, b) => {
									var origLat = this.latLng.lat,
										origLong = this.latLng.lng;

									return this.distance(origLat, origLong, a.lat, a.lng) - this.distance(origLat, origLong, b.lat, b.lng);
								});
								
									
								this.products = res;
							
								
							} else {

									
								this.products = res;
							}
						
					}
				});
			});
		
	}

	getBalance() {
		var uid = localStorage.getItem('uid');

		this.db.list('clientes/' + uid + '/accounts').valueChanges().subscribe(success => {
			let c: any = 0;
			success.forEach((row: any) => {
				c += parseFloat(row.value);
			});

			c = c.toFixed(2);

			console.log('c2', c);

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
			componentProps: {
				restaurants: this.restaurants
			},
			cssClass: 'calculate'
		});

		return await modal.present();
	}

	async goToRestaurant(id) {
	//	console.log(id);
		
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

	async goToProduct(id, idRestaurante) {
		
		
		console.log("victici",id,idRestaurante);
		
		this.router.navigate(['/detailsproduct/' + id + '/' + idRestaurante]);
	}

	distance(lat1: any, lon1: any, lat2: any, lon2: any) {
		var radlat1 = Math.PI * lat1 / 180;
		var radlat2 = Math.PI * lat2 / 180;
		var theta = lon1 - lon2;
		var radtheta = Math.PI * theta / 180;
		var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
	
		
		dist = Math.acos(dist);
		dist = dist * 180 / Math.PI;
		dist = dist * 60 * 1.1515;
		dist = dist * 1.609344;
	
				
				
		return    dist ;
	}

	doRefresh(event, type) {
		console.log('Begin async operation');

		setTimeout(() => {
			console.log('Async operation has ended');
			this.callFunctions();

			if (type == 1) {
				event.target.complete();
			}
		}, 2000);
	}

}
