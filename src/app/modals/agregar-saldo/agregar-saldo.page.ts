import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from '@angular/fire/database';

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
		/* this.firebaseAuth.auth.onAuthStateChanged(user => {
			if (user) {
				var uid = user.uid; */
				var uid = localStorage.getItem('uid');
				var ref = this.db.list('clientes/' + uid);

				var s = this.saldo;
				
				if(s.indexOf('.') > -1) {
					s = s.split('.').join(',');
				} else {
					s = s;
				}

				console.log('s', s);

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
						this.router.navigate(["/options"]);
					}).catch( error => {
						this.presentToast('Ocurrio un error al recargar su saldo');
					});
				});
			/* } else {

			}
		}); */
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
}
