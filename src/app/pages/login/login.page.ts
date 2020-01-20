import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ModalPoliticasPage } from '../modals/modal-politicas/modal-politicas.page';
import { ModalTerminosPage } from '../modals/modal-terminos/modal-terminos.page';
import { NewPasswordPage } from '../modals/new-password/new-password.page';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  encapsulation: ViewEncapsulation.None
})
export class LoginPage implements OnInit {

  public login_form: FormGroup;

  var_u: string = "username";

  passwordType: string = "password";
  passwordShown: boolean = false;
  constructor(private modalCtrl: ModalController, public formBuilder: FormBuilder, private router: Router) {

        this.login_form = formBuilder.group({
          username: ['', Validators.compose([
            Validators.required,
            Validators.minLength(8),
            Validators.maxLength(30)
          ])],
          password: ['', Validators.compose([
            Validators.required,
            Validators.minLength(8),
            Validators.maxLength(15),
            Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9]+$')
            // Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]+$')

          ])],
      });
   }


   onSubmit(values){
    console.log(values);
    this.router.navigate(["/home"]);
  }

  validation_messages = {
    'username': [
        { type: 'required', message: 'Correo ó Teléfono requerido' },
        { type: 'minlength', message: 'Debe ser mayor de 5 caracteres' },
        { type: 'maxlength', message: 'Debe ser menor de 30 caracteres.' }
      ],
      'password': [
            { type: 'required', message: 'Contraseña Rederida' },
            { type: 'minlength', message: 'Debe ser mayor de 8 caracteres' },
            { type: 'maxlength', message: 'Debe ser menor de 15 caracteres.' },
            { type: 'pattern', message: 'Su contraseña debe contener al menos una mayúscula, una minúscula y un número.' }
          ]
    }

  ngOnInit() {


  }

  // validation_messages = {
  //   'username': [
  //     { type: 'required', message: 'Username is required.' },
  //     { type: 'minlength', message: 'Username must be at least 5 characters long.' },
  //     { type: 'maxlength', message: 'Username cannot be more than 25 characters long.' },
  //     { type: 'pattern', message: 'Your username must contain only numbers and letters.' },
  //     { type: 'validUsername', message: 'Your username has already been taken.' }
  //   ],
  //   'name': [
  //     { type: 'required', message: 'Name is required.' }
  //   ],
  //   'lastname': [
  //     { type: 'required', message: 'Last name is required.' }
  //   ],
  //   'email': [
  //     { type: 'required', message: 'Email is required.' },
  //     { type: 'pattern', message: 'Please wnter a valid email.' }
  //   ],
  //   'phone': [
  //     { type: 'required', message: 'Phone is required.' },
  //     { type: 'validCountryPhone', message: 'The phone is incorrect for the selected country.' }
  //   ],
  //   'password': [
  //     { type: 'required', message: 'Password is required.' },
  //     { type: 'minlength', message: 'Password must be at least 5 characters long.' },
  //     { type: 'pattern', message: 'Your password must contain at least one uppercase, one lowercase, and one number.' }
  //   ],
  //   'confirm_password': [
  //     { type: 'required', message: 'Confirm password is required.' }
  //   ],
  //   'matching_passwords': [
  //     { type: 'areEqual', message: 'Password mismatch.' }
  //   ],
  //   'terms': [
  //     { type: 'pattern', message: 'You must accept terms and conditions.' }
  //   ],
  // };

  // onSubmit(values){
  //   console.log(values);
  //   this.router.navigate(["/home"]);
  // }



  async presentPoliticas() {
    const modal = await this.modalCtrl.create({
      component: ModalPoliticasPage,
    });

    await modal.present();
  }

  async presentTerminos() {
    const modal = await this.modalCtrl.create({
      component: ModalTerminosPage,
    });

    await modal.present();
  }

  async newPassword() {
    const modal = await this.modalCtrl.create({
      component: NewPasswordPage,
      cssClass: 'sizeModal'
    });
    await modal.present();
  }

  public togglePassword() {
    if(this.passwordShown){
      this.passwordShown = false;
      this.passwordType = "password";
    }else {
      this.passwordShown = true;
      this.passwordType = "text";
    }
  }

}
