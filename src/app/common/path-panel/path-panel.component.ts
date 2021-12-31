import { Component, OnInit, ViewChild } from '@angular/core';
import { Subscription, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { LoadPathsComponent } from './load-paths/load-paths.component';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-path-panel',
  templateUrl: './path-panel.component.html',
  styleUrls: ['./path-panel.component.css'],
})
export class PathPanelComponent implements OnInit {

  drone_ref_num: string;
  airport_ref_num: string;

  planningMissions = [];
  nextId = 1;

  newPathName = "test";
  newPathType="DRONE";

  // 高度参数
  altitudeSetPoint: string = "1.3";

  // 水平参数
  horizontalTag: number = 510;
  horizontalAngle: number = 0;
  horizontalOffsetZ: number = 1.3;

  // 垂直参数
  verticalTag: number = 1;
  verticalDirection: string = "R";

  // 稳定器参数
  gimbalRoll: number = 0;
  gimbalPitch: number = 0;
  gimbalYaw: number = 0;

  // 是否拍摄全景
  isPanorama:boolean = false;
  panelOpenState = false;
  newPathSubscription: Subscription = null;

  @ViewChild('loadPaths', { static: false} )
  private loadPaths:LoadPathsComponent

  constructor(
    private http:HttpClient,
  ) { }

  ngOnInit(): void {
  }

  //拖拽更改计划任务路径顺序
  dropMissionList(event: CdkDragDrop<object[]>) {
    moveItemInArray(this.planningMissions, event.previousIndex, event.currentIndex);
  }

  //获得button对应标签属性值
  commandButtonClicked(event: MouseEvent) {
    const $el = event.currentTarget as HTMLButtonElement;
    const tag = $el.getAttribute("data-tag");
    if (tag == "TAKEOFF") {
      this.addPlanningMission(this.drone_ref_num, tag, "Drone Take Off", {});
    } else if (tag == "LANDING") {
      this.addPlanningMission(this.drone_ref_num, tag, "Drone Landing", {});
    } else if (tag == "ALTITUDE") {
      this.addPlanningMission(this.drone_ref_num, tag, "Drone Altitude", {
        set_point: this.altitudeSetPoint
      });
    } else if (tag == "HEADING") {
      this.addPlanningMission(this.drone_ref_num, tag, "Drone Heading", {});
    } else if (tag == "PRECISE_LANDING") {
      this.addPlanningMission(this.drone_ref_num, tag, "Drone Precise Landing", {});
    } else if (tag == "HORIZONTAL_ALIGN") {
      this.addPlanningMission(this.drone_ref_num, tag, "Drone Horizontal Align", {
        set_point: this.horizontalTag,
        yaw_required: true,
        yaw_set_point: this.horizontalAngle,
        offset_z: this.horizontalOffsetZ
      });
    } else if (tag == "VERTICAL_ALIGN") {
      this.addPlanningMission(this.drone_ref_num, tag, "Drone Vertical Align", {
        set_point: this.verticalTag,
        direction: this.verticalDirection
      });
    } else if (tag == "GIMBAL") {
      this.addPlanningMission(this.drone_ref_num, tag, "Drone Gimbal", {
      roll: this.gimbalRoll,
      pitch: this.gimbalPitch,
      row: this.gimbalYaw
      });
    }else if (tag == "START_RECORDING") {
      this.addPlanningMission(this.drone_ref_num, tag, "Start Recording", {});
    } else if (tag == "STOP_RECORDING") {
      this.addPlanningMission(this.drone_ref_num, tag, "Stop Recording", {});
    } else if (tag == "ROBOT_SHOOT_PHOTO") {
      this.addPlanningMission(this.drone_ref_num, tag, "Robot Shoot Photo", {
        "is-panorama" : this.isPanorama
      });
    } else if (tag == "DOWNLOAD_MEDIA") {
      this.addPlanningMission(this.drone_ref_num, tag, "Download Media", {});
    } else if (tag == "AIRPORT_RELEASE_HOLDER") {
      this.addPlanningMission(this.airport_ref_num, "AIRPORT_HOLDER", "Airport Release Holder", {"action":"RELEASE"});
    } else if (tag == "AIRPORT_LOCK_HOLDER") {
      this.addPlanningMission(this.airport_ref_num,  "AIRPORT_HOLDER", "Airport Lock Holder",  {"action":"LOCK"});
    } else if (tag == "AIRPORT_RC_ON") {
      this.addPlanningMission(this.airport_ref_num, "AIRPORT_RC", "Airport Turn RC On", {"action":"ON"});
    } else if (tag == "AIRPORT_RC_OFF") {
      this.addPlanningMission(this.airport_ref_num, "AIRPORT_RC", "Airport Turn RC Off", {"action":"OFF"});
    } else if (tag == "AIRPORT_CHARGER_ON") {
      this.addPlanningMission(this.airport_ref_num, "AIRPORT_CHARGER", "Airport Turn Charger On",  {"action":"ON"});
    } else if (tag == "AIRPORT_CHARGER_OFF") {
      this.addPlanningMission(this.airport_ref_num, "AIRPORT_CHARGER", "Airport Turn Charger Off",  {"action":"OFF"});
    } else if (tag == "AIRPORT_DRONE_ON") {
      this.addPlanningMission(this.airport_ref_num, "AIRPORT_DRONE", "Airport Turn Drone On", {"action":"ON"});
    } else if (tag == "AIRPORT_DRONE_OFF") {
      this.addPlanningMission(this.airport_ref_num, "AIRPORT_DRONE", "Airport Turn Drone Off", {"action":"OFF"});
    }
  }

 //添加计划任务路径
  addPlanningMission(target,type,name,args){
    var mission = {
      id:this.nextId,
      target,
      type,
      name,
      args
    };
    if (Object.keys(args).length > 0) {
      Object.assign(mission, args);
    }
    // console.info("mission is added to planning list: ");
    // console.info(mission);
    this.planningMissions.push(mission);
    this.nextId++;
    // console.log(this.planningMissions);
  }

  //清空计划任务路径
  clearPlanningMission() {
    this.nextId = 1;
    this.planningMissions = [];
  }

  //删除计划任务路径
  removePlanningMission(mission) {
    const at = this.planningMissions.findIndex(x => x.id === mission['id']);
    if (at > -1) {
      this.planningMissions.splice(at, 1);
    }
  }

  //保存计划任务路径
  async savePlanningMissions() {
    const pathName = this.newPathName;
    const type = this.newPathType;

    if (!type || this.planningMissions.length === 0 || pathName == "") {
      alert('please select "Path Type" and "Path"'  );
      return;
    }

    if (this.newPathSubscription) {
      this.newPathSubscription.unsubscribe();
      this.newPathSubscription = null;
    }

    var headers = {};
    headers["Content-Type"] = "application/json";
    this.newPathSubscription = this.http.post(`${environment.apiHost}/missions/paths`, {
      type,
      actions: this.planningMissions,
      name: pathName
    }, headers)
      .subscribe((resp) => {
        const code = resp["code"];
        alert(`mission has been added, code: ${code}`);
        this.loadPaths.reloadPaths()
      });
    
    
  }
}
