import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
// import { LoginPage } from '../../login/login.page';

@Component({
  selector: 'app-modal-politicas',
  templateUrl: './modal-politicas.page.html',
  styleUrls: ['./modal-politicas.page.scss'],
})
export class ModalPoliticasPage implements OnInit {

  constructor(private modalCtrl: ModalController) { }

  ngOnInit() {
  }

  async closeModal() {
    await this.modalCtrl.dismiss();
  }

}
