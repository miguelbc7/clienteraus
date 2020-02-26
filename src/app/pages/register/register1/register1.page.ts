import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  	selector: 'app-register1',
  	templateUrl: './register1.page.html',
  	styleUrls: ['./register1.page.scss'],
  	encapsulation: ViewEncapsulation.None
})

export class Register1Page implements OnInit {

  	public register1: FormGroup;
  	validation_messages = {
    	'name': [
        	{ type: 'required', message: 'Debe ingresar un nombre.' },
        	{ type: 'maxlength', message: 'Debe ser menor de 30 caracteres.' }
      	],
      	'lastname': [
        	{ type: 'required', message: 'Debe ingresar un apellido.' },
        	{ type: 'maxlength', message: 'Debe ser menor de 30 caracteres.' }
      	],
      	'dni': [
        	{ type: 'required', message: 'Debe ingresar un DNI.' },
        	{ type: 'maxlength', message: 'Debe ser menor de 20 caracteres.' }
      	],
      	'birthdate': [
	        { type: 'required', message: 'Debe ingresar una fecha de nacimiento.' },
      	]
    }

  	constructor(
		public formBuilder: FormBuilder,
		private router: Router
	) {

    	this.register1 = formBuilder.group({
      		name: ['', Validators.compose([
        		Validators.required,
        		Validators.maxLength(30)
      		])],
      		lastname: ['', Validators.compose([
        		Validators.required,
        		Validators.maxLength(30)
      		])],
      		dni: ['', Validators.compose([
        		Validators.required,
        		Validators.maxLength(20)
      		])],
      		birthdate: ['', Validators.compose([
        		Validators.required,
      		])]
  		});
  	}

  	ngOnInit() {}

  	onSubmit(values){
    	localStorage.setItem('name', this.register1.value.name);
    	localStorage.setItem('lastname', this.register1.value.lastname);
    	localStorage.setItem('dni', this.register1.value.dni);
    	localStorage.setItem('birthdate', this.register1.value.birthdate);

		this.register1.reset();
    	this.router.navigate(["/register2"]);
  	}
}
