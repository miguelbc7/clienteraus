import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ToastController } from '@ionic/angular';
import { BaseSuccessPage } from '../../modals/base-success/base-success.page';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from '@angular/fire/database';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';
import { MyLocation, Geocoder, GoogleMap, GoogleMaps, GeocoderResult, LocationService } from '@ionic-native/google-maps';

@Component({
	selector: 'app-agregar-familia',
	templateUrl: './agregar-familia.page.html',
	styleUrls: ['./agregar-familia.page.scss'],
})

export class AgregarFamiliaPage implements OnInit {
	
	uid;
	country;
	city;
	address;
	passwordType: string = "password";
  	passwordShown: boolean = false;
  	passwordType2: string = "password";
	passwordShown2: boolean = false;
	public register: FormGroup;
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
		  ],
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
      	],
    	'email': [
			{ type: 'required', message: 'Correo requerido' },
			{ type: 'minlength', message: 'Debe ser mayor de 5 caracteres' },
			{ type: 'maxlength', message: 'Debe ser menor de 30 caracteres.' },
			{ type: 'pattern', message: 'Debe ingresar un correo.' }
		],
		'phone': [
			{ type: 'required', message: 'Telefono requerido' },
			{ type: 'minlength', message: 'Debe ser mayor de 5 caracteres' },
			{ type: 'maxlength', message: 'Debe ser menor de 30 caracteres.' }
      	],
      	'password': [
            { type: 'required', message: 'Contraseña Rederida' },
            { type: 'minlength', message: 'Debe ser mayor de 8 caracteres' },
            { type: 'maxlength', message: 'Debe ser menor de 15 caracteres.' },
            { type: 'pattern', message: 'Su contraseña debe contener al menos una mayúscula, una minúscula y un número.' }
		],
		'cpassword': [
            { type: 'required', message: 'Contraseña Rederida' },
            { type: 'minlength', message: 'Debe ser mayor de 8 caracteres' },
            { type: 'maxlength', message: 'Debe ser menor de 15 caracteres.' },
            { type: 'pattern', message: 'Su contraseña debe contener al menos una mayúscula, una minúscula y un número.' }
		],
		/* 'polit': [
            { type: 'pattern', message: 'Debe aceptar las politicas de privacidad' }
		],
		'terms': [
			{ type: 'pattern', message: 'Debe aceptar los terminos y condiciones' }
		] */
	}

  	constructor(
		public modalController: ModalController,
		public toastController: ToastController,
		public formBuilder: FormBuilder,
		private firebaseAuth: AngularFireAuth,
		private db: AngularFireDatabase,
		private androidPermissions: AndroidPermissions,
    	private locationAccuracy: LocationAccuracy
	) {
		this.register = formBuilder.group({
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
			  ])],
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
			])],
			email: ['', Validators.compose([
				Validators.required,
				Validators.minLength(8),
				Validators.maxLength(30),
				Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
			])],
			phone: ['', Validators.compose([
				Validators.required,
				Validators.minLength(8),
				Validators.maxLength(10)
			])],
			password: ['', Validators.compose([
				Validators.required,
				Validators.minLength(8),
				Validators.maxLength(15),
				Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$.@$!%*?&])[A-Za-z0-9\d$@$.!%*?&].{8,15}')
			])],
			cpassword: ['', Validators.compose([
				Validators.required,
				Validators.minLength(8),
				Validators.maxLength(15),
				Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$.@$!%*?&])[A-Za-z0-9\d$@$.!%*?&].{8,15}')
			])]
			/* polit: [false, Validators.compose([
				Validators.pattern('true')
			])],
			terms: [false, Validators.compose([
				Validators.pattern('true')
			])] */
	  	});
	}

  	ngOnInit() {
		/* this.firebaseAuth.auth.onAuthStateChanged( user => {
			if (user) {
				this.uid = user.uid; */
				this.checkGPSPermission();
				this.uid = localStorage.getItem('uid');
			/* }
		}); */
	  }

	async success(message) {
		const modal = await this.modalController.create({
			component: BaseSuccessPage,
			cssClass: 'successBaseModal',
			componentProps: { message: message }
		});

		return await modal.present();
	}

	async presentToast(message) {
		const toast = await this.toastController.create({
			message: message,
			duration: 2000
		});

		toast.present();
	}

	async onSubmit(values) {
		var name = this.register.value.name;
		var lastname = this.register.value.lastname;
		var dni = this.register.value.dni;
		var birthdate = this.register.value.birthdate;
		var country = this.register.value.country;
		var city = this.register.value.city;
		var address = this.register.value.address;
		var zipcode = this.register.value.zipcode;
		var email = this.register.value.email;
		var password = this.register.value.password;
		var phone = this.register.value.phone;
		var d = new Date();
		var year = d.getFullYear();
		var month = d.getMonth() + 1;
		var day = d.getDate();
		var date = year + '-' + month + '-' + day;

		this.firebaseAuth.auth.createUserWithEmailAndPassword(email, password).then(value => {
			var uid = value.user.uid;

			var b = {
				eats: {
					type: 1,
					value: 0
				},
				books: {
					type: 2,
					value: 0
				},
				gyms: {
					type: 2,
					value: 0
				},
				fuel: {
					type: 1,
					value: 0
				},
				kids: {
					type: 1,
					value: 0
				},
				propia: {
					type: 3,
					value: 0
				},
				trips: {
					type: 2,
					value: 0
				}
			}

			var a = { 
				accounts: b,
				name: name,
				email: email,
				lastname: lastname,
				phone: phone,
				dni: dni,
				birthdate: birthdate,
				country: country,
				city: city,
				key: uid,
				address: address,
				zipcode: zipcode,
				createt_ad: date,
				id_familiar: this.uid
			}

			const itemRef = this.db.object('clientes/' + uid);
			itemRef.set(a).then( success => {
				console.log('success');
				this.modalController.dismiss();
				this.success('El usuario ha sido creado con exito');
			}).catch( error => {
				console.log('error');
				this.presentToast('error al registrar el usuario');
			});
		}).catch(err => {
			console.log('Something went wrong:', err.message);
			this.presentToast('error al registrar el usuario');
		});
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
			this.country = results[0].country;
			this.city = results[0].locality;
			if(results[0].thoroughfare) {
				this.address = results[0].thoroughfare;
			}
		}).catch(error =>{
			console.error(error);
		})
	}

	/* getMap() {
		localStorage.setItem('url','register');
		this.router.navigate(['map']);
	} */

	public togglePassword() {
    	if(this.passwordShown) {
      		this.passwordShown = false;
      		this.passwordType = "password";
    	} else {
      		this.passwordShown = true;
      		this.passwordType = "text";
    	}
  	}

  	public revelarConfirmacion() {
    	if(this.passwordShown2) {
      		this.passwordShown2 = false;
      		this.passwordType2 = "password";
    	} else {
      		this.passwordShown2 = true;
      		this.passwordType2 = "text";
    	}
	}
}
