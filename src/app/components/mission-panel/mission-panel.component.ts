import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-mission-panel',
  templateUrl: './mission-panel.component.html',
  styleUrls: ['./mission-panel.component.css']
})

export class MissionPanelComponent implements OnInit {

  folders = [
    {
      name: 'Photos',
      updated: new Date('1/1/16'),
    },
    {
      name: 'Recipes',
      updated: new Date('1/17/16'),
    },
    {
      name: 'Work',
      updated: new Date('1/28/16'),
    },
    {
      name: 'Api',
      updated: new Date('1/28/16'),
    },
    {
      name: 'AKL',
      updated: new Date('1/28/16'),
    },
    {
      name: 'HDC',
      updated: new Date('1/28/16'),
    },
  ];
  constructor() { }

  ngOnInit(): void {
  }

}
