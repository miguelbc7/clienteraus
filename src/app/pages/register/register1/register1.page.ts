import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';
import { MyLocation, Geocoder, GoogleMap, GoogleMaps, GeocoderResult, LocationService } from '@ionic-native/google-maps';
import { Location } from '@angular/common'

@Component({
	selector: 'app-register1',
	templateUrl: './register1.page.html',
	styleUrls: ['./register1.page.scss'],
	encapsulation: ViewEncapsulation.None
})

export class Register1Page implements OnInit {

	public register1: FormGroup;
	validation_messages = {
		'name': [
			{ type: 'required', message: 'Debe ingresar un nombre.' },
			{ type: 'maxlength', message: 'Debe ser menor de 30 caracteres.' }
		],
		'lastname': [
			{ type: 'required', message: 'Debe ingresar un apellido.' },
			{ type: 'maxlength', message: 'Debe ser menor de 30 caracteres.' }
		],
		'dni': [
			{ type: 'required', message: 'Debe ingresar un DNI.' },
			{ type: 'maxlength', message: 'Debe ser menor de 20 caracteres.' }
		],
		'birthdate': [
			{ type: 'required', message: 'Debe ingresar una fecha de nacimiento.' },
		]
	}

	constructor(
		private _location: Location,
		public formBuilder: FormBuilder,
		private router: Router,
		private androidPermissions: AndroidPermissions,
		private locationAccuracy: LocationAccuracy,
	) {

		this.pull()
		this.register1 = formBuilder.group({
			name: ['', Validators.compose([
				Validators.required,
				Validators.maxLength(30)
			])],
			lastname: ['', Validators.compose([
				Validators.required,
				Validators.maxLength(30)
			])],
			dni: ['', Validators.compose([
				Validators.required,
				Validators.maxLength(20)
			])],
			birthdate: ['', Validators.compose([
				Validators.required,
			])]
		});
	}

	ngOnInit() {
		this.checkGPSPermission();
		this.pull()
	}

	back() {
		this.router.navigate(['login']);
	}
	checkGPSPermission() {
		console.log('checkGPSPermission');
		this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION).then(
			result => {
				if (result.hasPermission) {

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

			} else {
				this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION).then(() => {
					this.askToTurnOnGPS();
				}, error => {
					console.error('requestPermission Error requesting location permissions 1' + error)
				});
			}
		});
	}

	askToTurnOnGPS() {
		console.log('askToTurnOnGPS');
		this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(() => {

		}, error => {
			console.error('Error requesting location permissions 2' + JSON.stringify(error))
		});
	}

	onSubmit(values) {
		localStorage.setItem('name', this.register1.value.name);
		localStorage.setItem('lastname', this.register1.value.lastname);
		localStorage.setItem('dni', this.register1.value.dni);
		localStorage.setItem('birthdate', this.register1.value.birthdate);

	//	this.register1.reset();
		this.router.navigate(["/register2"]);
	}

	name: string;
	lastname: string;
	dni: string;
	birthdate: string;
	disable: boolean ;
	pull() {
		let name = localStorage.getItem('name');
		let lastname = localStorage.getItem('lastname');
		let dni = localStorage.getItem('dni');
		let birthdate = localStorage.getItem('birthdate');
		this.name = name;
		this.lastname = lastname;
		this.dni = dni;
		this.birthdate = birthdate;
		this.register1
	
		
		if (this.name && this.lastname && this.dni && this.birthdate) {
			this.disable = false;
	
			
		}





	}
async	ionViewWillEnter() {
	await	this.pull();
	}
}
