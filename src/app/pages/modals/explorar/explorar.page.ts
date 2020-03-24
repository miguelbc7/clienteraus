import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-explorar',
  templateUrl: './explorar.page.html',
  styleUrls: ['./explorar.page.scss'],
})
export class ExplorarPage implements OnInit {
	@Input() status: any;

  	constructor(
		public modalController: ModalController
	) {}

	ngOnInit() {
		console.log('status', this.status);
	}

	close() {
		var data = this.status;
		this.modalController.dismiss(data);
	}
 
}
