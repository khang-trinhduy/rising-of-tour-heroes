import {
  Directive,
  HostListener,
  Input,
  Renderer2,
  Inject
} from "@angular/core";
import { DOCUMENT } from "@angular/common";

@Directive({
  selector: "[appDisplay]"
})
export class DisplayDirective {
  @Input("appDisplay") tooltips: any[];
  constructor(@Inject(DOCUMENT) private document: Document) {}
  @HostListener("mouseenter") onMouseEnter() {
    this.display("block");
  }
  @HostListener("mouseleave") onMouseLeave() {
    this.display("none");
  }
  private display(status: string) {
    for (let i = 0; i < this.tooltips.length; i++) {
      const tooltip = this.tooltips[i];
      var elements = this.document.getElementsByClassName(`${tooltip._id}`);
      for (let i = 0; i < elements.length; i++) {
        const el = elements[i];
        if (!el.classList.contains("fixed")) {
          (<HTMLElement>(el)).style.display = status;
        }
      }
    }
  }
}
