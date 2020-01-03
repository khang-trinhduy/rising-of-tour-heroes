import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root"
})
export class OrientationService {
  constructor() {}

  pointsHandler = (points: String[]) => {
    var x = [];
    var y = [];
    for (let i = 0; i < points.length; i++) {
      const point = points[i];
      var arr = point.trim().split(",");
      if (arr.length < 2) {
        continue;
      } else {
        x.push(arr[0]);
        y.push(arr[1]);
      }
    }
    return [x, y];
  };

  handle = (orientation: String, points: String[]) => {
    var coords = this.pointsHandler(points);
    var lgns = coords[0].map(x => parseInt(x));
    var lats = coords[1].map(y => parseInt(y));
    if (orientation === "left") {
      return [this.getMin(lgns), this.getAverage(lats)];
    } else if (orientation === "right") {
      return [this.getMax(lgns), this.getAverage(lats)];
    } else if (orientation === "above") {
      return [this.getAverage(lgns), this.getMin(lats)];
    } else if (orientation === "below") {
      return [this.getAverage(lgns), this.getMax(lats)];
    }
  };

  average = (acc, cur, idx, src) => {
    acc = acc + cur;
    if (idx === src.length - 1) {
      acc = acc / src.length;
    }
    return acc;
  };

  max = (acc, cur) => {
    return acc > cur ? acc : cur;
  };

  min = (acc, cur) => {
    return acc < cur ? acc : cur;
  };

  getAverage = (array: Number[]) => {
    return array.reduce(this.average);
  };

  getMax = (array: Number[]) => {
    return array.reduce(this.max, 0);
  };

  getMin = (array: Number[]) => {
    return array.reduce(this.min, 100000000000);
  };
}
