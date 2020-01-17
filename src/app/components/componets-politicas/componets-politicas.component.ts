import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-componets-politicas',
  templateUrl: './componets-politicas.component.html',
  styleUrls: ['./componets-politicas.component.scss'],
})
export class ComponetsPoliticasComponent implements OnInit {

  constructor(private modalCtrl: ModalController) { }

  async closeModal(){
    await this.modalCtrl.dismiss();
  }

  ngOnInit() {
  }

}


