import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { SaldoFamiliaPage } from './saldo-familia.page';

import { SharedModule } from '../sharedmodals/shared.module';

const routes: Routes = [
  {
    path: '',
    component: SaldoFamiliaPage
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
  declarations: [SaldoFamiliaPage]
})
export class SaldoFamiliaPageModule {}
