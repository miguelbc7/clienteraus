import { Component, OnInit, NgZone } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';
import { GoogleMaps, GoogleMap, GoogleMapsEvent, Marker, GoogleMapsAnimation, MyLocation, Geocoder, GeocoderResult, Environment } from '@ionic-native/google-maps';
import { ToastController, Platform, LoadingController } from '@ionic/angular';
import { until } from 'protractor';

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
	markerlatlong;
	direccion;
	url;

	constructor(
		private modalCtrl: ModalController,
		public loadingCtrl: LoadingController,
		public toastCtrl: ToastController,
		private platform: Platform,
		private router: Router,
		private storage: Storage,
		private androidPermissions: AndroidPermissions,
		private locationAccuracy: LocationAccuracy,
		readonly ngZone: NgZone
    ) {}

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

	async mapStart() {
		this.map.clear();

		this.map.getMyLocation().then((location: MyLocation) => {
			this.markerlatlong = location.latLng;
			this.map.animateCamera({
			target: location.latLng,
			zoom: 17,
			tilt: 30
			});

			this.map.on(GoogleMapsEvent.MAP_CLICK)
			.subscribe((result) => {
			console.log('result', result);

			this.addMarker(result[0]);
			this.geocoderMap(result[0]);
			});

			this.addMarker(location.latLng)
			this.geocoderMap(location.latLng);
		}).catch(err => {
			this.showToast(err.error_message);
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
			this.showToast(error.error_message);
		})
	}

	save() {
		this.direccion.street = this.address;
		this.storage.set('directionClient', this.direccion);

		this.url = localStorage.getItem('urlClient');

		/* if(this.url == 'register') {
			this.router.navigate(['register1']);
		} else if (this.url == 'home') {
			this.authService.updateAddress(this.direccion).then((res) => {
				res.subscribe( res => {
					this.platform.backButton.observers.pop();
					this.router.navigate(['home']);
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
}
