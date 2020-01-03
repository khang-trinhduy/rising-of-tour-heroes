import { Component, OnInit, Input, AfterViewInit } from "@angular/core";
import { fromEvent } from "rxjs";
declare var $: any;
@Component({
  selector: "app-preview",
  templateUrl: "./preview.component.html",
  styleUrls: ["./preview.component.css"]
})
export class PreviewComponent implements OnInit, AfterViewInit {
  @Input() imgUrl: String;
  @Input() imgAlt: String;
  @Input() tooltipType: String;
  @Input() tooltipColor: String;
  @Input() polygonColor: String;
  @Input() targetUrl: string;
  @Input() polygons: any;
  @Input() size: String;
  @Input() fixedTooltip: any = [];
  @Input() dynamicTooltip: any = [];
  width: String;
  height: String;

  constructor() {}

  saveTooltipLoc = () => {};

  polygonsHandle = () => {
    for (let i = 0; i < this.polygons.length; i++) {
      const polygon = this.polygons[i];
      polygon.tooltips.forEach(tooltip => {
        if (tooltip.fixed) {
          this.fixedTooltip.push(tooltip);
        } else {
          this.dynamicTooltip.push(tooltip);
        }
      });
    }
  };

  ngOnInit() {
    this.polygonsHandle();
    let arr = this.size.split(" ");
    this.width = arr[0];
    this.height = arr[1];
    for (let i = 0; i < this.polygons.length; i++) {
      const polygon = this.polygons[i];
      for (let j = 0; j < polygon.tooltips.length; j++) {
        const tooltip = polygon.tooltips[j];
        tooltip.color = { fill: tooltip.color };
        tooltip.header.color = { fill: tooltip.header.color };
        tooltip.content.color = { fill: tooltip.content.color };
      }
    }
    console.log(this.polygons);
    
  }

  ngAfterViewInit(): void {
    var elems = document.getElementsByClassName("draggable");
    if (!elems || elems.length <= 0) {
      console.log("error loading draggable");
    } else {
      for (let i = 0; i < elems.length; i++) {
        const element = elems[i];
        this.makeDraggable(element);
      }
    }
  }

  private showTooltip(polygon: any) {
    if (polygon) {
      for (var i = 0; i < polygon.tooltips.length; i++) {
        var tooltip = polygon.tooltips[i];
        if (!tooltip.fixed) {
          var elem = document.getElementsByClassName(`${tooltip._id}`);
          if (elem && elem.length > 0) {
            // elem[0].style.display = "block";
          }
        }
      }
    }
  }

  private hideTooltip(polygon: any) {
    if (polygon) {
      for (var i = 0; i < polygon.tooltips.length; i++) {
        var tooltip = polygon.tooltips[i];
        if (!tooltip.fixed) {
          var elem = document.getElementsByClassName(`${tooltip._id}`);
          if (elem && elem.length > 0) {
            // elem[0].style.display = "none";
          }
        }
      }
    }
  }

  open(targetURI: string) {
    window.open(targetURI, "_blank");
  }

  coordHandler = (elem1, elem2) => {
    return [elem2.top - elem1.top, elem2.left - elem1.left];
  };

  makeDraggable = elem => {
    var svg = elem;
    var rect = svg.childNodes[0];
    var header = svg.childNodes[1];
    var content = svg.childNodes[2];
    var rel1 = this.coordHandler(
      rect.getBoundingClientRect(),
      header.getBoundingClientRect()
    );
    var rel2 = this.coordHandler(
      rect.getBoundingClientRect(),
      content.getBoundingClientRect()
    );
    var isHolding = false;
    var selectedElement;
    var currentX = 0;
    var currentY = 0;
    svg.addEventListener("mousedown", evt => {
      isHolding = true;
      selectedElement = evt.target;
      currentX = evt.clientX;
      currentY = evt.clientY;
    });
    svg.addEventListener("mouseup", evt => {
      isHolding = false;
      selectedElement = null;
      console.log(this.fixedTooltip);
    });
    svg.addEventListener("mousemove", evt => {
      if (isHolding) {
        if (selectedElement) {
          var dx =
            parseInt(selectedElement.getAttribute("x")) +
            evt.clientX -
            currentX;
          var dy =
            parseInt(selectedElement.getAttribute("y")) +
            evt.clientY -
            currentY;
          currentX = evt.clientX;
          currentY = evt.clientY;
          selectedElement.setAttribute("x", dx);
          selectedElement.setAttribute("y", dy);
          header.setAttribute("x", dx + 26.140625);
          header.setAttribute("y", dy + 40.140625);
          content.setAttribute("x", dx + 20.890625);
          content.setAttribute("y", dy + 72.171875);
        }
      }
    });
    svg.addEventListener("mouseleave", evts => {});
  };
}
