import { Component, OnInit,Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-reconfirm-dialog',
  templateUrl: './reconfirm-dialog.component.html',
  styleUrls: ['./reconfirm-dialog.component.css']
})
export class ReconfirmDialogComponent implements OnInit {

  constructor(
    public dialogRef:MatDialogRef<ReconfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
  }

  onNoClick() {
    this.dialogRef.close()
  }

}
