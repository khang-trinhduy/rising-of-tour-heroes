import {
  Component,
  OnInit,
  Input,
  ViewChild,
  AfterViewInit
} from "@angular/core";
import { Location } from "@angular/common";
import { FormGroup, Validators, FormControl } from "@angular/forms";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { ActivatedRoute } from "@angular/router";
import { MatDialog } from "@angular/material/dialog";
import { TooltipComponent } from "../tooltip/tooltip.component";
import { TooltipAddComponent } from "../tooltip/add/add.component";
import { OrientationService } from "../core/orientation-service";
import { TooltipData, Shape, Polygon, Tooltip } from "../core/style-model";
import { throwIfEmpty } from "rxjs/operators";
declare var $: any;
@Component({
  selector: "app-canvas",
  templateUrl: "./canvas.component.html",
  styleUrls: ["./canvas.component.css"]
})
export class CanvasComponent implements OnInit, AfterViewInit {
  @Input() url: string;
  @Input() polygons: any;
  @Input() data: string;

  coords: String[] = [];
  points: any[] = [];
  review = false;
  imgUrl;
  imgAlt;
  tooltip;
  tooltipType;
  tooltipColor = "rgba(255, 255, 255, 0.88)";
  headerColor = "#ffffffdb";
  targetUrl;
  size;
  shapes: Shape[] = [];
  canvasWidth = 0;
  canvasHeight = 0;
  ctx;
  canvas;
  isDragging = false;
  canvasBounding;
  startX;
  startY;
  polygonMode: boolean = false;
  tooltipMode: boolean = false;
  tooltips: Tooltip[] = [];
  highlightColor = "#b3b3b3";
  zoom = 50;
  defaultWidth = 1280;
  defaultHeight = 720;

  api = environment.api;

  constructor(
    private http: HttpClient,
    public dialog: MatDialog,
    private activeRoute: ActivatedRoute
  ) {}

  ngOnInit() {}

  ngAfterViewInit() {}

  zoomer() {
    var canvas = document.querySelector("canvas");
    canvas.style.zoom = `${this.zoom * 2}%`;
  }

  mouseUp(event) {
    if (!this.isDragging) {
      return;
    }
    this.updateTooltip();
    this.drawShapes();
    this.isDragging = false;
    for (var i = 0; i < this.shapes.length; i++) {
      this.shapes[i].isDragging = false;
    }
    event.preventDefault();
    event.stopPropagation();
    console.log(this.tooltips);
  }

  updateTooltip() {
    for (let i = 0; i < this.shapes.length; i++) {
      const shape = this.shapes[i];
      var index = this.tooltips.findIndex(e => e.id === shape.id);
      if (index < 0) {
        this.tooltips.push(this.shapeToTooltip(shape));
      } else {
        var tooltip = this.tooltips[index];
        this.updateCoords(tooltip, shape);
      }
    }
  }

  updateCoords(tooltip: Tooltip, shape: Shape) {
    tooltip.x = shape.x;
    tooltip.y = shape.y;
    tooltip.header.x = shape.x + shape.width / 2;
    tooltip.header.y = shape.y + shape.width / 1.5;
    tooltip.content.x = shape.x + shape.width / 2;
    tooltip.content.y = shape.y + shape.width / 2.5;
  }

  shapeToTooltip(shape: Shape) {
    var tooltip = new Tooltip();
    tooltip.color = shape.backgroundColor;
    tooltip.fixed = shape.fixed;
    tooltip.id = shape.id;
    tooltip.x = shape.x;
    tooltip.y = shape.y;
    tooltip.width = shape.width;
    tooltip.height = shape.height;
    tooltip.content = {
      color: shape.content.color,
      font: shape.content.font,
      name: shape.content.name,
      x: shape.x + shape.width / 2,
      y: shape.y + shape.height / 1.5
    };
    tooltip.header = {
      color: shape.header.color,
      font: shape.header.font,
      name: shape.header.name,
      x: shape.x + shape.width / 2,
      y: shape.y + shape.height / 2.5
    };
    return tooltip;
  }

  mouseMove(event) {
    if (!this.tooltipMode) {
      return;
    }
    if (this.isDragging) {
      event.preventDefault();
      event.stopPropagation();
      var offsetX = event.x - this.canvasBounding.left;
      var offsetY = event.y - this.canvasBounding.top;
      var dx = offsetX - this.startX;
      var dy = offsetY - this.startY;
      for (var i = 0; i < this.shapes.length; i++) {
        var shape = this.shapes[i];
        if (shape.isDragging) {
          shape.x += dx;
          shape.y += dy;
        }
      }
      this.startX = offsetX;
      this.startY = offsetY;
      this.drawShapes();
    }
  }

  getShape(x, y) {
    var result;
    for (var i = 0; i < this.shapes.length; i++) {
      var shape = this.shapes[i];
      if (
        this.between(shape.x, shape.x + shape.width, x) &&
        this.between(shape.y, shape.y + shape.height, y)
      ) {
        shape.isDragging = true;
        result = shape;
      }
    }
    return result;
  }

  between = (front, rear, x) => front <= x && rear >= x;

  mouseDown(event) {
    var canvas = document.getElementsByTagName("canvas")[0];
    if (canvas) {
      event.preventDefault();
      event.stopPropagation();
      this.canvasBounding = canvas.getBoundingClientRect();
      var shape = this.getShape(
        event.x - this.canvasBounding.x,
        event.y - this.canvasBounding.y
      );
      if (shape) {
        this.isDragging = true;
        this.startX = event.x - this.canvasBounding.left;
        this.startY = event.y - this.canvasBounding.top;
      }
    }
  }

  openDialog() {
    if (!this.tooltipMode || this.polygonMode) {
      return;
    }
    const dialogRef = this.dialog.open(TooltipAddComponent, {
      width: "auto",
      data: { header: "", content: "", fixed: false }
    });
    dialogRef.afterClosed().subscribe(result => this.addShape(result));
  }

  addShape(data: TooltipData) {
    if (!this.ctx) {
      return;
    }
    if (this.shapes.find(e => e.x === 10 && e.y === 10)) {
      console.log("shape existed");
      return;
    }

    this.shapes.push(this.dataToShapes(data));

    this.drawShapes();

    return;
  }
  dataToShapes(data: TooltipData): Shape {
    return {
      id: this.shapes.length + 1,
      name: "rect",
      x: 10,
      y: 10,
      width: 122.8,
      height: 133,
      isDragging: false,
      fixed: data.fixed,
      backgroundColor: data.style.split("-")[0],
      header: {
        name: data.header,
        color: data.style.split("-")[1],
        font: "26pt auto"
      },
      content: {
        name: data.content,
        color: data.style.split("-")[2],
        font: "14pt auto"
      }
    };
  }

  rect(rect: Shape) {
    this.ctx.beginPath();
    this.ctx.fillStyle = rect.backgroundColor;
    this.ctx.fillRect(rect.x, rect.y, rect.width, rect.height);
    this.addText(
      rect.header.name,
      rect.header.font,
      rect.header.color,
      rect.width / 2 + rect.x,
      rect.height / 2.5 + rect.y
    );
    this.addText(
      rect.content.name,
      rect.content.font,
      rect.content.color,
      rect.width / 2 + rect.x,
      rect.height / 1.5 + rect.y
    );
    this.ctx.closePath();
    return;
  }

  addText(
    str: String,
    font: String,
    color: String,
    width: Number,
    height: Number
  ) {
    this.ctx.beginPath();
    this.ctx.font = font;
    this.ctx.textAlign = "center";
    this.ctx.textBaseline = "middle";
    this.ctx.fillStyle = color;
    this.ctx.fillText(str, width, height);
    this.ctx.closePath();
  }

  formatLabel(value: number) {
    return `${value}%`;
  }

  drawShapes(save: boolean = false) {
    this.clearShape();
    for (let i = 0; i < this.shapes.length; i++) {
      const shape = this.shapes[i];
      if (shape.name === "rect") {
        this.rect(shape);
      } else if (shape.name === "text") {
      }
    }
    this.draw(this.ctx);
    return;
  }

  clearShape() {
    this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
    return;
  }

  preview() {
    this.http
      .get(this.data, {
        headers: new HttpHeaders({
          "Content-type": "application/json"
        })
      })
      .subscribe(
        (res: any) => {
          console.log(res);
          this.polygons = res["image"].polygons;
        },
        null,
        () => {
          this.imgUrl = this.url;
          this.review = !this.review;
        }
      );
  }

  clear() {
    let ctx = this.getCanvas();
    this.points = [];
    this.coords = [];
    this.draw(ctx);
  }

  private getCanvas() {
    let canvas = $("canvas");
    let width = canvas[0].width;
    let height = canvas[0].height;
    let ctx = canvas[0].getContext("2d");
    ctx.clearRect(0, 0, width, height);
    return ctx;
  }

  undo() {
    if (!this.polygonMode) {
      return;
    }
    this.points.pop();
    this.coords.pop();
    let ctx = this.getCanvas();
    this.draw(ctx);
  }

  open(event) {
    var files = event.target.files;
    if (files) {
      let file = files[0];
      var img = document.createElement("img");
      var reader = new FileReader();

      reader.onload = (image => {
        return e => {
          image.src = e.target.result;
        };
      })(img);
      reader.readAsDataURL(file);

      this.loadImage(img);
    }
  }

  loadImage(img: HTMLImageElement) {
    if (img) {
      var canvas = document.createElement("canvas");
      var context = canvas.getContext("2d");
      this.ctx = context; //TODO remove this
      canvas.style.objectFit = "contain";
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        context.drawImage(img, 0, 0);
      };
      this.canvas = canvas;
      var container = document.querySelector(".canvas");
      container.append(canvas);
      this.assignEventsHandler(canvas);
    }
  }

  assignEventsHandler(canvas: HTMLCanvasElement) {
    if (canvas) {
      canvas.onclick = event => {
        this.mouseClickHandler(event);
      };
      canvas.addEventListener("mouseup", event => {
        this.mouseUp(event);
      });
      canvas.addEventListener("mousemove", event => {
        this.mouseMove(event);
      });
      canvas.addEventListener("mousedown", event => {
        this.mouseDown(event);
      });
    } else {
      console.log("canvas required");
    }
  }

  save() {
    var polygon = this.getPolygon();
    if (!polygon) {
      return;
    } else {
      if (!this.tooltips) {
        return;
      } else {
        for (let i = 0; i < this.tooltips.length; i++) {
          const tooltip = this.tooltips[i];
          polygon.tooltips.push(tooltip);
        }
      }
      var id = this.activeRoute.snapshot.params.id;
      var form = { polygons: [polygon] };
      console.log(form);

      this.http
        .post(`${this.api}/images/${id}/polygons`, form, {
          headers: new HttpHeaders({
            "Content-type": "application/json"
          })
        })
        .subscribe();
      this.clear();
    }
  }
  getPolygon(): Polygon {
    if (!this.coords) {
      console.log("polygon required");
      return;
    } else {
      var points = this.coords.join(" ");
      var polygon = new Polygon();
      polygon.points = points;
      polygon.tooltips = [];
      return polygon;
    }
  }

  get valid() {
    return true;
  }

  private draw(ctx: any) {
    ctx.beginPath();
    ctx.lineWidth = 3;
    ctx.fillStyle = "rgba(255,255,255,0.8)";
    ctx.strokeStyle = "rgb(255,20,20)";
    for (let i = 0; i < this.points.length; i++) {
      let x = this.points[i][0];
      let y = this.points[i][1];
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.fill();
    ctx.stroke();
    ctx.closePath();
  }

  private mouseClickHandler(event) {
    if (!this.polygonMode || this.tooltipMode) {
      return;
    }
    var x = event.pageX - this.canvasBounding.left ;
    var y = event.pageY - this.canvasBounding.top ;
    this.points.push([x, y]);
    this.coords.push(`${x},${y}`);
    this.draw(this.ctx);
  }
}
