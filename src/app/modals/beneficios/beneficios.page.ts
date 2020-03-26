import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireDatabase } from '@angular/fire/database';

@Component({
	selector: 'app-beneficios',
	templateUrl: './beneficios.page.html',
	styleUrls: ['./beneficios.page.scss'],
	encapsulation: ViewEncapsulation.None
})

export class BeneficiosPage implements OnInit {
	@Input() type;
	balances;
  
	constructor(
		private db: AngularFireDatabase,
		private firebaseAuth: AngularFireAuth
	) {}

  	ngOnInit() {
		this.getBalance();
	}

	  async getBalance() {
		/* this.firebaseAuth.auth.onAuthStateChanged(user => {
			if (user) {
				let uid = user.uid; */
				var uid = localStorage.getItem('uid');
				console.log('uid', uid);

				this.db.list('clientes/' + uid + '/accounts', ref => ref.orderByChild('type').equalTo(this.type)).snapshotChanges().subscribe( success => {
					console.log('success', success);

					this.balances = success;
					/* var arr: any = [];
					var c = 0;
					var length = Object.keys(success).length;
					console.log('length', length);

					for(let ang in success) {
						for(let s in success[ang]) {
							console.log('s', s);
						}
					}

					this.balances = arr; */
				}, error => {
					console.log('error', error);
				});
			/*}
			 else {
			  	// not logged in
			  	console.log('no user')
			}
	  	}) */
	}

}
