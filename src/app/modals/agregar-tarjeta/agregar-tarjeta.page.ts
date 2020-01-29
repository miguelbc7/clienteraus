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
		],
		'date': [
			{ type: 'required', message: 'Fecha requerido' },
      	],
      	'cvc': [
            { type: 'required', message: 'CVC requerido' },
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
			])],
			date: ['', Validators.compose([
				Validators.required,
			])],
			cvc: ['', Validators.compose([
				Validators.required,
			])],
			name: ['', Validators.compose([
				Validators.required,
			])]
	  	});
	}

	ngOnInit() {}
	  
	async onSubmit(values) {
		console.log('a');
		this.firebaseAuth.auth.onAuthStateChanged(user => {
			console.log('b');
			if (user) {
				var uid = user.uid;
				var numero = this.addcard.value.number;
				var fechaExp = this.addcard.value.date;
				var cvc = this.addcard.value.cvc;
				var nombre = this.addcard.value.name;
				const id = this.afs.createId();
				const item = { id, nombre, numero, cvc, fechaExp };
				var items = this.afs.collection('clientes/' + uid + '/creditcard');

				items.doc(id).set(item).then( success => {
					console.log('success');
					this.closeModal();
				}).catch( error => {
					console.log('error', error);
				});
			} else {
				console.log('c');
			}
		});
	}

  	closeModal(){
    	this.modalCtrl.dismiss();
  	}
}
