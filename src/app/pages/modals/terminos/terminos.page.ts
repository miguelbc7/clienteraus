import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-terminos',
  templateUrl: './terminos.page.html',
  styleUrls: ['./terminos.page.scss'],
})

export class TerminosPage implements OnInit {

	constructor(
    	private modalController: ModalController
	) {}

	ngOnInit() {}

	async close() {
		this.modalController.dismiss();
	}
}
