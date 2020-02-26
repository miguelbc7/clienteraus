import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
	selector: 'app-agregar-tarjeta',
	templateUrl: './agregar-tarjeta.page.html',
	styleUrls: ['./agregar-tarjeta.page.scss'],
})

export class AgregarTarjetaPage implements OnInit {

	public addcard: FormGroup;
	validation_messages = {
		'date': [
			{ type: 'required', message: 'Mes requerido' },
		],
		'year': [
			{ type: 'required', message: 'Año requerido' },
      	],
      	'cvc': [
			{ type: 'required', message: 'CVC requerido' },
			{ type: 'maxlength', message: 'Debe ser menor de 4 caracteres.' },
			{ type: 'minlength', message: 'Debe ser mayor de 2 caracteres.' }
		],
		'numero': [
			{ type: 'required', message: 'Numero de tarjeta requerido' },
			{ type: 'max', message: 'Debe ser menor de 17 caracteres.' },
			{ type: 'min', message: 'Debe ser mayor de 15 caracteres.' }
		],
		'name': [
            { type: 'required', message: 'Nombre requerido' },
		]
	}

  	constructor(
		private modalCtrl: ModalController,
    	public formBuilder: FormBuilder,
		private afs: AngularFirestore
	) {
		this.addcard = formBuilder.group({
			date: ['', Validators.compose([
				Validators.required
			])],
			year: ['', Validators.compose([
				Validators.required
			])],
			cvc: ['', Validators.compose([
				Validators.required,
				Validators.maxLength(3),
			  	Validators.minLength(3)
			])],
			numero: ['', Validators.compose([
				Validators.required,
				Validators.min(1000000000000000),
				Validators.max(9999999999999999)
			])],
			name: ['', Validators.compose([
				Validators.required
			])]
	  	});
	}

	ngOnInit() {}
	  
	async onSubmit(values) {
		var uid = localStorage.getItem('uid');
		var numero = this.addcard.value.number;
		var fechaExp = this.addcard.value.date;
		var yearExp = this.addcard.value.year;
		var cvc = this.addcard.value.cvc;
		var nombre = this.addcard.value.name;
		const id = this.afs.createId();
		const item = { id, nombre, numero, cvc, fechaExp, yearExp };
		var items = this.afs.collection('clientes/' + uid + '/creditcard');

		items.doc(id).set(item).then( success => {
			console.log('success');
			this.addcard.reset();
			this.closeModal();
		}).catch( error => {
			console.log('error', error);
		});

	}

  	closeModal(){
    	this.modalCtrl.dismiss();
  	}
}
