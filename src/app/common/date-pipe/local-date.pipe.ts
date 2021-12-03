import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'localDate'
})
export class LocalDatePipe implements PipeTransform {

  transform(value: any, type:any) {
    if( type === 'createAt') {
      let repString = value.replace(' ','T');
      let newCreateAt = new Date(Date.parse(repString + "+00:00")); 
      let CreatAt = newCreateAt.toLocaleString();
      return CreatAt;

    } else if (type === 'completeAt') {
        if (value == '') {
          return 'Not Complete'
        } else {
          let repString = value.replace(' ','T');
          let newCompleteAt = new Date(Date.parse(repString + "+00:00"));
          let completeAt = newCompleteAt.toLocaleString();
          return completeAt;
        }

    } else if (type === 'pathName') {
        return value ==  '' ? 'N/A' : value;
    }

  }

}
