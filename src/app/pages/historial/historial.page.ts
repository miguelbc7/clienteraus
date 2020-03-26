import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireDatabase } from '@angular/fire/database';

@Component({
	selector: 'app-historial',
	templateUrl: './historial.page.html',
	styleUrls: ['./historial.page.scss'],
})

export class HistorialPage implements OnInit {
	enviados;
	enviados2;
	elength;
	recibidos;
	recibidos2;
	rlength;
	showItem = false;
	showItem2 = false;
	showItem3 = false;
	uid;
	date;
	date2;
	  
	constructor(
		private db: AngularFireDatabase,
		private auth: AngularFireAuth,
	) {}

  	ngOnInit() {
		var uid = localStorage.getItem('uid');
		this.uid = uid
		this.getTransactions(uid);
	}

	expand(index, type){
		if(type == 1) {
			var env = this.enviados;
			env[index].arrow = !env[index].arrow;
			this.enviados = env;
		} else if(type == 2) {
			var rec = this.recibidos;
			rec[index].arrow = !rec[index].arrow;
			this.enviados = rec;
		}
	}

	async getTransactions(uid) {
		var r1 = this.db.list('transactions/' + uid).valueChanges().subscribe( (data: any) => {
			r1.unsubscribe();
			
			var array1 = [];
			var array2 = [];
			var i = 0;
			var j = 0;

			data.forEach( row => {
				if(row.mode == 'egreso') {
					row['arrow'] = false;
					array1.push(row);
					i++;
				} else if(row.mode == 'ingreso') {
					row['arrow'] = false;
					array2.push(row);
					j++;
				}
			});

			this.elength = i;
			this.rlength = j;
			this.enviados = array1;
			this.enviados2 = array1;
			this.recibidos = array2;
			this.recibidos2 = array2;
		});
	}

	filter(mode, type) {
		if(mode == 'week') {
			if(type == 1) {
				var env = this.filterDatesByCurrentWeek(this.enviados2);
				this.enviados = env;
			} else if(type == 2) {
				var rec = this.filterDatesByCurrentWeek(this.recibidos2);
				this.recibidos = rec;
			}
		} else if(mode == 'month') {
			if(type == 1) {
				var env = this.filterDatesByCurrentMonth(this.enviados2);
				this.enviados = env;
			} else if(type == 2) {
				var rec = this.filterDatesByCurrentMonth(this.recibidos2);
				this.recibidos = rec;
			}
		} else if(mode == 'date') {
			if(type == 1) {
				var env = this.filterDatesByCurrentDate(this.enviados2, type);
				this.enviados = env;
			} else if(type == 2) {
				var rec = this.filterDatesByCurrentDate(this.recibidos2, type);
				this.recibidos = rec;
			}
		}
	}

	getWeekDates() {
		let now = new Date();
		let dayOfWeek = now.getDay(); //0-6
		let numDay = now.getDate();
	  
		let start = new Date(now); //copy
		start.setDate(numDay - dayOfWeek);
		start.setHours(0, 0, 0, 0);
	  
		let end = new Date(now); //copy
		end.setDate(numDay + (7 - dayOfWeek));
		end.setHours(0, 0, 0, 0);
	  
		return [start, end];
	}

	getMonthsDates() {
		let now = new Date();
		let dayOfWeek = now.getDay(); //0-6
		let numDay = now.getDate();
	  
		let start = new Date(now); //copy
		start.setDate(numDay - dayOfWeek);
		start.setHours(0, 0, 0, 0);
	  
		let end = new Date(now); //copy
		end.setDate(numDay + (30 - dayOfWeek));
		end.setHours(0, 0, 0, 0);
	  
		return [start, end];
	}

	getDates(date) {
		let now = new Date();
		let dayOfWeek = now.getDay(); //0-6
		let numDay = now.getDate();
	  
		let start = new Date(now); //copy
		let end = new Date(date); //copy
		var dat = this.compareDates(start, end);

		if(dat == 'a') {
			start.setHours(0, 0, 0, 0);
			end.setHours(0, 0, 0, 0);
			return [end, start];
		} else if(dat == 'b') {
			end.setHours(0, 0, 0, 0);
			start.setHours(0, 0, 0, 0);
			return [start, end];
		} else if(dat == 'c') {
			end.setHours(0, 0, 0, 0);
			start.setHours(0, 0, 0, 0);
			return [start, end];
		}
	}
	
	compareDates(now, date) {
		if(+now > +date) {
			return 'a';
		} else if(+now < +date) {
			return 'b';
		} else {
			return 'c';
		}
	}
	  
	filterDatesByCurrentWeek(dates){
		let [start, end] = this.getWeekDates();
		return dates.filter(d => { 
			let dd = new Date(d.date);
			var ddd = (+dd >= +start && +dd < +end);
			return ddd;
		});
	}

	filterDatesByCurrentMonth(dates){
		let [start, end] = this.getWeekDates();
		return dates.filter(d => { 
			let dd = new Date(d.date);
			var ddd = (+dd >= +start && +dd < +end);
			return ddd;
		});
	}

	filterDatesByCurrentDate(dates, type){
		if(type == 1) {
			let [start, end] = this.getDates(this.date2);

			console.log('dates', dates);
			console.log('start', start);
			console.log('end', end);

			return dates.filter(d => { 
				let dd = new Date(d.date);
				var ddd = (+dd >= +start && +dd < +end);
				return ddd;
			});
		} else if(type == 2) {
			let [start, end] = this.getDates(this.date);

			return dates.filter(d => { 
				let dd = new Date(d.date);
				var ddd = (+dd >= +start && +dd < +end);
				return ddd;
			});
		}
	}

}
