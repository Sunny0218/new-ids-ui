import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-device-status',
  templateUrl: './device-status.component.html',
  styleUrls: ['./device-status.component.css']
})
export class DeviceStatusComponent implements OnInit {
  show:boolean = true
  constructor() { }

  ngOnInit(): void {
  }

  showVideo() {
    this.show = !this.show
  }
}
