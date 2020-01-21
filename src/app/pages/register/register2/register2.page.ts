import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
	selector: 'app-register2',
	templateUrl: './register2.page.html',
	styleUrls: ['./register2.page.scss'],
})

export class Register2Page implements OnInit {

	public register2: FormGroup;
  	validation_messages = {
    	'country': [
        	{ type: 'required', message: 'Debe ingresar un país.' },
        	{ type: 'maxlength', message: 'Debe ser menor de 30 caracteres.' }
      	],
      	'city': [
        	{ type: 'required', message: 'Debe ingresar una ciudad.' },
        	{ type: 'maxlength', message: 'Debe ser menor de 30 caracteres.' }
      	],
      	'address': [
        	{ type: 'required', message: 'Debe ingresar una dirección.' },
        	{ type: 'maxlength', message: 'Debe ser menor de 20 caracteres.' }
      	],
      	'zipcode': [
	        { type: 'required', message: 'Debe ingresar un código postal.' },
        	{ type: 'maxlength', message: 'Debe ser menor de 20 caracteres.' }
      	]
    }

  	constructor(
		public formBuilder: FormBuilder,
		private router: Router
	) {		
		this.register2 = formBuilder.group({
			country: ['', Validators.compose([
				Validators.required,
				Validators.maxLength(30)
			])],
			city: ['', Validators.compose([
				Validators.required,
			  	Validators.maxLength(30)
			])],
			address: ['', Validators.compose([
			  	Validators.required,
			  	Validators.maxLength(20)
			])],
			zipcode: ['', Validators.compose([
				Validators.required,
				Validators.maxLength(20)
			])]
		});
  	}

	ngOnInit() {}
	  
	onSubmit(values){
    	localStorage.setItem('country', this.register2.value.country);
    	localStorage.setItem('city', this.register2.value.city);
    	localStorage.setItem('address', this.register2.value.address);
		localStorage.setItem('zipcode', this.register2.value.zipcode);
		
    	this.router.navigate(["/register3"]);
  	}
}
