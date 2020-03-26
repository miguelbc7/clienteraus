import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { BaseSuccessPage } from '../modals/base-success/base-success.page';
import { AgregarFamiliaPage } from '../modals/agregar-familia/agregar-familia.page';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireDatabase } from '@angular/fire/database';
import { ToastController } from '@ionic/angular';

@Component({
	selector: 'app-saldo-familia',
	templateUrl: './saldo-familia.page.html',
	styleUrls: ['./saldo-familia.page.scss'],
})

export class SaldoFamiliaPage implements OnInit {
	status:boolean = false;
	status2:boolean = false;
	status3:boolean = false;
	type: any = 1;
	amount: any;
	uid;
	family;
	select;
	dis;

	constructor(
		public modalController: ModalController,
		private db: AngularFireDatabase,
		private firebaseAuth: AngularFireAuth,
		public toastController: ToastController
	) {}

	ngOnInit() {
		this.uid = localStorage.getItem('uid');
		console.log('uid', localStorage.getItem('uid'))
		this.getFamily(localStorage.getItem('uid'));
	}

	async presentToast(message) {
		const toast = await this.toastController.create({
			message: message,
			duration: 2000
		});

		toast.present();
	}

	change(id){
		if (id == 1){
			this.status = !this.status;
		}
			if(id == 2){
			this.status2 = !this.status2;
		}
			if(id == 3){
			this.status3 = !this.status3;
		}
	}
  
	async agregarFamilia() {
		console.log('agregarFamilia');
		const modal = await this.modalController.create({
			component: AgregarFamiliaPage,
			cssClass: 'agregarFamilia'
		});

		return await modal.present();
	}

	async success(message) {
		const modal = await this.modalController.create({
			component: BaseSuccessPage,
			cssClass: 'successBaseModal',
			componentProps: { message: message }
		});

		return await modal.present();
	}

	async getFamily(uid) {
		this.db.list('clientes', ref => ref.orderByChild('id_familiar').equalTo(uid)).valueChanges().subscribe( success => {
			console.log('success', success);
			
			var arr = [];

			success.forEach( row => {
				var a = { key: row['key'], name: row['name'], lastname: row['lastname'], status: false };
				arr.push(a);
			});

			console.log('array', arr);
		
			this.family = arr;
		});
	}

	async changeStatus(i, status, key) {
		console.log('key', key);
		var arr2 = this.family;
		var arr = [];
		this.select = key;
		status = !status;

		arr2.forEach( (row, index) => {
			var a;

			if(index == i) {
				a = { key: row.key, name: row.name, lastname: row.lastname, status: status };
			} else {
				a = { key: row.key, name: row.name, lastname: row.lastname, status: false };
			}

			arr.push(a);
		});

		this.family = arr;
	}

	async restartStatus() {
		var arr2 = this.family;
		var arr = [];

		arr2.forEach( row => {
			var a = { key: row.key, name: row.name, lastname: row.lastname, status: false };
			arr.push(a);
		});

		this.family = arr;
	}

	async send() {
		console.log('amount1', this.amount);
		var amount = this.amount;
		console.log('amount2', amount);
		var select = this.select;
		var uid = this.uid;
		var type = this.type;

		console.log('select', select);

		var ref1 = this.db.list('clientes/' + uid);
		var ref2 = this.db.list('clientes/' + select);

		var t = amount.toString();

		if(t.indexOf(',') > -1) {
			amount = t.split(',').join('.');
		}

		var r1 = ref1.valueChanges().subscribe( (success: any) => {
			var dat;

			var p = parseFloat(success[0]['propia'].value) - parseFloat(amount);

			dat = {
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
					type: 2
				}
			}

			if(p < 0) {
				this.presentToast('No tiene saldo en esta cuenta para enviar esa cantidad');
			} else {
				r1.unsubscribe();
				this.db.list('clientes').update(uid, { accounts: dat }).then( success => {
					var r2 = ref2.valueChanges().subscribe( (success: any) => {
						console.log('success', success);
						var dat2;

						if(type == 1) {
							var p = parseFloat(success[0]['eats'].value) + parseFloat(amount);

							dat = {
								eats: { 
									value: p,
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
									value: parseFloat(success[0]['propia'].value),
									type: 3
								},
								trips: {
									value: parseFloat(success[0]['trips'].value),
									type: 2
								}
							}
						} else if(type == 2) {
							var p = parseFloat(success[0]['books'].value) + parseFloat(amount);

							dat = {
								eats: { 
									value: parseFloat(success[0]['eats'].value),
									type: 1
								},
								books: {
									value: p,
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
									value: parseFloat(success[0]['propia'].value),
									type: 3
								},
								trips: {
									value: parseFloat(success[0]['trips'].value),
									type: 2
								}
							}
						} else if(type == 3) {
							var p = parseFloat(success[0]['fuel'].value) + parseFloat(amount);

							dat = {
								eats: { 
									value: parseFloat(success[0]['eats'].value),
									type: 1
								},
								books: {
									value: parseFloat(success[0]['books'].value),
									type: 2
								},
								fuel: {
									value: p,
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
									value: parseFloat(success[0]['propia'].value),
									type: 3
								},
								trips: {
									value: parseFloat(success[0]['trips'].value),
									type: 2
								}
							}
						} else if(type == 4) {
							var p = parseFloat(success[0]['gyms'].value) + parseFloat(amount);

							dat = {
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
									value: p,
									type: 2
								},
								kids: {
									value: parseFloat(success[0]['kids'].value),
									type: 1
								},
								propia: {
									value: parseFloat(success[0]['propia'].value),
									type: 3
								},
								trips: {
									value: parseFloat(success[0]['trips'].value),
									type: 2
								}
							}
						} else if(type == 5) {
							var p = parseFloat(success[0]['gyms'].value) + parseFloat(amount);

							dat = {
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
									value: p,
									type: 1
								},
								propia: {
									value: parseFloat(success[0]['propia'].value),
									type: 3
								},
								trips: {
									value: parseFloat(success[0]['trips'].value),
									type: 2
								}
							}
						} else if(type == 6) {
							var p = parseFloat(success[0]['trips'].value) + parseFloat(amount);

							dat = {
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
									value: parseFloat(success[0]['propia'].value),
									type: 3
								},
								trips: {
									value: p,
									type: 2
								}
							}
						} else if(type == 7) {
							var p = parseFloat(success[0]['propia'].value) + parseFloat(amount);

							dat = {
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
									value: parseFloat(success[0]['propia'].value),
									type: 2
								}
							}
						}

						this.db.list('clientes').update(select, { accounts: dat }).then( success => {
							this.restartStatus();
							this.amount = "";
							this.success('El saldo ha sido enviado con exito');
						});
					});
				});
			}
		});
	}

	amountChange(value, e) {
		var value3 = (value.toString()).length % 4;

		if(e.detail.value == '.') {
			this.dis = true;

			if((value.toString()).indexOf('.') > -1) {
				var value1 = (value.toString()).split('.').join(',');
				var value2 = this.numberWithCommas(value1);
				this.amount = value2;
			} else {
				var value2 = this.numberWithCommas(value);
				this.amount = value2;
			}
		} else {
			if(this.dis) {
				this.dis = false
				var value2 = this.numberWithCommas(value);
				this.amount = value2;
			} else {
				this.dis = true;
				var value2 = this.numberWithCommas(value);
				this.amount = value2;
			}
		}
	}

	numberWithCommas(x) {
		return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
	}

}
