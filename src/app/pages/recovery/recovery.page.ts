import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { Location } from '@angular/common';
import { ToastController } from '@ionic/angular';
import { HomeserviceService } from '../../services/homeservice.service';

@Component({
	selector: 'app-recovery',
	templateUrl: './recovery.page.html',
	styleUrls: ['./recovery.page.scss'],
})

export class RecoveryPage implements OnInit {

	public recover: FormGroup;
	validation_messages = {
    	'email': [
			{ type: 'required', message: 'Correo requerido' },
			{ type: 'minlength', message: 'Debe ser mayor de 5 caracteres' },
			{ type: 'maxlength', message: 'Debe ser menor de 30 caracteres.' },
			{ type: 'pattern', message: 'Debe ingresar un correo.' }
		]
	}

	constructor(
    	public formBuilder: FormBuilder,
		private _location: Location,
		public toastController: ToastController,
		public home: HomeserviceService
	) {
		this.recover = formBuilder.group({
			email: ['', Validators.compose([
			  Validators.required,
			  Validators.minLength(8),
			  Validators.maxLength(30),
			  Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
			])]
	  	});
	}

	ngOnInit() {}

	back() {
		this. _location.back()
	}

	async onSubmit(values) {
		console.log('values', values);

		this.home.recover(values.email).then( success => {
			this.presentToast('Se le ha enviado un correo de verificación, por favor revise su bandeja de entrada o spam');
		}).catch( error => {
			console.log('error', error);
		})
	}

	async presentToast(message) {
		const toast = await this.toastController.create({
		  message: message,
		  duration: 2000
		});
		toast.present();
	}

}
