import React, {Component} from "react"
import "./ToolTip.css"

class ToolTip extends Component {
  render() {

    const {trigger} = this.props;
    const placementStyles = {};

    if(trigger){
      const triggerRect = trigger.getBoundingClientRect()
      placementStyles.left = triggerRect.left + (triggerRect.right - triggerRect.left) / 2;
      placementStyles.top = triggerRect.top;
    }

    return (
      <div className={'tooltip tooltip-green tooltip-top'} style={ placementStyles }>
        <div className="tooltip_arrow" />
        <div className="tooltip_inner">
          { this.props.children }
        </div>
      </div>
    );
  }
}
// DEFAULT PROPS
ToolTip.defaultProps = {

}

export default ToolTip;
