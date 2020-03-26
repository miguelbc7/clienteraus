import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireDatabase } from '@angular/fire/database';
import { ToastController } from '@ionic/angular';
import { Location } from '@angular/common';
import { PoliticasPage } from '../../modals/politicas/politicas.page';
import { TerminosPage } from '../../modals/terminos/terminos.page';
import { ConfirmationPage } from '../../modals/confirmation/confirmation.page';
import { CountriesService } from '../../../services/countries.service';

@Component({
	selector: 'app-register3',
  	templateUrl: './register3.page.html',
  	styleUrls: ['./register3.page.scss'],
})

export class Register3Page implements OnInit {
	  
	public register3: FormGroup;
  	passwordType: string = "password";
  	passwordShown: boolean = false;
  	passwordType2: string = "password";
	passwordShown2: boolean = false;
	politval = false;
	politval2 = false;
	termsval = false;
	phoneError: boolean = false;
	termsval2 = false;
	country;
	validation_messages = {
    	'email': [
			{ type: 'required', message: 'Correo requerido' },
			{ type: 'minlength', message: 'Debe ser mayor de 5 caracteres' },
			{ type: 'maxlength', message: 'Debe ser menor de 30 caracteres.' },
			{ type: 'pattern', message: 'Debe ingresar un correo.' }
		],
		'phone': [
			{ type: 'required', message: 'Telefono requerido' }
      	],
      	'password': [
            { type: 'required', message: 'Contraseña Requerida' },
            { type: 'minlength', message: 'Debe ser mayor de 8 caracteres' },
            { type: 'maxlength', message: 'Debe ser menor de 15 caracteres.' },
            { type: 'pattern', message: 'Su contraseña debe contener al menos una mayúscula, una minúscula y un número.' }
		],
		'cpassword': [
            { type: 'required', message: 'Contraseña Requerida' },
            { type: 'minlength', message: 'Debe ser mayor de 8 caracteres' },
            { type: 'maxlength', message: 'Debe ser menor de 15 caracteres.' },
            { type: 'pattern', message: 'Su contraseña debe contener al menos una mayúscula, una minúscula y un número.' }
		],
		'polit': [
            { type: 'pattern', message: 'Debe aceptar las politicas de privacidad' }
		],
		'terms': [
			{ type: 'pattern', message: 'Debe aceptar los terminos y condiciones' }
		]
	}

  	constructor(
		private _location: Location,
    	private modalController: ModalController,
    	public formBuilder: FormBuilder,
    	private router: Router,
		private firebaseAuth: AngularFireAuth,
		private db: AngularFireDatabase,
		public toastController: ToastController,
		public countries: CountriesService
	) {
    	this.register3 = formBuilder.group({
      		email: ['', Validators.compose([
				Validators.required,
				Validators.minLength(8),
            	Validators.maxLength(30),
        		Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      		])],
      		phone: ['', Validators.compose([
				Validators.required,
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
			])],
			polit: [false, Validators.compose([
				Validators.pattern('true')
			])],
			terms: [false, Validators.compose([
				Validators.pattern('true')
			])]
    	});
  	}

  	ngOnInit() {
		this.getCountries();
	  }

  	public togglePassword() {
    	if(this.passwordShown) {
      		this.passwordShown = false;
      		this.passwordType = "password";
    	} else {
      		this.passwordShown = true;
      		this.passwordType = "text";
    	}
	}
	  
	back() {
		this. _location.back()
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

	public getCountries() {
		this.countries.getCountries().then( (data: any) => {
			var cc = localStorage.getItem('country');
			var d = data.data;

			console.log('cc', cc);

			var c = d.filter(obj => {
				return obj.pais_name === cc.trim()
			});

			console.log('c', c);

			this.country = c[0];
		}).catch( error => {
			console.log('error', error);
		})
	}
	  
	async onSubmit(values) {
		var email = this.register3.value.email;
		var password = this.register3.value.password;
		var phone = '+' + this.country.phone_code + '' + this.register3.value.phone;
		var name = localStorage.getItem('name');
		var lastname = localStorage.getItem('lastname');
		var dni = localStorage.getItem('dni');
		var birthdate = localStorage.getItem('birthdate');
		var country = localStorage.getItem('country');
		var city = localStorage.getItem('city');
		var address = localStorage.getItem('address');
		var zipcode = localStorage.getItem('zipcode');
		var d = new Date();
		var year = d.getFullYear();
		var month = d.getMonth() + 1;
		var day = d.getDate();
		var date = year + '-' + month + '-' + day;
		this.politval2 = false;
		this.termsval2 = false;
		var d = new Date();

		var dat = {
			email: email,
			password: password,
			phone: phone,
			name: name,
			lastname: lastname,
			dni: dni,
			birthdate: birthdate,
			country: country,
			city: city,
			address: address,
			zipcode: zipcode,
			date: date
		}

		var r = this.db.list('/clientes', ref => ref.orderByChild('phone').equalTo(phone)).valueChanges().subscribe( data => {
			r.unsubscribe();
			console.log('data', data.length);
			if(data.length > 0) {
				this.phoneError = true;
			} else {
				this.confirmation(dat);
			}
		}, error => {
			console.log('error', error);
		});
	}

	async acceptPoliticas() {
		const modal = await this.modalController.create({
			component: PoliticasPage,
			cssClass: 'calculate'
		});

		return await modal.present();
	}

	async acceptTerminos () {
		const modal = await this.modalController.create({
			component: TerminosPage,
			cssClass: 'calculate'
		});

		return await modal.present();
	}

	async confirmation (dat) {
		const modal = await this.modalController.create({
			component: ConfirmationPage,
			componentProps: {
				data: dat
			},
			cssClass: 'ModalConfirmation'
		});

		return await modal.present();
	}

	async getPhone(phone) {
		
	}
}
