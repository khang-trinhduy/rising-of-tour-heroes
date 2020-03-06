import { Component, OnInit } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { animate } from "@angular/animations";

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.css"]
})
export class ImageDashboardComponent implements OnInit {
  constructor(private http: HttpClient) {}
  images: any = [];
  api = environment.api;
  name: string = "";
  ngOnInit() {
    this.http.get(`${this.api}/images`).subscribe(res => {
      this.images = res;
      console.log(res);
    });
  }

  doNothing() {}

  upload(file: File) {
    if (!file) {
      console.log("server fault");
      return;
    }
    let formData = new FormData();
    formData.append("image", file);
    this.http
      .post(`${this.api}/images/upload`, formData)
      .pipe()
      .subscribe(
        res => {
          let url = res["file"].path;
          let image = {
            name: this.name || "no title given",
            path: url
          };
          this.http
            .post(`${this.api}/images`, image, {
              headers: new HttpHeaders({ "Content-type": "application/json" })
            })
            .subscribe(res => this.images.push(res));
        },
        error => console.log(error),
        () => console.log("completed")
      );
  }

  fileToThumbnail(files: File[]) {
    if (!files) {
      return;
    }
    if (!files[0].type.startsWith("image/")) {
      return;
    }
    var thumbnail = document.getElementsByClassName("thumbnail-area")[0];
    var img = document.createElement("img");
    img.style.width = "100%";
    img.style.height = "100%";
    img.style.objectFit = "cover";
    thumbnail.appendChild(img);
    const reader = new FileReader();
    reader.onload = (function(aImg) {
      return function(e) {
        aImg.src = e.target.result;
      };
    })(img);
    reader.readAsDataURL(files[0]);
  }
}
