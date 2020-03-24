import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-politicas',
  templateUrl: './politicas.page.html',
  styleUrls: ['./politicas.page.scss'],
})

export class PoliticasPage implements OnInit {

	constructor(
    	private modalController: ModalController
	) {}

	ngOnInit() {}

	async close() {
		this.modalController.dismiss();
	}

}
