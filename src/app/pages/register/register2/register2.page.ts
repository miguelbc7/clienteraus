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
		public formBuilder: FormBuilder,
		public router: Router,
		private androidPermissions: AndroidPermissions,
		private locationAccuracy: LocationAccuracy,
		private modalController: ModalController,
		readonly ngZone: NgZone,
		private storage: Storage,
		private nativeGeocoder: NativeGeocoder,
		private geolocation: Geolocation
	) {
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

	async ngOnInit() {

	}

	async ionViewWillEnter() {
		this.checkGPSPermission();
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
		console.log('requestGPSPermission');

		this.locationAccuracy.canRequest().then((canRequest: boolean) => {
			if (canRequest) {
				console.log('storage1');
				this.storage.get('directionClient').then(data => {
					if (data) {
						data.extra.lines.pop();
						console.log('data', data);
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
						console.log('data', data);
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
		console.log('askToTurnOnGPS');

		this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(() => {
			console.log('go to my location');
			this.storage.get('directionClient').then(data => {
				if (data) {
					data.extra.lines.pop();
					console.log('data', data);
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
		}, error => {
			console.error('Error requesting location permissions 2' + JSON.stringify(error))
		});
	}

	myLocation() {
		console.log('myLocation');
		
		this.geolocation.getCurrentPosition().then((resp) => {
			var latLng = {
				lat: resp.coords.latitude,
				lng: resp.coords.longitude
			}

			this.latlng = latLng;
			this.geocoderMap(latLng);
		}).catch((error) => {
			console.log('Error getting location', error);
		});

		/* LocationService.getMyLocation().then((myLocation: MyLocation) => {
			this.geocoderMap(myLocation.latLng);
		}); */
	}

	geocoderMap(latlng) {
		console.log('geocoderMap');

		let options = {
			position: latlng
		};

		Geocoder.geocode(options).then((results: GeocoderResult[]) => {
			console.log('result', results);

			this.country = results[0].country;
			this.city = results[0].locality;
			if (results[0].thoroughfare) {

				if(results[1].extra.featureName) {
					this.address = results[0].thoroughfare + ' ' + results[1].extra.featureName;
				} else {
					this.address = results[0].thoroughfare;
				}
			}
		}).catch(error => {
			console.error(error);
		});
	}

	onSubmit(values) {
		localStorage.setItem('country', this.register2.value.country);
		localStorage.setItem('city', this.register2.value.city);
		localStorage.setItem('address', this.register2.value.address);
		localStorage.setItem('zipcode', this.register2.value.zipcode);

		this.register2.reset();
		this.router.navigate(["/register3"]);
	}

	async getMap() {
		localStorage.setItem('url', 'register');
		this.router.navigate([ 'map', JSON.stringify(this.latlng) ]);
	}
	

	busqueda(e) {
		console.log('busqueda');
		this.test = true;

		if (!this.address.trim().length) return;

		console.log('address', this.address);

		this.autoComplete.getPlacePredictions({ input: this.address2 }, predictions => {
			this.showlist = true;
			this.resultado = predictions;
		})
	}

	busqueda2(e) {
		if(this.test) {
			this.test = false;
		} else {
			console.log('busqueda2');
			this.showlist = false;
		}
	}

	async getZipCode() {
		this.nativeGeocoder.forwardGeocode(this.address, this.opttps).then( (result: NativeGeocoderResult[]) => {
			console.log('result', result[0]);
			console.log('The coordinates are latitude=' + result[0].latitude + ' and longitude=' + result[0].longitude);
			this.zipcode = result[0].postalCode;
		}).catch( (error: any) => { 
			console.log(error)
		});
	}

	seleccionarDireccion(trae) {
		this.resultado = [];
		this.address2 = '';
		this.showlist = false;
		this.address = trae.description;
		console.log(trae);

		let array = trae.terms;

		if (array.length == 3) {
			let array = trae.terms;
			this.country = array[2].value;
			this.city = array[1].value;
			this.addreslength = '';
		}
		if (array.length == 4) {
			let array = trae.terms;
			this.city = array[2].value;
			this.country = array[3].value;
			this.addreslength = '';
		}

		this.getZipCode();
	}
}
