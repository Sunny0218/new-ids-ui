import { Component, OnInit } from '@angular/core';
import { DeviceStatusService } from 'src/app/services/device-status.service'

@Component({
  selector: 'app-team-panel',
  templateUrl: './team-panel.component.html',
  styleUrls: ['./team-panel.component.css'],
})
export class TeamPanelComponent implements OnInit {

  folders = [
    {
      name: 'M30-无人机1',
      updated: new Date('1/28/16'),
    },
    {
      name: '机场1',
      updated: new Date('1/28/16'),
    },
    {
      name: 'M30-无人机2',
      updated: new Date('1/28/16'),
    },
  ];
  constructor(private deviceStatusSrv:DeviceStatusService) { }

  ngOnInit(): void {
  }

  showDeviceStatus() {
    this.deviceStatusSrv.setStatus(true)
  }

  ngOnDestroy(): void {
    this.deviceStatusSrv.setStatus(false)
  }

}
