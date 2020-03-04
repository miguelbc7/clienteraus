import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from '@angular/fire/database';
import { BaseSuccessPage } from '../../pages/modals/base-success/base-success.page';

@Component({
	selector: 'app-agregar-saldo',
	templateUrl: './agregar-saldo.page.html',
	styleUrls: ['./agregar-saldo.page.scss'],
})

export class AgregarSaldoPage implements OnInit {

	@Input() saldo;

  	constructor(
		private modalCtrl: ModalController,
		private router: Router,
		private firebaseAuth: AngularFireAuth,
		private db: AngularFireDatabase,
    	public toastController: ToastController
	) {}

	ngOnInit() {}
	  
	agregarSaldo() {
		var uid = localStorage.getItem('uid');
		var ref = this.db.list('clientes/' + uid);

		var s = this.saldo;

		if((s.toString()).indexOf('.') > -1) {
			s = (s.toString).split('.').join(',');
		} else {
			s = s.toString();
		}

		var r = ref.valueChanges().subscribe( (success: any) => {
			var p = parseFloat(success[0]['propia'].value) + parseFloat(s);

			var dat = {
				eats: { 
					value: parseFloat(success[0]['eats'].value),
					type: 1
				},
				books: {
					value: parseFloat(success[0]['books'].value),
					type: 2
				},
				fuel: {
					value: parseFloat(success[0]['fuel'].value),
					type: 1
				},
				gyms: {
					value: parseFloat(success[0]['gyms'].value),
					type: 2
				},
				kids: {
					value: parseFloat(success[0]['kids'].value),
					type: 1
				},
				propia: {
					value: p,
					type: 3
				},
				trips: {
					value: parseFloat(success[0]['trips'].value),
					type:   2
				}
			}

			this.db.list('clientes').update(uid, { accounts: dat }).then( success => {
				this.closeModal();
				r.unsubscribe();
				this.success('Se ha recargado el sado con éxito');
			}).catch( error => {
				this.presentToast('Ocurrio un error al recargar su saldo');
			});
		});

	}

	async presentToast(message) {
		const toast = await this.toastController.create({
		  message: message,
		  duration: 2000
		});
		
		toast.present();
	}

  	async closeModal(){
    	await this.modalCtrl.dismiss();
	}
	  
	async success(message) {
		const modal = await this.modalCtrl.create({
			component: BaseSuccessPage,
			cssClass: 'successBaseModal',
			componentProps: { message: message }
		});

		return await modal.present();
	}
}
