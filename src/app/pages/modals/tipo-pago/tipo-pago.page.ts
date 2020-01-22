import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from '@angular/fire/database';
import { map } from 'rxjs/operators';
import { ToastController } from '@ionic/angular';      
import { SuccessPage } from '../success/success.page';

@Component({
  selector: 'app-tipo-pago',
  templateUrl: './tipo-pago.page.html',
  styleUrls: ['./tipo-pago.page.scss'],
})
export class TipoPagoPage implements OnInit {
  @Input() total: any;
  @Input() data: any;
  @Input() dataid: any;
  restotal1;
  restotal2;
  activation: any = 1;

  constructor(
    private modalCtrl:ModalController,
		private db: AngularFireDatabase,
    private firebaseAuth: AngularFireAuth,
    public toastController: ToastController
  ) {}

  ngOnInit() {
    var tt = this.total;

    if((tt.toString()).indexOf(',') > -1) {
      this.restotal1 = (tt.toString()).split(',')[0];
      this.restotal2 = (tt.toString()).split(',')[1];
    } else {
      this.restotal1 = tt;
      this.restotal2 = '00';
    }
  }

  setActive(number) {
    this.activation = number;
  }
  
  closeModal() {
    this.modalCtrl.dismiss();
  }

  async send() {
    this.firebaseAuth.auth.onAuthStateChanged(user => {
			if (user) {
			  	// logged in or user exists
				let uid = user.uid;
        var ref = this.db.list('restaurantes/' + this.dataid);
        var ref2 = this.db.list('clientes/' + uid);

        ref2.valueChanges().subscribe( (success2: any) => {
          console.log('ref2', success2);
          var dat;

          if(this.activation == 1) {
            var p = parseFloat(success2[0]['beneficios']) - parseFloat(this.total);

            dat = {
              beneficios: p,
              intensivos: parseFloat(success2[0]['intensivos']),
              propia: parseFloat(success2[0]['propia']),
            }
          } else {
            var p = parseFloat(success2[0]['propia']) - parseFloat(this.total);

            dat = {
              beneficios: parseFloat(success2[0]['beneficios']),
              intensivos: parseFloat(success2[0]['intensivos']),
              propia: p,
            }
          }

          if(p > 0) {
            this.db.list('clientes').update(uid, { accounts: dat }).then(success => {
              ref.valueChanges().subscribe( (success: any) => {
                console.log('ref', success);
                var price = parseFloat(success[0]) + parseFloat(this.total);
      
                this.db.list('restaurantes').update(this.dataid, { balance: price }).then( success2 => {
                  this.successModal();
                });
              });
            });
          } else {
            this.presentToast('No tiene saldo en esta cuenta para enviar esa cantidad');
          }
        });
      } else {
        this.presentToast('');
      }
    });
  }

  async presentToast(message) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000
    });
    toast.present();
  }

  async successModal() {
    this.closeModal();

    const modal = await this.modalCtrl.create({
      component: SuccessPage,
      cssClass: 'successModal'
    });

    return await modal.present();
  }
}
