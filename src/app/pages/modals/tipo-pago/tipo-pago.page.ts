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
  uid;

  constructor(
    private modalCtrl:ModalController,
		private db: AngularFireDatabase,
    private firebaseAuth: AngularFireAuth,
    public toastController: ToastController
  ) {}

  ngOnInit() {
    this.firebaseAuth.auth.onAuthStateChanged(user => {
			if (user) {
			  	// logged in or user exists
        this.uid = user.uid;
      }
    });

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
    var ref = this.db.list('restaurantes/' + this.dataid);
    var ref2 = this.db.list('clientes/' + this.uid);

    var t = this.total.toString();

    if(t.indexOf(',') > -1) {
      this.total = t.split(',').join('.');
    }

    ref2.valueChanges().subscribe( (success2: any) => {
      console.log('ref2', success2);
      var dat;

      if(this.activation == 1) {
        var p = parseFloat(success2[0]['eats'].value) - parseFloat(this.total);

        dat = {
          eats: { 
            value: p,
            type: 1
          },
          books: {
            value: parseFloat(success2[0]['books'].value),
            type: 2
          },
          fuel: {
            value: parseFloat(success2[0]['fuel'].value),
            type: 1
          },
          gyms: {
            value: parseFloat(success2[0]['gyms'].value),
            type: 2
          },
          kids: {
            value: parseFloat(success2[0]['kids'].value),
            type: 1
          },
          propia: {
            value: parseFloat(success2[0]['propia'].value),
            type: 3
          },
          trips: {
            value: parseFloat(success2[0]['trips'].value),
            type:   2
          }
        }

        if(p > 0) {
          this.db.list('clientes').update(this.uid, { accounts: dat }).then(success => {
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
      } else if(this.activation == 2) {
        var p = parseFloat(success2[0]['propia'].value) - parseFloat(this.total);

        dat = {
          eats: { 
            value: parseFloat(success2[0]['eats'].value),
            type: 1
          },
          books: {
            value: parseFloat(success2[0]['books'].value),
            type: 2
          },
          fuel: {
            value: parseFloat(success2[0]['fuel'].value),
            type: 1
          },
          gyms: {
            value: parseFloat(success2[0]['gyms'].value),
            type: 2
          },
          kids: {
            value: parseFloat(success2[0]['kids'].value),
            type: 1
          },
          propia: {
            value: p,
            type: 3
          },
          trips: {
            value: parseFloat(success2[0]['trips'].value),
            type:   2
          }
        }

        if(p > 0) {
          this.db.list('clientes').update(this.uid, { accounts: dat }).then(success => {
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
      } else {

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
