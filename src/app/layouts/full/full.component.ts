import { MediaMatcher } from '@angular/cdk/layout';
import {ChangeDetectorRef, Component,OnDestroy,AfterViewInit} from '@angular/core';
import { MenuItems } from '../../shared/menu-items/menu-items';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { PlatformLocation } from '@angular/common'


/** @title Responsive sidenav */
@Component({
  selector: 'app-full-layout',
  templateUrl: 'full.component.html',
  styleUrls: []
})
export class FullComponent implements OnDestroy, AfterViewInit {
  mobileQuery: MediaQueryList;
  routerPath:any

  items = ['Item 1', 'Item 2', 'Item 3', 'Item 4', 'Item 5'];

  private _mobileQueryListener: () => void;

  constructor(
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    public menuItems: MenuItems,
    private route: ActivatedRoute,
    private planform: PlatformLocation,
    private router: Router
  ) {
    this.mobileQuery = media.matchMedia('(min-width: 768px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);

    //去掉路由前面的'/'
    this.planform.pathname.substr(1);
    //同时具有监听的功能
      this.router.events.subscribe((data) => {
        //data返回一堆路由事件，所有得筛选自己需要的，这里选择路由导航结束之后
        if(data instanceof NavigationEnd){
          this.routerPath = data.url.substr(1);
        }
      })
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }

  ngOnInit(): void {}

  ngAfterViewInit() {}

  getMediaRoute() {
    return this.routerPath === 'mission'
  }
}
