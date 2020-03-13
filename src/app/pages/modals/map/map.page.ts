import { Component, OnInit, NgZone } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';
import { GoogleMaps, GoogleMap, GoogleMapsEvent, Marker, GoogleMapsAnimation, MyLocation, Geocoder, GeocoderResult, Environment } from '@ionic-native/google-maps';
import { ToastController, Platform, LoadingController } from '@ionic/angular';
import { until } from 'protractor';
import { NativeGeocoder, NativeGeocoderResult, NativeGeocoderOptions } from '@ionic-native/native-geocoder/ngx';
declare var google;

@Component({
	selector: 'app-map',
	templateUrl: './map.page.html',
	styleUrls: ['./map.page.scss'],
})

export class MapPage implements OnInit {

	map: GoogleMap;
	loading: any;
	address;
	address2;
	markerlatlong;
	direccion;
	url;
	private autoComplete = new google.maps.places.AutocompleteService();
	public resultado = new Array<any>();
	addreslength: string;
	opttps: NativeGeocoderOptions = {
		useLocale: true,
		maxResults: 5
	};
	showlist = false;
	test = false;

	constructor(
		public loadingCtrl: LoadingController,
		public toastCtrl: ToastController,
		private platform: Platform,
		private router: Router,
		private storage: Storage,
		private androidPermissions: AndroidPermissions,
		private locationAccuracy: LocationAccuracy,
		readonly ngZone: NgZone,
		private _location: Location,
		private nativeGeocoder: NativeGeocoder
    ) {
		this.showlist =false;
	}

	async ngOnInit() {
		this.url = localStorage.getItem('url');
		
		if(this.url == 'register') {
			await this.storage.get('addressClient').then(data=>{
				this.address = data;
				console.log(data);
			}).catch( error => {
				this.address = localStorage.getItem('streetClient');
			});
		} else if(this.url == 'home') {
			this.address = localStorage.getItem('streetClient');
		}

		await this.platform.ready().then(()=>{
			this.checkGPSPermission();
		});
	}
  
	async ionViewDidEnter(){}
	async ionViewDidLeave(){}
	async ionViewWillLeave() {}

	async loadMap() {
		Environment.setEnv({
			API_KEY_FOR_BROWSER_RELEASE: "AIzaSyBUhsxeoY9tYVFFD31lLygBdRROqHU7s6k",
			API_KEY_FOR_BROWSER_DEBUG: "AIzaSyBUhsxeoY9tYVFFD31lLygBdRROqHU7s6k"
		});

		this.map = GoogleMaps.create('map_canvas', {
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

	async loadMap2(lat, lng) {
		Environment.setEnv({
			API_KEY_FOR_BROWSER_RELEASE: "AIzaSyBUhsxeoY9tYVFFD31lLygBdRROqHU7s6k",
			API_KEY_FOR_BROWSER_DEBUG: "AIzaSyBUhsxeoY9tYVFFD31lLygBdRROqHU7s6k"
		});

		this.map = GoogleMaps.create('map_canvas', {
			camera: {
			target: {
				lat: lat,
				lng: lng
			},
			zoom: 18,
			tilt: 30
			}
		});

		await this.mapStart2({ lat: lat, lng: lng });
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
				this.addMarker(result[0]);
				this.geocoderMap(result[0]);
			});

			this.addMarker(location.latLng)
			this.geocoderMap(location.latLng);
		}).catch(err => {
			this.showToast(err.error_message);
		});
	}

	async mapStart2(LatLng) {
	//	console.log('LatLng', LatLng);

		this.map.clear();

			this.markerlatlong = LatLng;
			this.map.animateCamera({
				target: LatLng,
				zoom: 17,
				tilt: 30
			});

			this.map.on(GoogleMapsEvent.MAP_CLICK).subscribe((result) => {
				this.addMarker(result[0]);
				this.geocoderMap(result[0]);
			});

			this.addMarker(LatLng)
			this.geocoderMap(LatLng);

	}

	async addMarker(latLng) {
		console.log('latLng', latLng);
		this.map.clear().then(() => {
			this.map.addMarker({
				position: latLng,
				animation: GoogleMapsAnimation.DROP,
				draggable: true
			}).then(marker =>{
				marker.on(GoogleMapsEvent.MAP_CLICK).subscribe(() => {
					this.markerlatlong = marker.getPosition();
					this.geocoderMap(this.markerlatlong);
				});
			}).catch( error => {
				console.log('error', error);
			});
		}).catch( error => {
			console.log('error2', error);
		});
	}

	async showToast(message: string) {
		let toast = await this.toastCtrl.create({
			message: message,
			duration: 2000,
			position: 'middle'
		});

		toast.present();
	}

	async geocoderMap(latlng){
		let options = {
			position: latlng
		};
	
		await Geocoder.geocode(options).then( (results: GeocoderResult[])=>{
			console.log(results[0]);
			
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
			//	this.address = arr;
			});
		}).catch(error =>{
			this.showToast(error.error_message);
		})
	}

	save() {
		this.direccion.street = this.address;
		this.storage.set('directionClient', this.direccion);

		this.url = localStorage.getItem('urlClient');
		this.router.navigate(['register2']);

		/* if(this.url == 'register') {
			this.router.navigate(['register1']);
		} else if (this.url == 'home') {
			this.authService.updateAddress(this.direccion).then((res) => {
				res.subscribe( res => {
					this.platform.backButton.observers.pop();
					
				}, err => {
					console.error(err);
				})
			}).catch(error => {
				console.error(error);
			});
		} */
	}
  
	async closeModal() {
		this.platform.backButton.observers.pop();

		if(this.url == 'register') {
			this.router.navigate(['register2']);
		} else if (this.url == 'home') {
			this.router.navigate(['home']);
		} else if(this.url == 'perfil') {
			this.router.navigate(['perfil']);
		}
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

	busqueda(e) {
		console.log('busqueda');
		this.test = true;

		this.autoComplete.getPlacePredictions({ input: this.address }, predictions => {
			this.showlist = true;
			//console.log('predictions', predictions);
			this.resultado = predictions;
		//	console.log(this.resultado);
			
		});
	}

	busqueda2(e) {
		if(this.test) {
			this.test = false;
		} else {
		//	console.log('busqueda2');
			this.showlist = false;
		}
	}

	seleccionarDireccion(trae) {
		this.resultado = [];
		this.address2 = '';
		this.showlist = false;
		this.address = trae.description;
		let array = trae.terms;
		console.log(trae);

		if (array.length == 3) {
			let array = trae.terms;
		}
		if (array.length == 4) {
			this.addreslength = '';
		}

		this.getLatLong();
	}

	async getLatLong() {
		this.nativeGeocoder.forwardGeocode(this.address, this.opttps).then( (result: NativeGeocoderResult[]) => {
			console.log('result', result[0]);
			console.log('The coordinates are latitude=' + result[0].latitude + ' and longitude=' + result[0].longitude);
			
			var data = {
				lat: parseFloat(result[0].latitude),
				lng: parseFloat(result[0].longitude)
			}

			this.mapStart2(data);
		}).catch( (error: any) => { 
			console.log(error)
		});
	}
}
