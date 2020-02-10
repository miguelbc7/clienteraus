import { Pipe, PipeTransform } from '@angular/core';
import * as moment from "moment";

@Pipe({
	name: 'time'
})

export class TimePipe implements PipeTransform {

	transform(value: any): any {
    	let date = moment(value).format('HH');
    	return date;
	}
	  
}
