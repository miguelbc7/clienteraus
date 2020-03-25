import { Component, OnInit, Input } from '@angular/core';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from '@angular/fire/database';
import { SmsService } from '../../../services/sms.service';
import { ToastController } from '@ionic/angular';

@Component({
	selector: 'app-confirmation',
	templateUrl: './confirmation.page.html',
	styleUrls: ['./confirmation.page.scss'],
})

export class ConfirmationPage implements OnInit {
	@Input() data;
	public confirm: FormGroup;
	number1;
	number2;
	number3;
	number4;
	validation_messages = {
    	'number1': [
			{ type: 'required', message: 'Correo requerido' },
			{ type: 'maxlength', message: 'Debe ser menor de 2 caracteres.' },
		],
		'number2': [
			{ type: 'required', message: 'Correo requerido' },
			{ type: 'maxlength', message: 'Debe ser menor de 2 caracteres.' },
		],
		'number3': [
			{ type: 'required', message: 'Correo requerido' },
			{ type: 'maxlength', message: 'Debe ser menor de 2 caracteres.' },
		],
		'number4': [
			{ type: 'required', message: 'Correo requerido' },
			{ type: 'maxlength', message: 'Debe ser menor de 2 caracteres.' },
		]
	}

	constructor(
    	public formBuilder: FormBuilder,
    	private router: Router,
		private auth: AngularFireAuth,
		private db: AngularFireDatabase,
		public sms: SmsService,
		public toastController: ToastController,
		public modalController: ModalController
	) {
		this.confirm = formBuilder.group({
			number1: ['', Validators.compose([
			  	Validators.required,
			 	Validators.maxLength(1),
			])],
			number2: ['', Validators.compose([
				Validators.required,
				Validators.maxLength(1),
			])],
			number3: ['', Validators.compose([
				Validators.required,
				Validators.maxLength(1),
			])],
			number4: ['', Validators.compose([
				Validators.required,
				Validators.maxLength(1),
			])]
	  	});
	}

	ngOnInit() {
		this.getSMS(this.data.phone);
	}

	getSMS(phone) {
		this.sms.getSms(phone).then( success => {
			this.presentToast('Ha recibido un mensaje de texto, verifique su bandeja de mensajes');
		}).catch( error => {
			console.log('error', error);
		});
	}

	verifySMS(values) {
		var code = ('' + values.number1 + '' + values.number2 + '' + values.number3 + '' + values.number4);

		this.sms.verifySms(code).then( success => {
			this.presentToast('Su codigo es correcto');
			this.submit();
		}).catch( error => {
			console.log('error', error);
		});
	}

	submit() {
		var data = this.data;

		this.auth.auth.createUserWithEmailAndPassword(data.email, data.password).then(value => {
			var uid = value.user.uid;

			var b = {
				eats: {
					type: 1,
					value: 0
				},
				books: {
					type: 2,
					value: 0
				},
				gyms: {
					type: 2,
					value: 0
				},
				fuel: {
					type: 1,
					value: 0
				},
				kids: {
					type: 1,
					value: 0
				},
				propia: {
					type: 3,
					value: 0
				},
				trips: {
					type: 2,
					value: 0
				}
			}

			var a = { 
				accounts: b,
				name: data.name,
				email: data.email,
				lastname: data.lastname,
				phone: data.phone,
				dni: data.dni,
				birthdate: data.birthdate,
				country: data.country,
				city: data.city,
				address: data.address,
				zipcode: data.zipcode,
				createt_ad: data.date,
				key: uid
			}

			const itemRef = this.db.object('clientes/' + uid);
			itemRef.set(a).then( success => {
				localStorage.setItem('uid', uid);
				this.presentToast('Ha sido registrado con éxito');
				this.close();
				this.router.navigate(["/home"]);
			}).catch( error => {
				console.log('error');
			});
		}).catch(err => {
			this.presentToast('Something went wrong:' + err.message);
			console.log('Something went wrong:',err.message);
		});
	}

	async presentToast(message) {
		const toast = await this.toastController.create({
			message: message,
			duration: 2000
		});

		toast.present();
	}

	async gotoNextField(number, next, back, e) {
		console.log('e', e);
		if( e.detail.data ) {
			if(number == 1) {
				next.setFocus();
			} else if(number == 2) {
				next.setFocus();
			} else if(number == 3) {
				next.setFocus();
			}
		} else {
			if(number == 2) {
				back.setFocus();
			} else if(number == 3) {
				back.setFocus();
			} else if(number == 4) {
				back.setFocus();
			}
		}
	}
	
	close() {
		this.modalController.dismiss();
	}

}
