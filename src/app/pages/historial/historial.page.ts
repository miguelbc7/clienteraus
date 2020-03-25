import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from '@angular/fire/database';

@Component({
	selector: 'app-historial',
	templateUrl: './historial.page.html',
	styleUrls: ['./historial.page.scss'],
})

export class HistorialPage implements OnInit {
	enviados;
	elength;
	recibidos;
	rlength;
	showItem = false;
	showItem2 = false;
	showItem3 = false;
	uid;
	  
	constructor(
		private db: AngularFireDatabase,
		private auth: AngularFireAuth,
	) {}

  	ngOnInit() {
		this.uid = localStorage.getItem('uid');
		this.getTransactions(this.uid);
	}

	expand(id){

		if (id == 1){
			this.showItem = !this.showItem
		}
		if (id == 2){
			this.showItem2 = !this.showItem2
		}
		if (id == 3){
			this.showItem3 = !this.showItem3
		}
	}

	async getTransactions(uid) {
		var r1 = this.db.list('transactions', ref => ref.orderByChild('uid').equalTo(uid)).valueChanges().subscribe( (data: any) => {
			console.log('data', data);
			var array1 = [];
			var array2 = [];
			var i = 0;
			var j = 0;

			data.forEach( row => {
				if(row.typeTransaccion == 'envio' || row.typeTransaccion == 'carrito') {
					array1.push(row);
					i++;
				} else {
					array2.push(row);
					j++;
				}
			});

			this.elength = i;
			this.rlength = j;
			this.enviados = array1;
			this.recibidos = array2;
			r1.unsubscribe();
		});
	}
}
