import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
	name: 'mask'
})

export class MaskPipe implements PipeTransform {

	transform(value: any): any {
		if(value) {
			let val = this.addCommas(value.toFixed(2))['__zone_symbol__value'];
			return val;
		} else {
			return 0;
		}
	}

  	toFixed(num, fixed) {
		var re = new RegExp('^-?\\d+(?:\.\\d{0,' + (fixed || -1) + '})?');
		return num.toString().match(re)[0];
	}
	
	async addCommas(nStr) {
		nStr += '';
		var x = nStr.split('.');
		var x1 = x[0];
		var x2 = x.length > 1 ? '.' + x[1] : '';
		var rgx = /(\d+)(\d{3})/;
		while (rgx.test(x1)) {
			x1 = x1.replace(rgx, '$1' + ',' + '$2');
		}
		return x1 + x2;
	}

}
