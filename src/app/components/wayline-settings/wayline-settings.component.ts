import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { WaylineSettingsService } from 'src/app/services/wayline-settings.service'

@Component({
  selector: 'app-wayline-settings',
  templateUrl: './wayline-settings.component.html',
  styleUrls: ['./wayline-settings.component.css']
})
export class WaylineSettingsComponent implements OnInit {
  private subscription = new Subscription();
  public show:boolean = false;

  constructor(private waylineSettingsSrv:WaylineSettingsService) {
    this.subscription = this.waylineSettingsSrv.getStatus().subscribe((data) => {
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
