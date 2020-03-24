import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { NewPasswordPage } from '../modals/new-password/new-password.page';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from '@angular/fire/database';
import { ToastController } from '@ionic/angular';
import { PoliticasPage } from '../modals/politicas/politicas.page';
import { TerminosPage } from '../modals/terminos/terminos.page';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  encapsulation: ViewEncapsulation.None
})

export class LoginPage implements OnInit {

  	public login_form: FormGroup;
  	var_u: string = "username";
  	passwordType: string = "password";
  	passwordShown: boolean = false;
  	validation_messages = {
    	'username': [
			{ type: 'required', message: 'Correo ó Teléfono requerido' },
			{ type: 'minlength', message: 'Debe ser mayor de 5 caracteres' },
			{ type: 'maxlength', message: 'Debe ser menor de 30 caracteres.' }
      	],
      	'password': [
            { type: 'required', message: 'Contraseña Rederida' },
            { type: 'minlength', message: 'Debe ser mayor de 8 caracteres' },
            { type: 'maxlength', message: 'Debe ser menor de 15 caracteres.' },
            { type: 'pattern', message: 'Su contraseña debe contener al menos una mayúscula, una minúscula y un número.' }
        ]
	}
	
  	constructor(
		private modalCtrl: ModalController,
		public formBuilder: FormBuilder,
		private router: Router,
		private firebaseAuth: AngularFireAuth,
		private db: AngularFireDatabase,
		public toastController: ToastController
	) {
        this.login_form = formBuilder.group({
          	username: ['', Validators.compose([
            	Validators.required,
            	Validators.minLength(8),
            	Validators.maxLength(30)
          	])],
          	password: ['', Validators.compose([
            	Validators.required,
            	Validators.minLength(8),
            	Validators.maxLength(15),
            	/* Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9]+$') */
          	])],
		  });
		  localStorage.setItem('country','');
		  localStorage.setItem('city', '');
		  localStorage.setItem('address', '');
		  localStorage.setItem('zipcode', '');
		  localStorage.setItem('name', '');
		  localStorage.setItem('lastname', '');
		  localStorage.setItem('dni', '');
		  localStorage.setItem('birthdate', '');

		  
	}
	   
	ngOnInit() {}

	async newPassword() {
		const modal = await this.modalCtrl.create({
			component: NewPasswordPage,
			cssClass: 'sizeModal'
		});

		await modal.present();
	}

	public togglePassword() {
		if(this.passwordShown) {
			this.passwordShown = false;
			this.passwordType = "password";
		} else {
			this.passwordShown = true;
			this.passwordType = "text";
		}
  	}

	async onSubmit(values) {
		var email = this.login_form.value.username;
		var password = this.login_form.value.password;

		this.firebaseAuth.auth.signInWithEmailAndPassword(email, password).then(value => {
			console.log('Nice, it worked!');
			var uid = value.user.uid;

			this.db.list('clientes/' + uid).valueChanges().subscribe( success => {
				console.log('success', success);
				localStorage.setItem('uid', uid);
				this.login_form.reset();
				this.router.navigate(["/home"]);
			}, error => {
				console.log('error', error);
				this.presentToast('El usuario no es un cliente');
			});
		}).catch(err => {
			console.log('Something went wrong:',err.message);
			this.presentToast(err.message);
		});
	}

	async presentToast(message) {
		const toast = await this.toastController.create({
		  message: message,
		  duration: 2000
		});
		toast.present();
	}

	async acceptPoliticas() {
		const modal = await this.modalCtrl.create({
			component: PoliticasPage,
			cssClass: 'calculate'
		});

		return await modal.present();
	}

	async acceptTerminos () {
		const modal = await this.modalCtrl.create({
			component: TerminosPage,
			cssClass: 'calculate'
		});

		return await modal.present();
	}

	async goToRecovery() {
		this.router.navigate(['recovery']);
	}

}
