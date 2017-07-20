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
    // The formula for svgY location is complex. Here it is unsimplified:
    // (svgHeight - y / this.getMaxY() * svgHeight) * svgHeight / (svgHeight - this.getMinY() / this.getMaxY() * svgHeight);
    return (svgHeight * this.getMaxY() - svgHeight * y) / (this.getMaxY() - this.getMinY());
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
  // BUILD AREA
  makeArea() {
    const {data} = this.props;
    let pathD =
      "M " + this.getSvgX(data[0].x) + " " + this.getSvgY(data[0].y) + " ";

    data.map((point, i) => {
      pathD += "L " + this.getSvgX(point.x) + " " + this.getSvgY(point.y) + " ";
    });

    pathD += "L " + this.getSvgX(this.getMaxX()) + " " + this.getSvgY(this.getMinY()) + " "
    + "L " + this.getSvgX(this.getMinX()) + " " + this.getSvgY(this.getMinY()) + " ";

    return <path className="linechart_area" d={pathD} />
    }

  // BUILD GRID AXIS
  makeAxis() {
  const minX = this.getMinX(), maxX = this.getMaxX();
  const minY = this.getMinY(), maxY = this.getMaxY();

  return (
    <g className="linechart_axis">
      // bottom line
      <line
        x1={this.getSvgX(minX)} y1={this.getSvgY(minY)}
        x2={this.getSvgX(maxX)} y2={this.getSvgY(minY)}
        strokeDasharray="5" />
      // top line
      <line
        x1={this.getSvgX(minX)} y1={this.getSvgY(maxY)}
        x2={this.getSvgX(maxX)} y2={this.getSvgY(maxY)}
        strokeDasharray="5" />
      // left line

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
                onMouseEnter={(e) =>
                  {
                    //this.createLine(point);
                    this.props.onPointHover(point, e.target);
                  }
                }
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
    const {svgHeight, svgWidth, data} = this.props;

    return (
      <div className='main'>
        <svg width={svgWidth} height={svgHeight} viewBox={`0 0 ${svgWidth} ${svgHeight}`} className={'linechart'}>
          <g>
            {this.makeAxis()}
            {this.makePath()}
            {this.makeArea()}
            {this.makeDataPoints()}
            {this.createLine}
          </g>
        </svg>
      </div>
    );
  }
}
// DEFAULT PROPS
LineChart.defaultProps = {
  data: [],
  color: '#2196F3',
  pointRadius: 5,
  svgHeight: 300,
  svgWidth: 700
}

export default LineChart;
