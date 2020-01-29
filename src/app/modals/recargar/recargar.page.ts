import { Component, OnInit } from '@angular/core';

import { ModalController } from '@ionic/angular';
import { AgregarSaldoPage } from '../agregar-saldo/agregar-saldo.page';
import { EliminarPage } from '../eliminar/eliminar.page';
import { AgregarTarjetaPage } from '../agregar-tarjeta/agregar-tarjeta.page';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';

@Component({
	selector: 'app-recargar',
	templateUrl: './recargar.page.html',
	styleUrls: ['./recargar.page.scss'],
})

export class RecargarPage implements OnInit {

  	data:any;
  	value = '';
  	public sum : number = 0;
  	erroMessage = '';
	cards: any;
	cardslength = 0;

	constructor(
		private modalCtrl: ModalController,
		private firebaseAuth: AngularFireAuth,
		private afs: AngularFirestore
	) {}

	ngOnInit() {
		this.getCards();
	}

	async agregarSaldo() {
		if(this.value == '0,00' || this.value == '0' || this.value == '0.00' || !this.value) {
			this.erroMessage = 'Debe ingresar el monto a recargar';
		} else {
			await this.modalCtrl.dismiss();
			const modal = await this.modalCtrl.create({
				component: AgregarSaldoPage,
				cssClass: 'modalAgregarSaldo',
				backdropDismiss: false,
				componentProps: {
					saldo: this.value
				}
			});

			await modal.present();
		}
	}

	async eliminar(id) {
		const modal = await this.modalCtrl.create({
			component: EliminarPage,
			cssClass: 'modalEliminar',
			componentProps:  {
				id: id
			},
		});
		
		return await modal.present();
	}

	async agregarTarjeta() {
		const modal = await this.modalCtrl.create({
			component: AgregarTarjetaPage,
			cssClass: 'modalAgregarTarjeta'
		});

		return await modal.present();
	}

  	async decimal(event){
		if(this.value.length == 0){
			if(event.key == '0') {
				event.preventDefault();
			}
		}
	}
	
	async getCards() {
		this.firebaseAuth.auth.onAuthStateChanged(user => {
			if (user) {
				var uid = user.uid;

				var items = this.afs.collection('clientes/' + uid + '/creditcard');
				items.valueChanges().subscribe( success => {
					this.cards = success;
					this.cardslength = this.cards.length
					console.log('cards', this.cards);
				});
			} else {

			}
		});
	}

	async closeModal() {
		await this.modalCtrl.dismiss();
	}
}
