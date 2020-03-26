import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireDatabase } from '@angular/fire/database';
import { BaseSuccessPage } from '../../pages/modals/base-success/base-success.page';

@Component({
	selector: 'app-agregar-saldo',
	templateUrl: './agregar-saldo.page.html',
	styleUrls: ['./agregar-saldo.page.scss'],
})

export class AgregarSaldoPage implements OnInit {

	@Input() saldo;
	uid;

  	constructor(
		private modalCtrl: ModalController,
		private router: Router,
		private firebaseAuth: AngularFireAuth,
		private db: AngularFireDatabase,
    	public toastController: ToastController
	) {}

	ngOnInit() {
		this.uid = localStorage.getItem('uid');
	}
	  
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
				this.newTransaction(p);
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

	async newTransaction(price) {
		var r = this.db.object('clientes/' + this.uid).valueChanges().subscribe( data2 => {
			r.unsubscribe();
			
			var d;
			var dat = new Date()  ;
			var year = dat.getFullYear();
			var month = dat.getMonth()+1;
			var day = dat.getDate();
			var hour = dat.getHours();
			var minute = dat.getMinutes();
			var second = dat.getSeconds();
			var date = year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second;
		
			if(data2['id_empresa']) {
				d = {
					"date": date,
					"id_empresa": data2['id_empresa'],
					"name": data2['name'] + ' ' + data2['lastname'],
					"price": price,
					"uid": this.uid,
					"typeTransaccion":"carrito",
					"mode": "ingreso"
				}
			} else {
				d = {
					"date": date,
					"name": data2['name'] + ' ' + data2['lastname'],
					"price": price,
					"uid": this.uid,
					"typeTransaccion":"carrito",
					"mode": "ingreso"
				}
			}

			this.db.list('transactions/' + this.uid).push(d).then( success => {
				console.log('success', success);

				this.db.list('transactions/' + this.uid).update(success.key, { key: success.key }).then( success2 => {
					this.success('Se ha recargado el saldo con éxito');
				}).catch( error => {
					console.log('error', error);
				});
			}).catch( error => {
				console.log('error', error);
			});
		})
	}
}
