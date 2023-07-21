import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  standalone: true,
  name: 'shortenSrt',
})
export class ShortenStrPipe implements PipeTransform {
  transform(value: string, limit: number = 20): string {
    let lastLetterIsSpace: boolean = false;
    if (value.charAt(limit) === ' ') lastLetterIsSpace = true;
    if (value.length > limit)
      return (
        value.substring(0, limit) + `${lastLetterIsSpace ? ' ...' : '...'}`
      );
    return value;
  }
}
