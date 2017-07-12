import React, {Component} from "react"
import "./LineChart.css"

class LineChart extends Component {
  // GET MAX & MIN X
  getMinX() {
    const {data} = this.props;
    return data[0].x;
  }
  getMaxX() {
    const {data} = this.props;
    return data[data.length - 1].x;
  }
  // GET MAX & MIN Y
  getMinY() {
    return 0;
  }
  getMaxY() {
    const {data} = this.props;
    return data.reduce((max, p) => p.y > max ? p.y : max, data[0].y);
  }
  // GET SVG COORDINATES
  getSvgX(x) {
    const {viewBoxWidth} = this.props;
    return (x / this.getMaxX() * viewBoxWidth);
  }
  getSvgY(y) {
    const {viewBoxHeight} = this.props;
    return viewBoxHeight - (y / this.getMaxY() * viewBoxHeight);
  }
  // BUILD SVG PATH
  makePath() {
    const {data} = this.props;
    let pathD = "M " + this.getSvgX(data[0].x) + " " + this.getSvgY(data[0].y) + " ";

    data.map((point, i) => {
      pathD += "L " + this.getSvgX(point.x) + " " + this.getSvgY(point.y) + " "
    });

    return (
      <path className="linechart_path" d={pathD} />
    );
  }
  // BUILD GRID AXIS
  makeAxis() {
  const minX = this.getMinX(), maxX = this.getMaxX();
  const minY = this.getMinY(), maxY = this.getMaxY();

  return (
    <g className="linechart_axis">
      <line
        x1={this.getSvgX(minX)} y1={this.getSvgY(minY)}
        x2={this.getSvgX(maxX)} y2={this.getSvgY(minY)} />
      <line
        x1={this.getSvgX(minX)} y1={this.getSvgY(minY)}
        x2={this.getSvgX(minX)} y2={this.getSvgY(maxY)} />
    </g>
    );
  }
  // RENDER & RETURN SVG PATH AND AXIS
  render() {
    const {viewBoxHeight, viewBoxWidth} = this.props;

    return (
      <svg viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}>
        {this.makePath()}
        {this.makeAxis()}
      </svg>
    );
  }
}
// DEFAULT PROPS
LineChart.defaultProps = {
  data: [],
  viewBoxHeight: 300,
  viewBoxWidth: 700
}

export default LineChart;
