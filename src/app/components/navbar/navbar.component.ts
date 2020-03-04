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

	}

	async notificaciones() {
		this.router.navigate(['/notifications']);
	}

	async cart() {
		this.router.navigate(['/cart']);
	}
}
