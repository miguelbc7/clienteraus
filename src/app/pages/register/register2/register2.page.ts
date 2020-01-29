import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';
import { MyLocation, Geocoder, GoogleMap, GoogleMaps, GeocoderResult, LocationService } from '@ionic-native/google-maps';

@Component({
	selector: 'app-register2',
	templateUrl: './register2.page.html',
	styleUrls: ['./register2.page.scss'],
})

export class Register2Page implements OnInit {

	public register2: FormGroup;
	direction;
	address;
	country;
	city;
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
        	{ type: 'maxlength', message: 'Debe ser menor de 20 caracteres.' }
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
			  	Validators.required,
			  	Validators.maxLength(20)
			])],
			zipcode: ['', Validators.compose([
				Validators.required,
				Validators.maxLength(20)
			])]
		});
  	}

	ngOnInit() {
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
		).catch( error => {
			console.log('error', error);
		});
	}

	requestGPSPermission() {
		console.log('requestGPSPermission');
		this.locationAccuracy.canRequest().then((canRequest: boolean) => {
			if (canRequest) {
				console.log("4");
				this.myLocation()
			} else {
				this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION).then( () => {
					console.log('go to ask permissions');
					this.askToTurnOnGPS();
				}, error => {
					console.error('requestPermission Error requesting location permissions 1' + error)
				});
			}
		});
	}

	askToTurnOnGPS() {
		console.log('askToTurnOnGPS');
		this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then( () => {
			console.log('go to my location');
			this.myLocation()
		}, error => { 
			console.error('Error requesting location permissions 2' + JSON.stringify(error))
		});
	}

	myLocation(){
		console.log('myLocation');
		LocationService.getMyLocation().then((myLocation: MyLocation) => {
			this.geocoderMap(myLocation.latLng);
		});
	}

	geocoderMap(latlng){
		console.log('geocoderMap');
		let options = {
			position: latlng
		};

		Geocoder.geocode(options).then( (results: GeocoderResult[])=>{
			console.log('result', results)
			/* this.direction = results[0];
			this.direction.extra.lines.pop();
			this.address = this.direction.extra.lines.join(', '); */
			this.country = results[0].country;
			this.city = results[0].locality;
			if(results[0].thoroughfare) {
				this.address = results[0].thoroughfare;
			}
		}).catch(error =>{
			console.error(error);
		})
	}

	onSubmit(values){
    	localStorage.setItem('country', this.register2.value.country);
    	localStorage.setItem('city', this.register2.value.city);
    	localStorage.setItem('address', this.register2.value.address);
		localStorage.setItem('zipcode', this.register2.value.zipcode);
		
    	this.router.navigate(["/register3"]);
	}
}
