import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Observable } from 'rxjs/observable';

@Injectable()
export class WaylineSettingsService {
  isShowCom: Subject<any> = new Subject<any>();

  constructor() { }

  setStatus(value:boolean) {    
    this.isShowCom.next(value);
  }

  getStatus(): Observable<any> {
    return this.isShowCom.asObservable();
  }
}
