export interface Style {
  name: String;
  thumbnail: String;
  value: String;
}

export interface TooltipData {
  header: String;
  content: String;
  style: String;
  fixed: boolean;
}

export interface Shape {
  id: number;
  header: {
    name: String;
    color: String;
    font: String;
  };
  content: {
    name: String;
    color: String;
    font: String;
  };
  x: number;
  y: number;
  width: number;
  height: number;
  name: String;
  backgroundColor: String;
  isDragging: Boolean;
  fixed: boolean;
}

export interface TooltipContent {
  color: String;
  name: String;
  x: number;
  y: number;
  font: String;
}

export class Tooltip {
  id: number;
  color: String;
  fixed: boolean;
  header: TooltipContent;
  content: TooltipContent;
  x: number;
  y: number;
  width: number;
  height: number;
}

export class Polygon {
  color: String;
  target: String;
  tooltips: Tooltip[];
  points: String;
}
