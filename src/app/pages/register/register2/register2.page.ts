import { Component, OnInit, NgZone } from '@angular/core';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';
import { MyLocation, Geocoder, GoogleMap, GoogleMaps, GeocoderResult, LocationService } from '@ionic-native/google-maps';
import { Storage } from '@ionic/storage';
import { NativeGeocoder, NativeGeocoderResult, NativeGeocoderOptions } from '@ionic-native/native-geocoder/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { HomeserviceService } from "../../../services/homeservice.service";
import { Location } from '@angular/common'

declare let google: any;

@Component({
	selector: 'app-register2',
	templateUrl: './register2.page.html',
	styleUrls: ['./register2.page.scss'],
})

export class Register2Page implements OnInit {

	public register2: FormGroup;
	direction;
	address;
	address2 = 'a';
	country;
	city;
	dir;
	zipcode;
	latlng;
	showlist = false;
	test = false;
	opttps: NativeGeocoderOptions = {
		useLocale: true,
		maxResults: 5
	};
	private autoComplete = new google.maps.places.AutocompleteService();
	public resultado = new Array<any>();
	addreslength: string;
	validation_messages = {
		'country': [
			{ type: 'required', message: 'Debe ingresar un país.' },
			{ type: 'maxlength', message: 'Debe ser menor de 30 caracteres.' }
		],
		'city': [
			{ type: 'required', message: 'Debe ingresar una ciudad.' },
			{ type: 'maxlength', message: 'Debe ser menor de 30 caracteres.' }
		],
		'address': [
			{ type: 'required', message: 'Debe ingresar una dirección.' },
		],
		'zipcode': [
			{ type: 'required', message: 'Debe ingresar un código postal.' },
			{ type: 'maxlength', message: 'Debe ser menor de 20 caracteres.' }
		]
	}

	constructor(
		private _location: Location,
		public formBuilder: FormBuilder,
		public router: Router,
		private androidPermissions: AndroidPermissions,
		private locationAccuracy: LocationAccuracy,
		private modalController: ModalController,
		readonly ngZone: NgZone,
		private storage: Storage,
		private nativeGeocoder: NativeGeocoder,
		private geolocation: Geolocation,
		private mapita: HomeserviceService,
	) {
		this.myLocation();
		this.register2 = formBuilder.group({
			country: ['', Validators.compose([
				Validators.required,
				Validators.maxLength(30)
			])],
			city: ['', Validators.compose([
				Validators.required,
				Validators.maxLength(30)
			])],
			address: ['', Validators.compose([
				Validators.required
			])],
			zipcode: ['', Validators.compose([
				Validators.required,
				Validators.maxLength(20)
			])]
		});
	}

	async ngOnInit() {}

	async ionViewWillEnter() {
		this.checkGPSPermission();
	}

	back() {
		//	this. _location.back()
		this.router.navigate(['register1']);
	}
	
	checkGPSPermission() {
		console.log('checkGPSPermission');

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
				this.storage.get('directionClient').then(data => {
					if (data) {
						data.extra.lines.pop();
						//	console.log('data', data);
						this.dir = data;
						this.address = data.street;
						this.zipcode = data.postalCode;
						this.country = data.country;
						this.city = data.locality;
						this.storage.remove('directionClient').then(success => {
							console.log('success', success);
						}).catch(error => {
							console.log('error', error);
						});
					} else {
						this.myLocation();
					}
				});
			} else {
				console.log('storage2');
				this.storage.get('directionClient').then(data => {
					if (data) {
						data.extra.lines.pop();
						//	console.log('data', data);
						this.dir = data;
						this.address = data.street;
						this.zipcode = data.postalCode;
						this.country = data.country;
						this.city = data.locality;
						this.storage.remove('directionClient').then(success => {
							console.log('success', success);
						}).catch(error => {
							console.log('error', error);
						});
					} else {
						this.myLocation();
					}
				});
			}
		});
	}

	askToTurnOnGPS() {
		//	console.log('askToTurnOnGPS');

		this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(() => {
			//	console.log('go to my location');
			this.storage.get('directionClient').then(data => {
				if (data) {
					data.extra.lines.pop();
					//	console.log('data', data);
					this.dir = data;
					this.address = data.street;
					this.zipcode = data.postalCode;
					this.country = data.country;
					this.city = data.locality;
					this.storage.remove('directionClient').then(success => {
						//console.log('success', success);
					}).catch(error => {
						console.log('error', error);
					});
				} else {
					this.myLocation();
				}
			});
		}, error => {
			console.error('Error requesting location permissions 2' + JSON.stringify(error))
		});
	}

	myLocation() {

		this.showlist = true;
		this.geolocation.getCurrentPosition().then((resp) => {
			var latLng = {
				lat: resp.coords.latitude,
				lng: resp.coords.longitude
			}
			var key = "AIzaSyBUhsxeoY9tYVFFD31lLygBdRROqHU7s6k"

			this.mapita.getDireccion(latLng.lat, latLng.lng, key).subscribe((trae) => {
				let conteo = trae.results[0].address_components.length
				// console.log(conteo);

				let zi = trae.results[0].address_components[conteo - 1].long_name;
				this.zipcode = zi;
				let g = [];

				for (let index = 0; index < trae.results.length; index++) {


					g.push(trae.results[index].formatted_address);

					this.resultado = g;
					//	console.log(this.resultado);


					this.latlng = latLng;
					this.geocoderMap(latLng, g);

				}

			})

		}).catch((error) => {
			console.log('Error getting location', error);
		});
	}

	geocoderMap(latlng, g) {
		let options = {
			position: latlng
		};
		this.address = g;
	}

	onSubmit(values) {
		localStorage.setItem('country', this.register2.value.country);
		localStorage.setItem('city', this.register2.value.city);
		localStorage.setItem('address', this.register2.value.address);
		localStorage.setItem('zipcode', this.register2.value.zipcode);

		this.router.navigate(["/register3"]);
	}

	async getMap() {
		localStorage.setItem('url', 'register');
		this.router.navigate(['map', JSON.stringify(this.latlng)]);
	}


	busqueda() {
		this.test = true;

		if (!this.address.trim().length) return;

		this.autoComplete.getPlacePredictions({ input: this.address }, predictions => {
			let gas = [];
			for (let index = 0; index < predictions.length; index++) {
				const element = predictions[index];
				gas.push(element.description);
				this.showlist = true;
				this.resultado = gas;
			}
		})
	}

	busqueda2(e) {
		if (this.test) {
			this.test = false;
		}
	}

	async getZipCode() {
		await this.nativeGeocoder.forwardGeocode(this.address, this.opttps).then((result: NativeGeocoderResult[]) => {
			this.zipcode = result[0].postalCode;
		}).catch((error: any) => {
			//	console.log(error)
		});
	}

	seleccionarDireccion(trae) {
		this.resultado = [];
		this.address2 = '';
		this.showlist = false;
		this.address = trae.description;

		this.geolocation.getCurrentPosition().then((resp) => {
			var latLng = {
				lat: resp.coords.latitude,
				lng: resp.coords.longitude
			}
			var key = "AIzaSyBUhsxeoY9tYVFFD31lLygBdRROqHU7s6k";
			this.mapita.getDireccion2(trae, key).subscribe((trae) => {
				let lat = trae.results[0].geometry.location.lat;
				let lng = trae.results[0].geometry.location.lng;

				this.mapita.getDireccion(lat, lng, key).subscribe((trae) => {
					let conteo = trae.results[0].address_components.length
					let zi = trae.results[0].address_components[conteo - 1].long_name;
					this.zipcode = zi;

				});
			});
		});

		let vale = trae.split(',');
		if (trae.split(',').length == 3) {
			this.country = vale[2];
			this.city = vale[1];
			this.address = vale[0];
		}
		if (trae.split(',').length == 4) {
			this.city = vale[2];
			this.country = vale[3];
			this.address = vale[0] + vale[1];
		}
	}
}
