import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { AgregarTarjetaPage } from './agregar-tarjeta.page';

const routes: Routes = [
  {
    path: '',
    component: AgregarTarjetaPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [AgregarTarjetaPage]
})
export class AgregarTarjetaPageModule {}
