import { Component, OnInit, ViewEncapsulation, Input, NgZone } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireDatabase } from '@angular/fire/database';
import { RestaurantService } from '../../services/restaurant.service';
import { Router } from '@angular/router';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';
import { Platform } from '@ionic/angular';
import { GoogleMaps, GoogleMap, GoogleMapsEvent, Marker, GoogleMapsAnimation, MyLocation, Geocoder, GeocoderResult, Environment } from '@ionic-native/google-maps';
import * as moment from "moment";

@Component({
	selector: 'app-detalles-restaurantes',
	templateUrl: './detalles-restaurantes.page.html',
	styleUrls: ['./detalles-restaurantes.page.scss'],
	encapsulation: ViewEncapsulation.None,
})

export class DetallesRestaurantesPage implements OnInit {

	id: any;
	restaurant: any;
	schedules: any;
	products: any;
	map: GoogleMap;
	markerlatlong;
	address;
	direccion;
	showShedule = false;
	days: any[] = [
		{ 
			"name": "Lunes",
			"status": false,
			"schedules": []
		},
		{
			"name": "Martes",
			"status": false,
			"schedules": []
		},
		{
			"name": "Miercoles",
			"status": false,
			"schedules": []
		},
		{
			"name": "Jueves",
			"status": false,
			"schedules": []
		},
		{
			"name": "Viernes",
			"status": false,
			"schedules": []
		},
		{
			"name": "Sabado",
			"status": false,
			"schedules": []
		},
		{
			"name": "Domingo",
			"status": false,
			"schedules": []
		}
	]

  	constructor(
		private db: AngularFireDatabase,
		private firebaseAuth: AngularFireAuth,
		private route: ActivatedRoute,
		private restaurantService: RestaurantService,
		private router: Router,
		private androidPermissions: AndroidPermissions,
		private locationAccuracy: LocationAccuracy,
		private platform: Platform,
		readonly ngZone: NgZone
	) {}

  	async ngOnInit() {
		const options = {
			slidesPerView: 1,
			slidesPerColumn: 1,
			slidesPerGroup: 1,
			watchSlidesProgress: true,
			resistanceRatio: 0,
			spaceBetween: 0,
			centeredSlides: false,
			virtualTranslate: true,
		};

		await this.platform.ready().then(()=>{
			this.checkGPSPermission();
		});

		this.id = this.route.snapshot.params.id;
		this.getRestaurant(this.route.snapshot.params.id);
		this.getSchedule(this.route.snapshot.params.id);
		this.getProducts(this.route.snapshot.params.id);
	}
	 
	async getRestaurant(id) {

		console.log({"victor":id});
		
		var res = this.db.object('restaurantes/' + id).valueChanges().subscribe( data => {
			this.restaurant = data;

		//	console.log(data);
			
		}, error => {
			console.log('error', error);
		}, () => {
			console.log('completed');
		});
	}

	async getSchedule(id) {
		this.restaurantService.getSchedules(id).then( response => {
			response.subscribe( data => {
				var arr = [];

				if(Object.keys(data.schedules).length > 0) {
					data.schedules.schedules.forEach( row => {
						var arr2 = [];
	
						for(let s in row.schedules) {
							var b = { start: row.schedules[s].start, end: row.schedules[s].end };
							arr2.push(b);
						}

						var a = { name: row.name, status: row.status, schedules: arr2 }
						arr.push(a);
					});
				}

				this.schedules = arr;
			});
		});
	}

	async getProducts(id) {
		this.restaurantService.getProducts(id).then( response => {
			response.subscribe( data => {
				this.products = data.products;
			});
		});
	}

	changeTime(val) {
		var a = new Date(val);
		var hour = a.getHours();
		var minute = a.getMinutes();
		var seconds = a.getSeconds();
		var date = hour + ':' + minute + ':' + seconds;
	
		return date;
	}

	async goToProduct(id) {
		this.router.navigate(['/detailsproduct/' + id + '/' + this.id]);
	}

	async loadMap() {
		console.log('loadmap')
		Environment.setEnv({
			API_KEY_FOR_BROWSER_RELEASE: "AIzaSyBUhsxeoY9tYVFFD31lLygBdRROqHU7s6k",
			API_KEY_FOR_BROWSER_DEBUG: "AIzaSyBUhsxeoY9tYVFFD31lLygBdRROqHU7s6k"
		});

		this.map = GoogleMaps.create('map_canvas2', {
			camera: {
			target: {
				lat: 43.0741704,
				lng: -89.3809802
			},
			zoom: 18,
			tilt: 30
			}
		});

		await this.mapStart();
	}

	async mapStart() {
		this.map.clear();

		this.map.getMyLocation().then((location: MyLocation) => {
			this.markerlatlong = location.latLng;
			this.map.animateCamera({
			target: location.latLng,
			zoom: 17,
			tilt: 30
			});

			this.map.on(GoogleMapsEvent.MAP_CLICK).subscribe((result) => {
				console.log('result', result);

				this.addMarker(result[0]);
				this.geocoderMap(result[0]);
			});

			this.addMarker(location.latLng)
			this.geocoderMap(location.latLng);
		}).catch(err => {
			/* this.showToast(err.error_message); */
		});
	}

	async addMarker(latLng) {
		this.map.clear().then(() => {
			this.map.addMarker({
			position: latLng,
			animation: GoogleMapsAnimation.DROP,
			}).then(marker =>{
				marker.on(GoogleMapsEvent.MAP_CLICK).subscribe(() => {
					this.markerlatlong = marker.getPosition();
					this.geocoderMap(this.markerlatlong);
				});

			});
		});
	}

	async geocoderMap(latlng){
		let options = {
			position: latlng
		};
	
		await Geocoder.geocode(options).then( (results: GeocoderResult[])=>{
			this.direccion = results[0];
			this.direccion.extra.lines.pop();
			results[0].extra.lines.pop();

			if(results[0].subThoroughfare) {
				var subThoroughfare = results[0].subThoroughfare;
			} else {
				var subThoroughfare = '';
			}

			if(results[0].thoroughfare) {
				var thoroughfare = results[0].thoroughfare;
			} else {
				var thoroughfare = '';
			}

			if(results[0].locality) {
				var locality = results[0].locality;
			} else {
				var locality = '';
			}

			if(results[0].subAdminArea) {
				var subAdminArea = results[0].subAdminArea;
			} else {
				var subAdminArea = '';
			}

			if(results[0].adminArea) {
				var adminArea = results[0].adminArea;
			} else {
				var adminArea = '';
			}
			
			var add = subThoroughfare + ' ' + thoroughfare + ' ' + locality + ' ' + subAdminArea + ' ' + adminArea;
			var add2 = add.split(' ');
			var x = (names) => names.filter((v,i) => names.indexOf(v) === i)
			var unique = x(add2);
			var arr = unique.join(' ');

			this.ngZone.run(() => {
				this.address =  arr;
			});
		}).catch(error =>{
			/* this.showToast(error.error_message); */
		})
	}

	async checkGPSPermission() {
		this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION).then( result => {
				if (result.hasPermission) {
					this.askToTurnOnGPS();
				} else {
					this.requestGPSPermission();
				}
			}, err => {
				console.error(err);
			}
		);
	}

	async requestGPSPermission() {
		this.locationAccuracy.canRequest().then((canRequest: boolean) => {
			if (canRequest) {
				console.log("4");
			} else {
				this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION).then( () => {
					this.askToTurnOnGPS();
				}, error => {
					console.error('requestPermission Error requesting location permissions 1' + error)
				});
			}
		});
	}
	
	async askToTurnOnGPS() {
		this.loadMap();
	}

	async cart() {
		this.router.navigate(['/cart']);
	}
}
