import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-component-terminos',
  templateUrl: './component-terminos.component.html',
  styleUrls: ['./component-terminos.component.scss'],
})
export class ComponentTerminosComponent implements OnInit {

  constructor(private modalCtrl: ModalController) { }
  ngOnInit() {}
  async closeModal(){
    await this.modalCtrl.dismiss();
  }
}


