import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { RobotService } from 'src/app/common/robot/robot.service';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: [],
  providers:[RobotService]
})
export class AppHeaderComponent implements OnInit{

  private subscription = new Subscription();
  private _subscription = new Subscription();

  constructor(
    private robotSvc: RobotService,
  ) { }

  
  
  ngOnInit() {
    
    //页面刷新完成后，加载无人机和机场数据
    this._subscription.add(this.robotSvc.loadRobots().subscribe());
  }

  //无人机紧急悬停
  onEmergencyHoveringClick(): void {
    this.subscription.add(this.robotSvc.emergencyHovering().subscribe());
  }

  //无人机紧急降落
  onEmergencyLandingClick(): void {
    this.subscription.add(this.robotSvc.emergencyLanding().subscribe());
  }

}
