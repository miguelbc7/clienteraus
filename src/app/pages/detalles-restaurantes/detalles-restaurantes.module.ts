import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { TimePipe } from '../../pipes/time.pipe';

import { IonicModule } from '@ionic/angular';

import { DetallesRestaurantesPage } from './detalles-restaurantes.page';

const routes: Routes = [
  {
    path: '',
    component: DetallesRestaurantesPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [
    DetallesRestaurantesPage,
    TimePipe
  ],
  exports: [ TimePipe ]
})
export class DetallesRestaurantesPageModule {}
