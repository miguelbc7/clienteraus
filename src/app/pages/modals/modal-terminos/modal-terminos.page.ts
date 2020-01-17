import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-modal-terminos',
  templateUrl: './modal-terminos.page.html',
  styleUrls: ['./modal-terminos.page.scss'],
})
export class ModalTerminosPage implements OnInit {

  constructor(private modalCtrl: ModalController) { }

  ngOnInit() {
  }

  async closeModal() {
    await this.modalCtrl.dismiss();
  }


}
