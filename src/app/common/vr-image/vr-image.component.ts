import { Component, OnInit } from '@angular/core';
declare var pannellum: any;

@Component({
  selector: 'app-vr-image',
  templateUrl: './vr-image.component.html',
  styleUrls: ['./vr-image.component.css']
})
export class VrImageComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    this.loadPannellum();
  }

  loadPannellum() {
  pannellum.viewer('pano-image', {
    "type": "equirectangular",
    "panorama": "../../../assets/images/360images/360view.jpg",
    "autoLoad": true,
    "autoRotate": -2
  });
  }

}
