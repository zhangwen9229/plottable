///<reference path="../../reference.ts" />

module Plottable {
export module Plot {
  export class Rectangle<X, Y> extends AbstractXYPlot<X, Y> {

    /**
     * Constructs a RectanglePlot.
     *
     * A RectanglePlot consists of a bunch of rectangles. The user is required to
     * project the left and right bounds of the rectangle (x1 and x2 respectively)
     * as well as the bottom and top bounds (y1 and y2 respectively)
     *
     * @constructor
     * @param {Scale.AbstractScale} xScale The x scale to use.
     * @param {Scale.AbstractScale} yScale The y scale to use.
     */
    constructor(xScale: Scale.AbstractScale<X, any>, yScale: Scale.AbstractScale<Y, any>) {
      super(xScale, yScale);
      this.classed("rectangle-plot", true);
    }

    protected _getDrawer(key: string) {
      return new _Drawer.Rect(key, true);
    }

    protected _generateAttrToProjector() {
      var attrToProjector = super._generateAttrToProjector();

      // Copy each of the different projectors.
      // In the event that x1/y1 are not present, x/y will be directly leveraged
      var x1Attr = attrToProjector["x1"] ? attrToProjector["x1"] : attrToProjector["x"];
      var y1Attr = attrToProjector["y1"] ? attrToProjector["y1"] : attrToProjector["y"];
      var x2Attr = attrToProjector["x2"];
      var y2Attr = attrToProjector["y2"];

      // Generate width based on difference, then adjust for the correct x origin
      attrToProjector["width"] = (d, i, u, m) => Math.abs(x2Attr(d, i, u, m) - x1Attr(d, i, u, m));
      attrToProjector["x"] = (d, i, u, m) => Math.min(x1Attr(d, i, u, m), x2Attr(d, i, u, m));

      // Generate height based on difference, then adjust for the correct y origin
      attrToProjector["height"] = (d, i, u, m) => Math.abs(y2Attr(d, i, u, m) - y1Attr(d, i, u, m));
      attrToProjector["y"] = (d, i, u, m) => Math.max(y1Attr(d, i, u, m), y2Attr(d, i, u, m)) - attrToProjector["height"](d, i, u, m);

      // Clean up the attributes projected onto the SVG elements
      delete attrToProjector["x1"];
      delete attrToProjector["y1"];
      delete attrToProjector["x2"];
      delete attrToProjector["y2"];

      return attrToProjector;
    }

    protected _generateDrawSteps(): _Drawer.DrawStep[] {
      return [{attrToProjector: this._generateAttrToProjector(), animator: this._getAnimator("rectangles")}];
    }
  }
}
}
