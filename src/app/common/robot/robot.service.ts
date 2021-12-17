import { Injectable } from '@angular/core';
import { interval, Observable, Subscription } from 'rxjs';
import { Robot, RobotStatus, AirportStatus } from './robot';
import { map, concatMap } from 'rxjs/operators';
import { ApiService } from '../remote/api.service';
import { environment } from '../../../environments/environment';
import { EventBusService, ROBOT_ON_DRONE_CHANGED, ROBOT_ON_AIRPORT_CHANGED } from 'src/app/common/remote/event-bus.service';

@Injectable()
export class RobotService {

  //返回机场最新自带参数
  public get airport(): Robot {
    let found = -1;

    for (var i = 0; i < this._robots.length; i += 1) {
      const r = this._robots[i]

      if (r.type === 'AIRPORT' && r.state === 'ACTIVE') found = i;
    }

    return found === -1 ? null : this._robots[found];
  }

  //返回无人机最新自带参数
  public get drone(): Robot {
    let found = -1;

    for (var i = 0; i < this._robots.length; i += 1) {
      const r = this._robots[i]

      if (r.type === 'DRONE' && r.state === 'ACTIVE') found = i;
    }

    return found === -1 ? null : this._robots[found];

  }


  private _robots: Robot[] = [];

  private _pollingSubscription: Subscription;


  constructor(private api: ApiService, private eventBusSvc: EventBusService) { }

  //开始轮询机器状态
  startPolling(): void {
    if (this._pollingSubscription != null) {
      this.stopPolling();
    }

    const period = environment.pollingInterval;
    const readRobotStatusFn = this.readRobotStatus.bind(this);
    const readAirportStatusFn = this.readAirportStatus.bind(this);

    this._pollingSubscription = interval(period)
      .pipe(
        concatMap(readRobotStatusFn),
        concatMap(readAirportStatusFn)
      )
      .subscribe();
  }

  //停止轮询机器状态
  stopPolling(): void {
    if (this._pollingSubscription) {
      this._pollingSubscription.unsubscribe();
    }
  }

  //加载无人机和机场数据
  loadRobots(): Observable<Robot[]> {
    const that = this;

    // clear the cache first
    this._robots.splice(0, this._robots.length);

    return this.api.loadRobots().pipe(
      map((result) => {
        const rows = JSON.parse(result).data;
        for (var i = 0; i < rows.length; i += 1) {
          const r = that._convertToRobot(rows[i]);
          that._robots.push(r);

        }
        that.eventBusSvc.eventBus.cast(ROBOT_ON_DRONE_CHANGED, that.drone);
        that.eventBusSvc.eventBus.cast(ROBOT_ON_AIRPORT_CHANGED, that.airport);
        return that._robots;
      }),
    );
  }

  //无人机紧急悬停
  emergencyHovering(): Observable<any> {
    var refNum:any
    this._robots.forEach( (row) => {
      if( row.type == "DRONE") {
        refNum = row.refNumber
      }
    })
    // const refNum = this._robots[0].refNumber;
    return this.api.emergencyHovering(refNum);
  }

  //无人机紧急降落
  emergencyLanding(): Observable<any> {
    var refNum:any
    this._robots.forEach( (row) => {
      if( row.type == "DRONE") {
        refNum = row.refNumber
      }
    })
    // const refNum = this._robots[0].refNumber;
    return this.api.emergencyLanding(refNum);
  }

  //读取无人机最新状态数据
  readRobotStatus(): Observable<RobotStatus> {
    const that = this;
    return this.api.readRobotStatus(this.drone.refNumber).pipe(
      map(result => {
        const data = JSON.parse(result).data;
        //To do:If the drone is not online, feedback error information 
        return that._convertToRobotStatus(data);
      })
    );
  }

  //读取机场最新状态数据
  readAirportStatus(): Observable<AirportStatus> {
    const that = this;

    return this.api.readAirportStatus(this.airport.refNumber).pipe(
      map(result => {
        const data = JSON.parse(result).data;
              //To do:If the airport is not online, feedback error information 
        return that._convertToAirportStatus(data);
      })
    );
  }

  private _convertToRobot(data: any): Robot {
    return new Robot(data.id, data.model, data.name, data.ref_num, data.state, data.type);
  }


  private _convertToRobotStatus(data: any): RobotStatus {
    return new RobotStatus(
      data.roll,
      data.pitch,
      data.yaw,
      data.gimbal_roll,
      data.gimbal_pitch,
      data.gimbal_yaw,
      data.altitude,
      data.velocity_x,
      data.velocity_y,
      data.velocity_z,
      data.battery_level,
      data.is_camera_ok,
      data.is_downloading_media,
      data.is_flying,
      data.is_recording,
      new Date(data.stamp));
  }

  private _convertToAirportStatus(data: any): AirportStatus {
    
    return new AirportStatus(
      data.current,
      data.voltage,
      data.drone_holder_status,
      data.charger_status,
      data.is_initialized,
      new Date(data.stamp));
  }



}
