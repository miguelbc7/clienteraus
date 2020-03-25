import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from '@angular/fire/database';
import { map } from 'rxjs/operators';
import { ToastController } from '@ionic/angular';
import { SuccessPage } from '../success/success.page';

@Component({
	selector: 'app-tipo-pago',
	templateUrl: './tipo-pago.page.html',
	styleUrls: ['./tipo-pago.page.scss'],
})

export class TipoPagoPage implements OnInit {
	@Input() total: any;
	@Input() data: any;
	@Input() dataid: any;
	restotal1;
	restotal2;
	activation: any = 1;
	uid;

	constructor(
		private modalCtrl:ModalController,
		private db: AngularFireDatabase,
		private firebaseAuth: AngularFireAuth,
		public toastController: ToastController
	) {}

	ngOnInit() {
		this.uid = localStorage.getItem('uid');
		var tt = this.total;

		if((tt.toString()).indexOf(',') > -1) {
			this.restotal1 = (tt.toString()).split(',')[0];
			this.restotal2 = (tt.toString()).split(',')[1];
		} else {
			this.restotal1 = tt;
			this.restotal2 = '00';
		}
	}

	setActive(number) {
		this.activation = number;
	}
  
	closeModal() {
		this.modalCtrl.dismiss();
	}

	async send() {
		var ref = this.db.list('restaurantes/' + this.dataid);
		var ref2 = this.db.list('clientes/' + this.uid);

		var t = this.total.toString();

		if(t.indexOf(',') > -1) {
			this.total = t.split(',').join('.');
		}

		console.log('total', this.total);

		var r1 = ref2.valueChanges().subscribe( (success2: any) => {
			var dat;

			if(this.activation == 1) {
				var p = parseFloat(success2[0]['eats'].value) - parseFloat(this.total);

				dat = {
					eats: { 
						value: p,
						type: 1
					},
					books: {
						value: parseFloat(success2[0]['books'].value),
						type: 2
					},
					fuel: {
						value: parseFloat(success2[0]['fuel'].value),
						type: 1
					},
					gyms: {
						value: parseFloat(success2[0]['gyms'].value),
						type: 2
					},
					kids: {
						value: parseFloat(success2[0]['kids'].value),
						type: 1
					},
					propia: {
						value: parseFloat(success2[0]['propia'].value),
						type: 3
					},
					trips: {
						value: parseFloat(success2[0]['trips'].value),
						type:   2
					}
				}

				if(p < 0) {
					r1.unsubscribe();
					this.presentToast('No tiene saldo en esta cuenta para enviar esa cantidad');
				} else {
					r1.unsubscribe();
					this.db.list('clientes').update(this.uid, { accounts: dat }).then(success => {
						var r2 = ref.valueChanges().subscribe( (success: any) => {
						
							var price = parseFloat(success[0]) + parseFloat(this.total);
							var valor = parseFloat(this.total);
			
							this.db.list('restaurantes').update(this.dataid, { balance: price }).then( success2 => {
								r2.unsubscribe();
								this.newTransaction(valor);
							});
						});
					});
				}
			} else if(this.activation == 2) {
				var p = parseFloat(success2[0]['propia'].value) - parseFloat(this.total);

				dat = {
					eats: { 
						value: parseFloat(success2[0]['eats'].value),
						type: 1
					},
					books: {
						value: parseFloat(success2[0]['books'].value),
						type: 2
					},
					fuel: {
						value: parseFloat(success2[0]['fuel'].value),
						type: 1
					},
					gyms: {
						value: parseFloat(success2[0]['gyms'].value),
						type: 2
					},
					kids: {
						value: parseFloat(success2[0]['kids'].value),
						type: 1
					},
					propia: {
						value: p,
						type: 3
					},
					trips: {
						value: parseFloat(success2[0]['trips'].value),
						type:   2
					}
				}

				if(p < 0) {
					r1.unsubscribe();
					this.presentToast('No tiene saldo en esta cuenta para enviar esa cantidad');
				} else {
					r1.unsubscribe();
					this.db.list('clientes').update(this.uid, { accounts: dat }).then( success => {
						var r2 = ref.valueChanges().subscribe( (success: any) => {
							console.log(p);
							
							var price = parseFloat(success[0]) + parseFloat(this.total);
							var valor = parseFloat(this.total);
							this.db.list('restaurantes').update(this.dataid, { balance: price }).then( success2 => {
								r2.unsubscribe();
								console.log('p', p);
								this.newTransaction(valor);
							});
						}, error => {
							console.log('error', error);
							r2.unsubscribe();
						}, () => {
							r2.unsubscribe();
						});
					});
				}
			} else if(this.activation == 3) {
				var t =  parseFloat(this.total) - parseFloat(success2[0]['eats'].value);
				var p: number, p2: number;
				var status;

				if(t > 0) {
					if(t > parseFloat(success2[0]['propia'].value)) {
						r1.unsubscribe();
						this.presentToast('No tiene saldo suficiente en sus cuentas para pagar esa cantidad');
					} else {
						p = parseFloat(success2[0]['propia'].value) - t;
						status = 1;
					}
					p2 = 0;
				} else {
					if(parseFloat(this.total) > parseFloat(success2[0]['eats'].value)) {
						p2 = parseFloat(this.total) - parseFloat(success2[0]['eats'].value);
					} else {
						p2 = parseFloat(success2[0]['eats'].value) - parseFloat(this.total);
					}
					p = success2[0]['propia'].value;
					status = 2;
				}

				dat = {
					eats: { 
						value: p2,
						type: 1
					},
					books: {
						value: parseFloat(success2[0]['books'].value),
						type: 2
					},
					fuel: {
						value: parseFloat(success2[0]['fuel'].value),
						type: 1
					},
					gyms: {
						value: parseFloat(success2[0]['gyms'].value),
						type: 2
					},
					kids: {
						value: parseFloat(success2[0]['kids'].value),
						type: 1
					},
					propia: {
						value: p,
						type: 3
					},
					trips: {
						value: parseFloat(success2[0]['trips'].value),
						type:   2
					}
				}

				if((status == 1 && p2 < 0) || (status == 2 && p < 0)) {
					r1.unsubscribe();
					this.presentToast('No tiene saldo suficiente en sus cuentas para enviar esta cantidad');
				} else {
					r1.unsubscribe();
					this.db.list('clientes').update(this.uid, { accounts: dat }).then( success => {
						var r2 = ref.valueChanges().subscribe( (success: any) => {
							
							var price = parseFloat(success[0]) + parseFloat(this.total);
							var valor = parseFloat(this.total);
				
							this.db.list('restaurantes').update(this.dataid, { balance: price }).then( success2 => {
								r2.unsubscribe();

								if(t > 0) {
									this.newTransaction2(valor);
								} else {
									this.newTransaction(valor);
								}
							});
						}, error => {
							console.log('error', error);
							r2.unsubscribe();
						}, () => {
							r2.unsubscribe();
						});
					});
				}
			} else {

			}
		}, error => {
			console.log('error', error);
			r1.unsubscribe();
		}, () => {
			r1.unsubscribe();
		});
	}

	async presentToast(message) {
		const toast = await this.toastController.create({
			message: message,
			duration: 2000
		});

		toast.present();
	}

	async successModal() {
		this.closeModal();

		const modal = await this.modalCtrl.create({
			component: SuccessPage,
			cssClass: 'successModal',
			componentProps: { 
				name: this.data
			}
		});

		return await modal.present();
	}

	async newTransaction(price) {
		console.log('price', price);

		if(this.activation == 1) {
			var tipo = 'eats';
		} else if(this.activation == 2) {
			var tipo = 'propia';
		} else if(this.activation == 3) {
			var tipo = 'mix';
		} else if(this.activation == 4) {
			var tipo = 'puntos';
		}

		var r = this.db.object('clientes/' + this.uid).valueChanges().subscribe( data2 => {
			var d;
			var dat = new Date()  ;
			var year = dat.getFullYear();
			var month = dat.getMonth()+1;
			var day = dat.getDate();
			var hours = dat.getHours();
			var minutes = dat.getMinutes();
			var seconds = dat.getSeconds();
			var date = year + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds;

			if(data2['id_empresa']) {
				d = {
					"date": date,
					"id_empresa": data2['id_empresa'],
					"id_restaurante": this.dataid,
					"name": data2['name'] + ' ' + data2['lastname'],
					"price": price,
					"tipo": tipo,
					"uid": this.uid,
					"typeTransaccion":"envio",
				}
			} else {
				d = {
					"date": date,
					"id_restaurante": this.dataid,
					"name": data2['name'] + ' ' + data2['lastname'],
					"price": price,
					"tipo": tipo,
					"uid": this.uid,
					"typeTransaccion":"envio",
				}
			}
			this.db.list('transactions').push(d).then( success => {
				if(data2['id_empresa']) {
					r.unsubscribe();
					this.newNotification(price, data2['id_empresa'], data2['name'], data2['lastname'], success.key);
				} else {
					r.unsubscribe();
					this.successModal();
				}
			}).catch( error => {
				console.log('error', error);
			});
		});
	}

	async newTransaction2(price) {
		if(this.activation == 1) {
			var tipo = 'eats';
		} else if(this.activation == 2) {
			var tipo = 'propia';
		} else if(this.activation == 3) {
			var tipo = 'mix';
		} else if(this.activation == 4) {
			var tipo = 'puntos';
		}

		var r = this.db.object('clientes/' + this.uid).valueChanges().subscribe( data2 => {
			var dat = new Date();
			var year = dat.getFullYear();
			var month = dat.getMonth();
			var day = dat.getDate();
			var hours = dat.getHours();
			var minutes = dat.getMinutes();
			var seconds = dat.getSeconds();
			var date = year + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds;
			var d;

			if(data2['id_empresa']) {
				d = {
					"date": date,
					"id_empresa": data2['id_empresa'],
					"id_restaurante": this.dataid,
					"name": data2['name'] + ' ' + data2['lastname'],
					"price": price,
					"tipo": tipo,
					"uid": this.uid,
					"typeTransaccion":"envio",
				}
			} else {
				d = {
					"date": date,
					"id_restaurante": this.dataid,
					"name": data2['name'] + ' ' + data2['lastname'],
					"price": price,
					"tipo": tipo,
					"uid": this.uid,
					"typeTransaccion":"envio",
				}
			}

			var d2 = {
				"date": date,
				"id_restaurante": this.dataid,
				"name": data2['name'] + ' ' + data2['lastname'],
				"price": price,
				"tipo": tipo,
				"uid": this.uid,
				"typeTransaccion":"envio",
			}

			this.db.list('transactions').push(d).then( success => {
				r.unsubscribe();
				this.db.list('transactions').push(d2).then( success => {
					this.newNotification(price, data2['id_empresa'], data2['name'], data2['lastname'], success.key);
					/* this.newNotification2(price2, data2['name'], data2['lastname'], success.key); */
				}).catch( error2 => {
					console.log('error', error2);
				});
			}).catch( error => {
				console.log('error', error);
			});
		})
	}

	async newNotification(price, empresa, name, lastname, key) {
		var dat = new Date();
		var year = dat.getFullYear();
		var month = dat.getMonth();
		var day = dat.getDate();
		var hour = dat.getHours();
		var minute = dat.getMinutes();
		var second = dat.getSeconds();
		var date = year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second;

		var d = {
			content: "El empleado " + name + " " + lastname + " ha enviado " + price + "€ a traves de su cuenta de beneficios",
			create_at: date,
			id_transaccion_beneficio: key,
			img: "",
			like: false,
			read: false
		}

		this.db.list('notifications/' + empresa).push(d).then( success => {
			this.successModal();
		}).catch( error => {
			console.log('error', error);
			this.successModal();
		});
	}

	/* async newNotification2(price, name, lastname, key) {
		var dat = new Date();
		var year = dat.getFullYear();
		var month = dat.getMonth();
		var day = dat.getDate();
		var hour = dat.getHours();
		var minute = dat.getMinutes();
		var second = dat.getSeconds();
		var date = year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second;

		var d = {
			content: "Usted ha enviado " + price + "€ a traves de su cuenta propia",
			create_at: date,
			id_transaccion_beneficio: key,
			img: "",
			like: false,
			read: false
		}

		this.db.list('notifications/' + empresa).push(d).then( success => {
			this.successModal();
		}).catch( error => {
			console.log('error', error);
			this.successModal();
		});
	} */
}
