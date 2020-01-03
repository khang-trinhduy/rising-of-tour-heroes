import { Component, OnInit, Input } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-panel",
  templateUrl: "./panel.component.html",
  styleUrls: ["./panel.component.css"]
})
export class PanelComponent implements OnInit {
  constructor(private http: HttpClient, private activeRoute: ActivatedRoute) {}
  polygons;
  imgURL;
  public imagePath;
  api = environment.api;
  staticFile = environment.static;
  uploadedImage;
  data;
  public message: string;

  ngOnInit() {
    let id = this.activeRoute.snapshot.params.id;
    this.data = `${this.api}/images/${id}`;
    if (id) {
      this.http.get(this.data).subscribe(res => {
        this.imgURL = `${this.staticFile}/${res["image"].path}`;
        this.polygons = res["image"].polygons;
      });
    }
  }
  
  showCanvas() {}
}
