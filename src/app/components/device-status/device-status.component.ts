import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { DeviceStatusService } from 'src/app/services/device-status.service'

@Component({
  selector: 'app-device-status',
  templateUrl: './device-status.component.html',
  styleUrls: ['./device-status.component.css'],
})
export class DeviceStatusComponent implements OnInit {
  private subscription = new Subscription();
  public show:boolean = false;
  
  constructor(private deviceStatusSrv:DeviceStatusService) {
    this.subscription = this.deviceStatusSrv.getStatus().subscribe((data) => {
      this.show = data;
    })
  }

  ngOnInit(): void {

  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  close() {
    this.show = false;
  }
}
