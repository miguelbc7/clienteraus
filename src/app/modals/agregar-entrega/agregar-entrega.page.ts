import { Component, OnInit, Input } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { ToastController } from '@ionic/angular';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { ModalController } from '@ionic/angular';

@Component({
	selector: 'app-agregar-entrega',
	templateUrl: './agregar-entrega.page.html',
	styleUrls: ['./agregar-entrega.page.scss'],
})

export class AgregarEntregaPage implements OnInit {

	@Input() type: any;
	public addaddress: FormGroup;
	validation_messages = {
		'street': [
			{ type: 'required', message: 'Calle requerida' },
		],
		'number': [
			{ type: 'required', message: 'Numero requerido' },
      	],
      	'zipcode': [
			{ type: 'required', message: 'Código postal requerido' },
			{ type: 'min', message: 'Debe ser mayor de 3 caracteres.' }
		],
		'city': [
			{ type: 'required', message: 'Ciudad requerida' },

		],
		'country': [
            { type: 'required', message: 'País requerido' },
		],
		'phone': [
            { type: 'required', message: 'Teléfono requerido' },
		]
	}
	uid;

	constructor(
    	public formBuilder: FormBuilder,
		private modalCtrl: ModalController,
		private db: AngularFireDatabase,
		public toastController: ToastController
	) {
		this.addaddress = formBuilder.group({
			street: ['', Validators.compose([
				Validators.required
			])],
			number: ['', Validators.compose([
				Validators.required
			])],
			zipcode: ['', Validators.compose([
				Validators.required,
				Validators.min(100),
			])],
			city: ['', Validators.compose([
				Validators.required
			])],
			country: ['', Validators.compose([
				Validators.required
			])],
			phone: ['', Validators.compose([
				Validators.required
			])]
	  	});
	}

	ngOnInit() {
		this.uid = localStorage.getItem('uid');
	}

	async onSubmit(values) {

		var street = this.addaddress.value.street;
		var number = this.addaddress.value.number;
		var zipcode = this.addaddress.value.zipcode;
		var city = this.addaddress.value.city;
		var country = this.addaddress.value.country;
		var phone = this.addaddress.value.phone;

		var data = {
			street: street,
			number: number,
			zipcode: zipcode,
			city: city,
			country: country,
			phone: phone
		}

		this.db.object('addresses/' + this.uid).set(data).then( success => {
			console.log('success', success);
			this.closeModal();
		}).catch( error => {
			console.log('error', error);
		})
	}

	closeModal(){
    	this.modalCtrl.dismiss();
  	}
}
