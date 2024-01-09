import { Pipe, PipeTransform } from '@angular/core';
import dayjs from 'dayjs';
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime)

@Pipe({
  name: 'dateFormat',
  standalone: true
})
export class DateFormatPipe implements PipeTransform {

  transform(date: string): string {
    const parsedDate = Date.parse(date)
    return parsedDate ? dayjs(parsedDate).fromNow() : date;
  }

}
