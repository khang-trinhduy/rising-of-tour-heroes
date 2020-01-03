import { Component, OnInit, Output, Inject } from "@angular/core";
import { Style, TooltipData } from "../../core/style-model";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";

@Component({
  selector: "app-tooltip-add",
  templateUrl: "./add.component.html",
  styleUrls: ["./add.component.css"]
})
export class TooltipAddComponent implements OnInit {
  @Output() content;
  @Output() header;

  constructor(
    public dialogRef: MatDialogRef<TooltipAddComponent>,
    @Inject(MAT_DIALOG_DATA) public data: TooltipData
  ) {}

  ngOnInit() {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  styles: Style[] = [
    {
      name: "Blue-white",
      thumbnail: "assets/images/blue-white.jpg",
      value: "#1e73be-#ffffffdb-#ffffffba"
    },
    {
      name: "White-black",
      thumbnail: "assets/images/white-black.jpg",
      value: "rgba(255, 255, 255, 0.88)-#4c4c4c-#333"
    }
  ];

  get isValid() {
    if (!this.data.content || !this.data.header || !this.data.style) {
      return false;
    } else {
      return true;
    }
  };
}
