import React, {Component} from "react";
import "./LineChart.css";

class LineChart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hoverLoc: null,
      activePoint: null
    }
  }
  // GET X & Y || MAX & MIN
  getX(){
    const {data} = this.props;
    return {
      min: data[0].x,
      max: data[data.length - 1].x
    }
  }
  getY(){
    const {data} = this.props;
    return {
      min: data.reduce((min, p) => p.y < min ? p.y : min, data[0].y),
      max: data.reduce((max, p) => p.y > max ? p.y : max, data[0].y)
    }
  }
  // GET SVG COORDINATES
  getSvgX(x) {
    const {svgWidth} = this.props;
    return (x / this.getX().max * svgWidth);
  }
  getSvgY(y) {
    const {svgHeight} = this.props;
    const gY = this.getY();
    return (svgHeight * gY.max - svgHeight * y) / (gY.max - gY.min);
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
  // BUILD SHADED AREA
  makeArea() {
    const {data} = this.props;
    let pathD = "M " + this.getSvgX(data[0].x) + " " + this.getSvgY(data[0].y) + " ";

    pathD += data.map((point, i) => {
      return "L " + this.getSvgX(point.x) + " " + this.getSvgY(point.y) + " ";
    });

    const x = this.getX();
    const y = this.getY();
    pathD += "L " + this.getSvgX(x.max) + " " + this.getSvgY(y.min) + " "
    + "L " + this.getSvgX(x.min) + " " + this.getSvgY(y.min) + " ";

    return <path className="linechart_area" d={pathD} />
  }
  // BUILD GRID AXIS
  makeAxis() {
  const x = this.getX();
  const y = this.getY();

  return (
    <g className="linechart_axis">
      <line
        x1={this.getSvgX(x.min)} y1={this.getSvgY(y.min)}
        x2={this.getSvgX(x.max)} y2={this.getSvgY(y.min)}
        strokeDasharray="5" />
      <line
        x1={this.getSvgX(x.min)} y1={this.getSvgY(y.max)}
        x2={this.getSvgX(x.max)} y2={this.getSvgY(y.max)}
        strokeDasharray="5" />
    </g>
    );
  }
  // FIND CLOSEST POINT TO MOUSE
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

    let closestPoint = {};
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
  // MAKE ACTIVE POINT
  makeActivePoint(){
    const {color, pointRadius} = this.props;
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
  // MAKE HOVER LINE
  createLine(){
    return (
      <line className='hoverLine'
        x1={this.state.hoverLoc} y1={-8}
        x2={this.state.hoverLoc} y2={300} />
    )
  }
  // MAKE HOVER BOX
  createBox(){
    const svgLocation = document.getElementsByClassName("linechart")[0].getBoundingClientRect();

    let placementStyles = {};
    let width = 100;
    placementStyles.width = width + 'px';
    placementStyles.left = this.state.hoverLoc + svgLocation.left - (width/2);

    return (
      <div className='hover' style={ placementStyles }>
        <div className='date'>{ this.state.activePoint.d }</div>
        <div className='price'>{ this.state.activePoint.p }</div>
      </div>
    )
  }

  render() {
    const {svgHeight, svgWidth} = this.props;

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
            <span className='min'>{'$' + this.getY().max.toFixed(2)}</span>
            <span className='max'>{'$' + this.getY().min.toFixed(2)}</span>
          </div>
          <div className='main'>
            <svg  width={svgWidth} height={svgHeight} viewBox={`0 0 ${svgWidth} ${svgHeight}`} className={'linechart'}
                  onMouseLeave={ () => this.setState({hoverLoc: null}) }
                  onMouseMove={ (e) => this.getCoords(e) } >
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
            <span className='min'>{ this.props.data[0].d}</span>
            <span className='max'>{ this.props.data[this.props.data.length - 1].d }</span>
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
