import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { FacturaPage } from './factura.page';

import { SharedModule } from '../sharedmodals/shared.module';


const routes: Routes = [
  {
    path: '',
    component: FacturaPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    RouterModule.forChild(routes)
  ],
  declarations: [FacturaPage]
})
export class FacturaPageModule {}
