import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { RobotService } from 'src/app/common/robot/robot.service';
import { IMqttMessage, MqttService } from 'ngx-mqtt';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: [],
  providers:[RobotService]
})
export class AppHeaderComponent implements OnInit{

  private subscription = new Subscription();
  private _subscription = new Subscription();
  private mqttSubscription = new Subscription();
  isConnected:boolean = false;
  subToptic:string = 'drone/UdafTZ4knia8OAsR/status';
  appHeartBeat = 0;
  setHeartBeat = 0;


  constructor(
    private robotSvc: RobotService,
    private mqttSvc: MqttService
  ) { }

  
  
  ngOnInit() {
    
    //页面刷新完成后，加载无人机和机场数据
    this._subscription.add(this.robotSvc.loadRobots().subscribe());
    this.checkSvcConnected();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this._subscription.unsubscribe();
    this.mqttSubscription.unsubscribe();

  }

  //无人机紧急悬停
  onEmergencyHoveringClick(): void {
    this.subscription.add(this.robotSvc.emergencyHovering().subscribe());
  }

  //无人机紧急降落
  onEmergencyLandingClick(): void {
    this.subscription.add(this.robotSvc.emergencyLanding().subscribe());
  }

  //定时检查APP心跳
  checkSvcConnected() {
    this.mqttSubscription = this.mqttSvc.observe(this.subToptic).subscribe( (message:IMqttMessage) => {
      let heartBeat = new Date().getTime();
      this.appHeartBeat = heartBeat;
    })
    setInterval ( () => {
      this.setHeartBeat = new Date().getTime();
      let timeDiff = Math.abs(this.setHeartBeat - this.appHeartBeat);
    
      if ( timeDiff > 2000) {
        this.isConnected = false;
      } else {
        this.isConnected = true;
      }
    },1000)
  }

}
