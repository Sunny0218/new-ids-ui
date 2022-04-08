import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-team-panel',
  templateUrl: './team-panel.component.html',
  styleUrls: ['./team-panel.component.css']
})
export class TeamPanelComponent implements OnInit {
  folders = [
    {
      name: 'M30-M30',
      updated: new Date('1/28/16'),
    },
    {
      name: 'M30-M30',
      updated: new Date('1/28/16'),
    },
    {
      name: 'M30-M30',
      updated: new Date('1/28/16'),
    },
  ];
  constructor() { }

  ngOnInit(): void {
  }

}
