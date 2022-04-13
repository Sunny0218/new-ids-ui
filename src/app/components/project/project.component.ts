import { Component, OnInit } from '@angular/core';
import { ActivatedRoute,NavigationEnd, Router } from '@angular/router'
import { PlatformLocation } from '@angular/common'
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.css']
})
export class ProjectComponent implements OnInit {
  shoeName:string
  routerPath:any;
  private subscription = new Subscription();

  constructor(
    private route: ActivatedRoute,
    private router: Router
    ) {
      //同时具有监听的功能
      this.subscription = this.router.events.subscribe((data) => {
        //data返回一堆路由事件，所有得筛选自己需要的，这里选择路由导航结束之后
        if(data instanceof NavigationEnd){
          //筛选url最后一个斜线后的路径
          let str = data.url;
          let index = str.lastIndexOf("\/");
          this.routerPath = str.substring(index + 1, str.length);
        }
      })
    }

  ngOnInit(): void {
    this.route.params.subscribe((data) => {
      this.shoeName = data.pid
    })
    localStorage.setItem('id', this.shoeName);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  getMediaRoute() {
    return this.routerPath === 'mission';
  }

}
