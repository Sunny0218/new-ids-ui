import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { CommonPanelService } from '../common-panel.service';
import { IMqttMessage, MqttService } from 'ngx-mqtt';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-fpv-panel',
  templateUrl: './fpv-panel.component.html',
  styleUrls: ['./fpv-panel.component.css'],
  providers:[CommonPanelService]
})
export class FpvPanelComponent implements OnInit {

  //机器编号
  drone_ref_num: string;
  airport_ref_num: string;

  batteryLevel:number = 0;
  isFlying: boolean = false;

  //订阅获取无人机、遥控状态主题
  subTopic:string;
  //发布转化摄像模式主题
  pubTopic:string;
  //订阅获取回馈消息主题
  commandTopic:string;

  //gimbal上下范围参数
  pitchValue:number = 0;

  //无人机摄像模式列表
  modeList = [
    {
      mName: 'VO', 
      mode:'VISUAL_ONLY'
    },
    {
      mName: 'TO', 
      mode:'THERMAL_ONLY'
    },
    {
      mName: 'PIP', 
      mode:'PIP'
    }];

  //定义摄像模式默认参数
  modeCommand: any = {
    "jsonrpc" : "2.0",
    "id" : "",
    "method" : "CameraLensSetDisplayMode",
    "params" : {"Display_Mode": "VISUAL_ONLY"}
  };

  //定义gimbal默认参数
  gimbalCommand:any = {
    "jsonrpc" : "2.0",
    "id" : "",
    "method" : "GimbalRotate",
    "params" : {"Pitch": "0.0","Yaw":"0.0"}
  };

  private droneSubscription = new Subscription();
  private commandSubscription = new Subscription();

  constructor( 
    private commonSvc: CommonPanelService,
    private mqttSvc: MqttService
    ) { }

  ngOnInit(): void {
    this.fetchRefNum()
  }

  ngOnDestroy(): void {
    this.droneSubscription.unsubscribe();
    this.commandSubscription.unsubscribe();  
  }

  //通过commonSvc异步获取机器编号
  private async fetchRefNum() {
    const data = await this.commonSvc.getRequest( environment.apiHost + "/robots").toPromise();
    if( data['data'] ){
      var resp = data['data'];
      resp.forEach( e => {
        if(e['type']==='DRONE'){
          this.drone_ref_num = e['ref_num'];
        } else if(e['type']==='AIRPORT'){
          this.airport_ref_num = e['ref_num'];
        }
      });

      if (this.drone_ref_num != null) {
        this.subTopic = 'drone/'+this.drone_ref_num+'/status';
        this.pubTopic = 'drone/'+this.drone_ref_num+'/rpc/send';
        this.commandTopic = 'drone/'+this.drone_ref_num+'/rpc/recv';
        this.mqttGetDroneStatus();
      }
    }
  }

  //通过mqtt获取无人机和遥控状态
  mqttGetDroneStatus() {
    this.droneSubscription = this.mqttSvc.observe(this.subTopic).subscribe( (message:IMqttMessage) => {
      let item = JSON.parse(message.payload.toString());

      this.batteryLevel = item['batteryLevel'];
      this.isFlying = item['isFlying'];
    })
  }

  //转换摄像模式开关
  modeSwitch(mode:any) {
    this.modeCommand['id'] = "ids-" + new Date().getTime();
    this.modeCommand['params']['Display_Mode'] = mode;
    var message = JSON.stringify(this.modeCommand);
    this.mqttSvc.publish(this.pubTopic,message,{qos: 1, retain: false}).subscribe();
  }

  //gimbal上下范围
  pitchSlider($event) {
    this.gimbalCommand['id'] = "ids-" + new Date().getTime();
    this.gimbalCommand['params']['Pitch'] = this.pitchValue;
    var message = JSON.stringify(this.gimbalCommand)
    this.mqttSvc.publish(this.pubTopic,message,{qos: 1, retain: false}).subscribe();
  }

  //gimbal逆时针旋转10°
  yaw_rotate_left() {
    this.gimbalCommand['id'] = "ids-" + new Date().getTime();
    this.gimbalCommand['params']['Yaw'] = '-10';
    var message = JSON.stringify(this.gimbalCommand)
    this.mqttSvc.publish(this.pubTopic,message,{qos: 1, retain: false}).subscribe();
  }

  //gimbal顺时针旋转10°
  yaw_rotate_right() {
    this.gimbalCommand['id'] = "ids-" + new Date().getTime();
    this.gimbalCommand['params']['Yaw'] = '10';
    var message = JSON.stringify(this.gimbalCommand)
    this.mqttSvc.publish(this.pubTopic,message,{qos: 1, retain: false}).subscribe();
    
  }

  //获取回馈消息
  mqttCommandRsp() {
    this.commandSubscription = this.mqttSvc.observe(this.commandTopic).subscribe( (message:IMqttMessage) => {
      let item = JSON.parse(message.payload.toString());
      console.log(item)
    })
  }

}
