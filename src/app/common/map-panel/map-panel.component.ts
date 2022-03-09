import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';

@Component({
  selector: 'app-map-panel',
  templateUrl: './map-panel.component.html',
  styleUrls: ['./map-panel.component.css']
})
export class MapPanelComponent implements OnInit,AfterViewInit,OnDestroy {

  changeMap:boolean = true

  constructor() { }

  ngOnInit(): void {

  }

  ngAfterViewInit(): void {
  }

  ngOnDestroy(): void {

  }

  switchMap(type:any) {
    if ( type == 'amap') {
      this.changeMap = true
    } else if ( type == 'google' ) {
      this.changeMap = false;
    }
  }

}
