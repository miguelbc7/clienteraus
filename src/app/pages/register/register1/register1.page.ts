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

  constructor( public formBuilder: FormBuilder, private router: Router) {

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

  onSubmit(values){
    console.log(values);
    this.router.navigate(["/register2"]);
  }

  ngOnInit() {
  }

}
