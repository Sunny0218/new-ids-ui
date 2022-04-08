import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-wayline-panel',
  templateUrl: './wayline-panel.component.html',
  styleUrls: ['./wayline-panel.component.css']
})
export class WaylinePanelComponent implements OnInit {
  folders = [
    {
      name: '航线1',
      updated: new Date('1/28/16'),
    },
    {
      name: '航线2',
      updated: new Date('1/28/16'),
    },
    {
      name: '航线3',
      updated: new Date('1/28/16'),
    },
  ];
  constructor() { }

  ngOnInit(): void {
  }

  selectWayline(name) {
    console.log(name)
  }

}
