import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { BeneficiosPage } from '../../modals/beneficios/beneficios.page';
import { RecargarPage } from '../../modals/recargar/recargar.page';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireDatabase } from '@angular/fire/database';
import { Router } from '@angular/router';

@Component({
  	selector: 'app-options',
  	templateUrl: './options.page.html',
  	styleUrls: ['./options.page.scss'],
  	encapsulation: ViewEncapsulation.None
})

export class OptionsPage implements OnInit {

	total1;
	total2;
	uid;
	name;
	count: any = {
		count11: '0',
		count12: '00',
		count21: '0',
		count22: '00',
		count31: '0',
		count32: '00'
	};

  	constructor(
		public modalController: ModalController,
		private db: AngularFireDatabase,
		private firebaseAuth: AngularFireAuth,
		private router: Router
  	) {}

  	ngOnInit() {
		this.uid = localStorage.getItem('uid');
		this.getName();
		this.getBalance();

	}

  	async modalBeneficios(type) {
    	const modal = await this.modalController.create({
			component: BeneficiosPage,
			componentProps: {
				type: type
			},
      		cssClass: 'modalBeneficios'
		});
	
    	return await modal.present();
	}

	async modalRecargar() {
		const modal = await this.modalController.create({
		  	component: RecargarPage,
		  	cssClass: 'modalRecargar'
		});

		return await modal.present();
	}

	getName() {
		this.db.object('clientes/' + this.uid).valueChanges().subscribe( success => {
			console.log('success', success['name']);
			var name = success['name'];
			var lastname = success['lastname'];
			this.name = name + ' ' + lastname;
		});
	}
	  
	async getBalance() {
		
		this.db.list('clientes/' + this.uid + '/accounts').valueChanges().subscribe( success => {
			let t: any = 0;
			let c: any = 0;
			let c2: any = 0;
			let c3: any = 0;

			success.forEach( (row: any) => {
				if(row.type == 1 || row.type == '1') {
					c += parseFloat(row.value);
				} else if(row.type == 2 || row.type == '2') {
					c2 += parseFloat(row.value);
				} else if(row.type == 3 || row.type == '3') {
					c3 += parseFloat(row.value);
				}

				t += parseFloat(row.value);
			});

			if(t > 0) {
				t = t.toFixed(2);
			} else {
				t = 0;
			}

			if(c > 0) {
				c = c.toFixed(2);
			} else {
				c = 0;
			}

			if(c2 > 0) {
				c2 = c2.toFixed(2);
			} else {
				c2 = 0;
			}

			if(c3 > 0) {
				c3 = c3.toFixed(2);
			} else {
				c3 = 0;
			}

			if((t.toString()).indexOf('.') > -1) {
				this.total1 = (t.toString()).split('.')[0];
				this.total2 = (t.toString()).split('.')[1];
			} else if((t.toString()).indexOf(',') > -1) {
				this.total1 = (t.toString()).split(',')[0];
				this.total2 = (t.toString()).split(',')[1];
			} else {
				this.total1 = t;
				this.total2 = '00';
			}

			if((c.toString()).indexOf('.') > -1) {
				this.count.count11 = (c.toString()).split('.')[0];
				this.count.count12 = (c.toString()).split('.')[1];
			} else if((c.toString()).indexOf(',') > -1) {
				this.count.count11 = (c.toString()).split(',')[0];
				this.count.count12 = (c.toString()).split(',')[1];
			} else {
				this.count.count11 = c;
				this.count.count12 = '00';
			}

			if((c2.toString()).indexOf('.') > -1) {
				this.count.count21 = (c2.toString()).split('.')[0];
				this.count.count22 = (c2.toString()).split('.')[1];
			} else if((c2.toString()).indexOf(',') > -1) {
				this.count.count21 = (c2.toString()).split(',')[0];
				this.count.count22 = (c2.toString()).split(',')[1];
			} else {
				this.count.count21 = c2;
				this.count.count22 = '00';
			}

			if((c3.toString()).indexOf('.') > -1) {
				this.count.count31 = (c3.toString()).split('.')[0];
				this.count.count32 = (c3.toString()).split('.')[1];
			} else if((c3.toString()).indexOf(',') > -1) {
				this.count.count31 = (c3.toString()).split(',')[0];
				this.count.count32 = (c3.toString()).split(',')[1];
			} else {
				this.count.count31 = c3;
				this.count.count32 = '00';
			}
		}, error => {
			console.log('error', error);
		});
	}

	async logout() {
		this.firebaseAuth.auth.signOut();
		localStorage.removeItem('uid');
		this.router.navigate(['/login']);
	}
}
