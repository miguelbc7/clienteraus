import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-modal-codigo',
  templateUrl: './modal-codigo.page.html',
  styleUrls: ['./modal-codigo.page.scss'],
})
export class ModalCodigoPage implements OnInit {

  constructor(private modalCtrl: ModalController) { }

  ngOnInit() {
  }

  async closeModal() {
    await this.modalCtrl.dismiss();
  }

}
