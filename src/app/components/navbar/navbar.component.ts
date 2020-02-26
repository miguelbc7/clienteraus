import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
	selector: 'app-navbar',
	templateUrl: './navbar.component.html',
	styleUrls: ['./navbar.component.scss'],
})

export class NavbarComponent implements OnInit {

	showcarrito: any;

  	constructor(
    	private router: Router,
  	) {}

	ngOnInit() {
		/* console.log('router', this.router);
		var url = this.router.url;

		if(url.indexOf('detailsproduct') > -1) {
			this.showcarrito = false;
		} else if(url.indexOf('detailsrestaurant') > -1) {
			this.showcarrito = false;
		} else {
			this.showcarrito = true;
		} */
	}

	async notificaciones() {
		this.router.navigate(['/notifications']);
	}

	async cart() {
		this.router.navigate(['/cart']);
	}
}
