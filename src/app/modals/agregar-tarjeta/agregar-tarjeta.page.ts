import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';

@Component({
	selector: 'app-agregar-tarjeta',
	templateUrl: './agregar-tarjeta.page.html',
	styleUrls: ['./agregar-tarjeta.page.scss'],
})

export class AgregarTarjetaPage implements OnInit {

	public addcard: FormGroup;
	validation_messages = {
    	'number': [
			{ type: 'required', message: 'Numero de tarjeta requerido' },
			{ type: 'maxlength', message: 'Debe ser menor de 17 caracteres.' },
			{ type: 'minlength', message: 'Debe ser mayor de 15 caracteres.' }
		],
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
		'name': [
            { type: 'required', message: 'Nombre requerido' },
		]
	}

  	constructor(
		private modalCtrl: ModalController,
    	public formBuilder: FormBuilder,
		private firebaseAuth: AngularFireAuth,
		private afs: AngularFirestore
	) {
		this.addcard = formBuilder.group({
			number: ['', Validators.compose([
				Validators.required,
				Validators.maxLength(16),
				Validators.minLength(16)
			])],
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
			name: ['', Validators.compose([
				Validators.required
			])]
	  	});
	}

	ngOnInit() {}
	  
	async onSubmit(values) {
		console.log('a');
		/* this.firebaseAuth.auth.onAuthStateChanged(user => {
			console.log('b');
			if (user) {
				var uid = user.uid; */
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
					this.closeModal();
				}).catch( error => {
					console.log('error', error);
				});
			/* } else {
				console.log('c');
			}
		}); */
	}

  	closeModal(){
    	this.modalCtrl.dismiss();
  	}
}
