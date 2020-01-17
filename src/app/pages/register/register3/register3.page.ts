import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
// import { PasswordValidator } from '../../validators/password.validator';

import { ModalPoliticasPage } from '../../modals/modal-politicas/modal-politicas.page';
import { ModalTerminosPage } from '../../modals/modal-terminos/modal-terminos.page';
import { ModalCodigoPage } from '../../modals/modal-codigo/modal-codigo.page';

@Component({
  selector: 'app-register3',
  templateUrl: './register3.page.html',
  styleUrls: ['./register3.page.scss'],
})
export class Register3Page implements OnInit {

  public register3: FormGroup;
  // public matching_passwords_group: FormGroup;

  passwordType: string = "password";
  passwordShown: boolean = false;

  passwordType2: string = "password";
  passwordShown2: boolean = false;
  constructor(private modalCtrl: ModalController, public formBuilder: FormBuilder, private router: Router) {
    
    this.register3 = formBuilder.group({
      email: ['', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ])],
      phone: ['', Validators.compose([
        Validators.required,
      ])],
      // polit: ['', Validators.compose([
      //   Validators.required,
      // ])],
      polit: new FormControl(true, Validators.pattern('true')),
      terms: new FormControl(true, Validators.pattern('true'))
      // term: ['', Validators.compose([
      //   Validators.required,
      // ])]
  });

  // this.matching_passwords_group = new FormGroup({
  //   password: new FormControl('', Validators.compose([
  //     Validators.minLength(5),
  //     Validators.required,
  //     Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9]+$')
  //   ])),
  //   confirm_password: new FormControl('', Validators.required)
  // }, (formGroup: FormGroup) => {
  //   return PasswordValidator.areEqual(formGroup);
  // });
   }

  ngOnInit() {
  }

  async acceptPoliticas() {
    const modal = await this.modalCtrl.create({
      component: ModalPoliticasPage,
    });

    await modal.present();
  }


  async modalCodigo() {
    const modal = await this.modalCtrl.create({
      component: ModalCodigoPage,
      cssClass: 'sizeCodigo'
    });

    await modal.present();
  }


  async acceptTerminos() {
    const modal = await this.modalCtrl.create({
      component: ModalTerminosPage,
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

  public revelarConfirmacion() {
    if(this.passwordShown2){
      this.passwordShown2 = false;
      this.passwordType2 = "password";
    }else {
      this.passwordShown2 = true;
      this.passwordType2 = "text";
    }
  }

  // onSubmit(values){
  //   console.log(values);
  //   this.router.navigate(["/home"]);
  // }

}
