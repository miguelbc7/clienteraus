import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { Storage } from '@ionic/storage';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.page.html',
  styleUrls: ['./notifications.page.scss'],
  encapsulation: ViewEncapsulation.None
})
export class NotificationsPage implements OnInit {
  
  title = "Notificaciones";
	imgStatus = 1;
	notifications: any[];
	favorites: any[];
	base_path = environment.url;
	token:any;

  constructor(
    private db: AngularFireDatabase,
		private storage: Storage,
		private http: HttpClient,
		private router: Router
  ) {}

  ngOnInit() {
    var segment = document.querySelector('ion-segment');
    	var slides = document.querySelector('ion-slides');
    	var status;
    
    	segment.addEventListener('ionChange', (ev) => onSegmentChange(ev));
    	slides.addEventListener('ionSlideDidChange', (ev) => onSlideDidChange(ev));

    	function onSegmentChange(ev) {
      		slideTo(ev.detail.value);
    	}

    	function slideTo(index) {
      		slides.slideTo(index);
    	}

    	async function onSlideDidChange(ev) {
      		var index = await slides.getActiveIndex();
      		clickSegment(index);
    	}

	    function clickSegment(index) {
    		status = index;
		}
		
		this.getNotifications();
		this.getFavorites();
  }

  changeTitle(data) {
		this.title = data;

		if(data === 'Notificaciones') {
			this.imgStatus = 1;
		} else if(data == 'Favoritos') {
			this.imgStatus = 2;
		}
  }
  
  async getNotifications() {
		await this.storage.get('_uid').then(res=>{
			var uid = res;

			var itemsRef = this.db.list('notifications/' + uid);
			var itemsRef2 = this.db.list('notifications/' + uid);
		
			itemsRef.snapshotChanges(['child_added']).subscribe(actions => {
				var array = [];
				
				actions.forEach((action, i) => {
					array.push(action.payload.val());
					array[i]['key'] = action.key
				});

				console.log('array', array);
				this.notifications = array;
			});
		});
	}

	async getFavorites() {
		await this.storage.get('_uid').then(res=>{
			var uid = res;
			
			this.db.list('notifications/' + uid, ref => ref.orderByChild('like').equalTo(true)).snapshotChanges(['child_added']).subscribe(actions => {
				var array2 = [];

				actions.forEach((action, i) => {
					array2.push(action.payload.val());
					array2[i]['key'] = action.key
				});

				console.log('array2', array2);
				this.favorites = array2;
			});
		});
	}

	async like(id, value, type) {
		await this.storage.get('_uid').then(res=>{
			var uid = res;

			let data = {
				id_restaurant: uid,
				id_notification: id,
				like: value
			};

			return this.http.put(this.base_path + 'notifications/like', JSON.stringify(data), {
				headers: new HttpHeaders({
					'Content-Type': 'application/json',
				}), params: {
					token: '',
				}
			}).subscribe( 
				res => { 
					console.log('res', res) 
					if(type == 1) {
						setTimeout( () => {
							this.getNotifications();
						}, 600);
					} else if(type == 2) {
						setTimeout( () => {
							this.getFavorites();
						}, 600);
					}
				},
				err => (console.log('err', err))
			);
		});
	}

	async read(id) {
		this.router.navigate(['/detailsnotifications', id]);
	}
}
