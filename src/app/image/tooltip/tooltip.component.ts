import { Component, OnInit, NgModule, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";


@NgModule()
@Component({
  selector: "app-tooltip",
  templateUrl: "./tooltip.component.html",
  styleUrls: ["./tooltip.component.css"]
})
export class TooltipComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<TooltipComponent>,
    @Inject(MAT_DIALOG_DATA) public data: String
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
  ngOnInit() {}
}
