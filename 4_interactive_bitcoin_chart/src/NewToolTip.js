import React, {Component} from "react"
import "./NewToolTip.css"

class NewToolTip extends Component {
  render() {

    const {trigger, point} = this.props;
    const placementStyles = {};

    if(trigger){
      const triggerRect = trigger.getBoundingClientRect()
      placementStyles.left = triggerRect.left - 75;
    }

    return (
      <div className='hover' style={ placementStyles }>
        { this.props.children }
      </div>
    );
  }
}

export default NewToolTip;
