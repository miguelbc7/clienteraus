import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { ModalPoliticasPage } from '../modals/modal-politicas/modal-politicas.page';
import { ModalTerminosPage } from '../modals/modal-terminos/modal-terminos.page';
import { NewPasswordPage } from '../modals/new-password/new-password.page';
// import { ComponetsPoliticasComponent } from '../../components/componets-politicas/componets-politicas.component';

import { SharedModule } from '../sharedmodals/shared.module';


import { IonicModule } from '@ionic/angular';

import { LoginPage } from './login.page';

const routes: Routes = [
  {
    path: '',
    component: LoginPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    SharedModule,
    RouterModule.forChild(routes)
  ],
  declarations: [
    LoginPage,
    NewPasswordPage,
    ModalPoliticasPage,
    ModalTerminosPage,
  ],
  entryComponents: [
    NewPasswordPage,
    ModalPoliticasPage,
    ModalTerminosPage
  ]
})
export class LoginPageModule {}
