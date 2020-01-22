import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
/* import { ModalPoliticasPage } from '../../modals/modal-politicas/modal-politicas.page';
import { ModalTerminosPage } from '../../modals/modal-terminos/modal-terminos.page';
import { ModalCodigoPage } from '../../modals/modal-codigo/modal-codigo.page'; */
import { AngularFireDatabase } from '@angular/fire/database';

@Component({
	selector: 'app-register3',
  	templateUrl: './register3.page.html',
  	styleUrls: ['./register3.page.scss'],
})

export class Register3Page implements OnInit {
	  
	public register3: FormGroup;
  	passwordType: string = "password";
  	passwordShown: boolean = false;
  	passwordType2: string = "password";
  	passwordShown2: boolean = false;

  	constructor(
    	private modalCtrl: ModalController,
    	public formBuilder: FormBuilder,
    	private router: Router,
		private firebaseAuth: AngularFireAuth,
		private db: AngularFireDatabase,
	) {
		console.log(localStorage.getItem('city'));

    	this.register3 = formBuilder.group({
      		email: ['', Validators.compose([
        		Validators.required,
        		Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      		])],
      		phone: ['', Validators.compose([
        		Validators.required,
			])],
			password: ['', Validators.compose([
				Validators.required,
			])],
			cpassword: ['', Validators.compose([
				Validators.required,
			])],
      		polit: new FormControl(true, Validators.pattern('true')),
      		terms: new FormControl(true, Validators.pattern('true'))
    	});
  	}

  	ngOnInit() {}

  	/* async acceptPoliticas() {
    	const modal = await this.modalCtrl.create({
      	component: ModalPoliticasPage,
    	});

    	await modal.present();
  	}

  	async modalCodigo() {
    	const modal = await this.modalCtrl.create({
      		component: ModalCodigoPage,
      		cssClass: 'sizeCodigo'
    	});

    	await modal.present();
  	}

  	async acceptTerminos() {
    	const modal = await this.modalCtrl.create({
      		component: ModalTerminosPage,
    	});

    	await modal.present();
  	} */

  	public togglePassword() {
    	if(this.passwordShown) {
      		this.passwordShown = false;
      		this.passwordType = "password";
    	} else {
      		this.passwordShown = true;
      		this.passwordType = "text";
    	}
  	}

  	public revelarConfirmacion() {
    	if(this.passwordShown2) {
      		this.passwordShown2 = false;
      		this.passwordType2 = "password";
    	} else {
      		this.passwordShown2 = true;
      		this.passwordType2 = "text";
    	}
	}
	  
	async onSubmit(values) {
		var email = this.register3.value.email;
		var password = this.register3.value.password;
		var phone = this.register3.value.phone;
		var name = localStorage.getItem('name');
		var lastname = localStorage.getItem('lastname');
		var dni = localStorage.getItem('lastname');
		var birthdate = localStorage.getItem('birthdate');
		var country = localStorage.getItem('country');
		var city = localStorage.getItem('city');
		var address = localStorage.getItem('address');
		var zipcode = localStorage.getItem('zipcode');
		
		this.firebaseAuth.auth.createUserWithEmailAndPassword(email, password).then(value => {
			var uid = value.user.uid;

			var b = {
				beneficios: 0,
				intensivos: 0,
				propia: 0
			}

			var a = { 
				accounts: b,
				name: name,
				email: email,
				lastname: lastname,
				phone: phone,
				dni: dni,
				birthdate: birthdate,
				country: country,
				city: city,
				address: address,
				zipcode: zipcode
			}

			const itemRef = this.db.object('clientes/' + uid);
			itemRef.set(a).then( success => {
				console.log('success');
				this.router.navigate(["/home"]);
			}).catch( error => {
				console.log('error');
			});
		})
		.catch(err => {
			console.log('Something went wrong:',err.message);
		});    
	}
}
