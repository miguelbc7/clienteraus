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
	uidselect;
	email;
	name;
	lastname;
	phone;
	country;
	city;
	address;
	status;
	passwordType: string = "password";
  	passwordShown: boolean = false;
  	passwordType2: string = "password";
	passwordShown2: boolean = false;
	public register: FormGroup;
	disab = true;
	validation_messages = {
		'name': [
        	{ type: 'required', message: 'Debe ingresar un nombre.' },
        	{ type: 'maxlength', message: 'Debe ser menor de 30 caracteres.' }
      	],
      	'lastname': [
        	{ type: 'required', message: 'Debe ingresar un apellido.' },
        	{ type: 'maxlength', message: 'Debe ser menor de 30 caracteres.' }
      	],
    	'email': [
			{ type: 'required', message: 'Correo requerido' },
			{ type: 'minlength', message: 'Debe ser mayor de 5 caracteres' },
			{ type: 'maxlength', message: 'Debe ser menor de 30 caracteres.' },
			{ type: 'pattern', message: 'Debe ingresar un correo.' }
		],
		'phone': [
			{ type: 'required', message: 'Telefono requerido' },
			{ type: 'minlength', message: 'Debe ser mayor de 7 caracteres' },
			{ type: 'maxlength', message: 'Debe ser menor de 11 caracteres.' }
      	]
	}

  	constructor(
		public modalController: ModalController,
		public toastController: ToastController,
		public formBuilder: FormBuilder,
		private firebaseAuth: AngularFireAuth,
		private db: AngularFireDatabase,
		private androidPermissions: AndroidPermissions,
    	private locationAccuracy: LocationAccuracy,
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
			])]
	  	});
	}

  	ngOnInit() {
		this.uid = localStorage.getItem('uid');
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
		if(this.status == 2) {
			this.db.list('clientes').update(this.uidselect, { id_familiar: this.uid }).then( success => {
				this.modalController.dismiss();
				this.register.reset();
				this.success('El familiar ha sido registrado con exito');
			}).catch( error => {
				this.presentToast('error al registrar el usuario');
			});
		} else {
			this.presentToast('Este usuario ya es familiar de otra persona');
		}
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

  	public revelarConfirmacion() {
    	if(this.passwordShown2) {
      		this.passwordShown2 = false;
      		this.passwordType2 = "password";
    	} else {
      		this.passwordShown2 = true;
      		this.passwordType2 = "text";
    	}
	}

	async getUser(e) {
		var email = this.email;
		
		if(!this.email) {

		}

		if(this.email) {
			this.db.list('/clientes', ref => ref.orderByChild('email').equalTo(email)).valueChanges().subscribe( data => {
				if(data) {
					console.log('data', data[0]);
					if(data[0]['key'] == this.uid) {
						this.disab = true
						this.presentToast('No puede agregarse usted mismo como familiar');
					} else {
						this.uidselect = data[0]['key'];
						this.name = data[0]['name'];
						this.lastname = data[0]['lastname'];
						this.phone = data[0]['phone'];
		
						if(data[0]['id_familiar']) {
							this.status = 1;
						} else {
							this.status = 2;
						}
					}
				} else if(!data[0]) {
					this.presentToast('Este usuario no existe');
				} else {
					this.presentToast('Este usuario no existe');
				}
				
			});
		}
	}
}
