import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LoadingService {
  isFetching = new BehaviorSubject<boolean>(false);
  error = new Subject<undefined | string>();
}
