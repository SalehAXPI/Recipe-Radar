import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'firstLetterUppercase',
})
export class FirstLetterUppercasePipe implements PipeTransform {
  transform(value: string): string {
    return value.slice(0, 1).toUpperCase() + value.slice(1);
  }
}
