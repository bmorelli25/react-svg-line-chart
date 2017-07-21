import React, {Component} from "react";
import moment from 'moment';
import "./LineChart.css";

class LineChart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hoverLoc: null,
      svgData: [],
      activePoint: null
    }
  }
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

  componentWillMount(){
    this.setState({activePoint: 'test'});
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

  createBox(){
    const {svgWidth, data} = this.props;
    const svgLocation = document.getElementsByClassName("linechart")[0].getBoundingClientRect();
    const day = moment(this.state.activePoint.d).format('MMM DD');

    let placementStyles = {};
    let width = 100;
    placementStyles.width = width + 'px';
    placementStyles.left = this.state.hoverLoc + svgLocation.left - (width/2);

    return (
      <div className='hover' style={ placementStyles }>
        <div className='date'>{ day }</div>
        <div className='price'>{ this.state.activePoint.p }</div>
      </div>
    )
  }

  createLine(){
    return (
      <line className='hoverLine'
        x1={this.state.hoverLoc} y1={-8}
        x2={this.state.hoverLoc} y2={300} />
    )
  }

  mouseLeave(){
    this.setState({hoverLoc: null});
  }

  getCoords(e){
    const {svgWidth, data} = this.props;
    const svgLocation = document.getElementsByClassName("linechart")[0].getBoundingClientRect();
    const adjustment = (svgLocation.width - svgWidth) / 2; //takes padding into consideration
    const relativeLoc = e.clientX - svgLocation.left - adjustment;
    let svgData = [];

    data.map((point, i) => {
      svgData.push({
        svgX: this.getSvgX(point.x),
        svgY: this.getSvgY(point.y),
        d: point.d,
        p: point.p
      });
    });

    let closestPoint = {}
    for(let i = 0, c = 500; i < svgData.length; i++){
      if ( Math.abs(svgData[i].svgX - this.state.hoverLoc) <= c ){
        c = Math.abs(svgData[i].svgX - this.state.hoverLoc);
        closestPoint = svgData[i];
      }
    }

    this.setState({
      hoverLoc: relativeLoc,
      activePoint: closestPoint
    })
  }

  makeActivePoint(){
    const {data, color, pointRadius} = this.props;

    return (
      <circle
        className='linechart_point'
        style={{stroke: color}}
        r={pointRadius}
        cx={this.state.activePoint.svgX}
        cy={this.state.activePoint.svgY}
      />
    );
  }
  // RENDER & RETURN SVG PATH AND AXIS
  render() {
    const {svgHeight, svgWidth, data} = this.props;

    return (
      <div className='container'>
        <div className='row'>
          <div className='side'>
          </div>
          <div className='main popup'>
            {this.state.hoverLoc ? this.createBox() : null}
          </div>
        </div>
        <div className='row'>
          <div className='side'>
            <span className='min'>{'$' + this.getMaxY().toFixed(2)}</span>
            <span className='max'>{'$' + this.getMinY().toFixed(2)}</span>
          </div>
          <div className='main'>
            <svg  width={svgWidth} height={svgHeight} viewBox={`0 0 ${svgWidth} ${svgHeight}`} className={'linechart'}
                  onMouseLeave={() => {this.mouseLeave()}}
                  onMouseMove={(e) => {this.getCoords(e)}} >
              <g>
                {this.makeAxis()}
                {this.makePath()}
                {this.makeArea()}
                {this.state.hoverLoc ? this.createLine() : null}
                {this.state.hoverLoc ? this.makeActivePoint() : null}
              </g>
            </svg>
          </div>
        </div>
        <div className='row'>
          <div className='side'>
          </div>
          <div className='main date-label'>
            <span className='min'>{moment(this.props.data[0].d).format('MMM DD')}</span>
            <span className='max'>{moment(this.props.data[this.props.data.length - 1].d).format('MMM DD')}</span>
          </div>
        </div>
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
