import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
// import { LoginPage } from '../../login/login.page';

import { IonicModule } from '@ionic/angular';

import { ModalPoliticasPage } from './modal-politicas.page';

const routes: Routes = [
  {
    path: '',
    component: ModalPoliticasPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [],
  entryComponents: [
    
  ]
})
export class ModalPoliticasPageModule {}
