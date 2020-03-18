import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';

import { ExplorarPage } from '../../pages/modals/explorar/explorar.page';


@Component({
	selector: 'app-navbar',
	templateUrl: './navbar.component.html',
	styleUrls: ['./navbar.component.scss'],
})

export class NavbarComponent implements OnInit {

	showcarrito: any;

  	constructor(
		private router: Router,
		public modalController: ModalController
  	) {}

	ngOnInit() {

	}

	async notificaciones() {
		this.router.navigate(['/notifications']);
	}

	async cart() {
		this.router.navigate(['/cart']);
	}

	async explorar() {
		const modal = await this.modalController.create({
			component: ExplorarPage,
			cssClass: 'modalExplorar',
		});

		return await modal.present();
	}
}
