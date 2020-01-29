import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';

@Component({
	selector: 'app-eliminar',
	templateUrl: './eliminar.page.html',
	styleUrls: ['./eliminar.page.scss'],
})

export class EliminarPage implements OnInit {
	@Input() id;

  	constructor(
		private modalCtrl: ModalController,
		private firebaseAuth: AngularFireAuth,
		private afs: AngularFirestore
	) {}

	ngOnInit() {}
	  
	delete() {
		this.firebaseAuth.auth.onAuthStateChanged(user => {
			if (user) {
				var uid = user.uid;

				var items = this.afs.doc('clientes/' + uid + '/creditcard/' + this.id);

				items.delete().then( success => {
					console.log('success');
					this.closeModal();
				}).catch( error => {
					console.log('error', error);
				})
			} else {
				
			}
		});
	}

  	closeModal(){
    	this.modalCtrl.dismiss();
  	}
}
