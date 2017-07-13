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
    const {data} = this.props;
    return data.reduce((min, p) => p.y < min ? p.y : min, data[0].y);
  }
  getMaxY() {
    const {data} = this.props;
    return data.reduce((max, p) => p.y > max ? p.y : max, data[0].y);
  }
  // GET SVG COORDINATES
  getSvgX(x) {
    const {svgWidth} = this.props;
    return (x / this.getMaxX() * svgWidth);
  }
  getSvgY(y) {
    const {svgHeight} = this.props;
    return svgHeight - (y / this.getMaxY() * svgHeight);
  }
  // BUILD SVG PATH
  makePath() {
    const {data, color} = this.props;
    let pathD = "M " + this.getSvgX(data[0].x) + " " + this.getSvgY(data[0].y) + " ";

    pathD += data.map((point, i) => {
      return "L " + this.getSvgX(point.x) + " " + this.getSvgY(point.y) + " ";
    });

    return (
      <path className="linechart_path" d={pathD} style={{stroke: color}} />
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
  // BUILD DATA POINTS
  makeDataPoints() {
    const {data, color, pointRadius} = this.props;
    return (
      <g>
        {
          data.map((point, i) => {
            return (
              <circle
                key={i}
                className='linechart_point'
                style={{stroke: color}}
                r={pointRadius}
                cx={this.getSvgX(point.x)}
                cy={this.getSvgY(point.y)}
                onMouseEnter={(e) => this.props.onPointHover(point, e.target)}
                onMouseLeave={(e) => this.props.onPointHover(null, null)}
              />
            );
          })
        }
      </g>
    );
  }
  // RENDER & RETURN SVG PATH AND AXIS
  render() {
    const {svgHeight, svgWidth} = this.props;

    return (
      <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className={'linechart'}>
        {this.makeAxis()}
        {this.makePath()}
        {this.makeDataPoints()}
      </svg>
    );
  }
}
// DEFAULT PROPS
LineChart.defaultProps = {
  data: [],
  color: '#2196F3',
  pointRadius: 3,
  svgHeight: 300,
  svgWidth: 700
}

export default LineChart;
