/* eslint-disable no-multi-spaces */
import React, { Component } from "react";
import "./slider.css";

// states that the slider can be in
const states = {
  NONE: 0,                  // idle
  DRAGGING_HANDLE: 1,       // handle is being dragged
  DRAGGING_LEFT_ARROW: 2,   // arrow on left side is dragged
  DRAGGING_RIGHT_ARROW: 3,  // arrow on right side is dragged
  CLICKING_RAIL: 4,         // other part of slider is being clicked
};

export default class Slider extends Component {

  constructor(props) {
    super(props);

    this.state = {
      state: states.NONE,
      value: 5,              // current value, used when uncontrolled
      min: 1,                // current minimum, used when uncontrolled
      max: 10,               // current maximum, used when uncontrolled
      rail: null,            // reference to rail
      handle: null,          // reference to handle
      slider: null,          // reference to slider
      leftArrow: null,       // reference to left arrow
      rightArrow: null,      // reference to right arrow
      dragOffset: 0,         // mouse pointer offset when handle is dragged
      dragInterval: null,    // interval timer when arrows are dragged
      dragDelta: 0,          // current x delta when arrow is being dragged
    };

    this.setHandleRef = this.setHandleRef.bind(this);
    this.setRailRef = this.setRailRef.bind(this);
    this.setSliderRef = this.setSliderRef.bind(this);
    this.setLeftArrowRef = this.setLeftArrowRef.bind(this);
    this.setRightArrowRef = this.setRightArrowRef.bind(this);

  }

  componentDidMount() {
    // set up global mouse event listeners since components do not receive mouse events
    // when cursor is outside of the component (as when in dragging)
    this.onMouseDownListener = document.addEventListener("mousedown", this.handleMouseDown);
    this.onMouseUpListener = document.addEventListener("mouseup", this.handleMouseUp);
    this.onMouseMoveListener = document.addEventListener("mousemove", this.handleMouseMove);
  }

  componentWillUnmount() {
    // remove global mouse event listeners
    if (this.onMouseDownListener) {
      this.onMouseDownListener.remove();
    }
    if (this.onMouseUpListener) {
      this.onMouseUpListener.remove();
    }
    if (this.onMouseMoveListener) {
      this.onMouseMoveListener.remove();
    }

    const { dragInterval } = this.state;
    if (dragInterval) {
      clearInterval(dragInterval);
    }
  }

  // functions to set the references to the different
  // parts of the slider
  setHandleRef(handle) { this.setState({ handle }); }

  setRailRef(rail) { this.setState({ rail }); }

  setSliderRef(slider) { this.setState({ slider }); }

  setLeftArrowRef(leftArrow) { this.setState({ leftArrow }); }

  setRightArrowRef(rightArrow) { this.setState({ rightArrow }); }

  // get the min, max and value from the state or props depending
  // on whether the component is controlled or not
  getValues = () => {
    const { min: propMin, max: propMax, value: propValue, onDrag } = this.props;
    const { min: stateMin, max: stateMax, value: stateValue, state } = this.state;

    // we use the state value either if the value is not provided by the parent
    // or if the parent has not provided an onDrag handler during dragging
    let value;
    if ( propValue === undefined || (state === states.DRAGGING_HANDLE && !onDrag) ) {
      value = stateValue;
    } else {
      value = propValue;
    }

    // choose prop values over state values if provided
    return {
      min: propMin === undefined ? stateMin : propMin,
      max: propMax === undefined ? stateMax : propMax,
      value,
    };

  }

  // set the value when dragging
  setDragValue = (value) => {
    const { onDrag } = this.props;

    if (onDrag) {
      onDrag(value);
    }
    this.setState({ value });
  }

  // set the value, either when dragging is finished
  // or when the user clicks on the rail
  setValue = (value) => {
    const { onChangeValue } = this.props;

    if (onChangeValue) {
      onChangeValue(value);
    } else {
      this.setState({ value });
    }
  }

  // set minimum value, either controlled through onChangeMin
  // or uncontrolled to the state.
  setMin = (min) => {
    const { onChangeMin } = this.props;

    if (onChangeMin) {
      onChangeMin(min);
    }
    this.setState({ min });
  }

  // set maximum value, either controlled through onChangeMax
  // or uncontrolled to the state.
  setMax = (max) => {
    const { onChangeMax } = this.props;

    if (onChangeMax) {
      onChangeMax(max);
    }
    this.setState({ max });
  }

  // Stop the browser from propagating or using the default
  // response to an event.
  stopEvent = (e) => {
    e.stopPropagation();
    e.preventDefault();
  }

  // calculate the x offset between the user mouse down
  // and the handle center
  getDragOffset = (e, ref) => {
    const rect = ref.getBoundingClientRect();
    return e.clientX - rect.left - rect.width / 2;
  }

  // calculate the magnitude of the min-max interval state change
  // based on the delta between the mouse pointer and the min/max arrow
  getRelativeAdjustmentMagnitude = (delta) => {
    if (delta > 25) return 0;
    if (delta > 10) return -1;
    if (delta < -25) return 0;
    if (delta < -10) return -1;
    return -2; // no adjustment
  }

  // truncate a value to a given magnitude. The build-in
  // toFixed works only on numbers with decimals, so we need
  // this trick.
  toFixed = (n, mag, f) => {
    if (mag < 0) {
      // using the built-in for numbers with decimals
      // since the alternative results in round-off artifacts
      return parseFloat(n.toFixed(-mag));
    }
    const factor = Math.pow(10, mag);
    return f(n / factor) * factor;
  }

  // handler for timeout when dragging on arrows
  handleDragInterval = () => {

    const { dragDelta, state } = this.state;

    const { min, max, value } = this.getValues();

    const ram = this.getRelativeAdjustmentMagnitude(dragDelta);

    if (ram === -2) return; // short circuit for no adjustment

    const span = max - min;
    const spanMagnitude = Math.floor(Math.log10(span) - 1e-16);
    const adjustmentMagnitude = ram + spanMagnitude;
    const direction = Math.sign(dragDelta);

    const newSpan = span + direction * Math.pow(10, adjustmentMagnitude);

    if (state === states.DRAGGING_LEFT_ARROW) {

      const f = (direction === 1) ? Math.floor : Math.ceil;

      let newMin = this.toFixed(max - newSpan, adjustmentMagnitude, f);

      // preserve min >= value and min < max
      newMin = (newMin >= max) ? min : newMin;

      newMin = (newMin > value) ? min : newMin;

      if (newMin !== min) this.setMin(newMin);

    } else /* DRAGGING_RIGHT_ARROW) */ {
      const f = (direction === 1) ? Math.ceil : Math.floor;

      let newMax = this.toFixed(min + newSpan, adjustmentMagnitude, f);

      // preserve max >= value and max > min
      newMax = (newMax <= min) ? max : newMax;

      newMax = (newMax < value) ? max : newMax;

      if (newMax !== max) this.setMax(newMax);

    }

  }

  handleMouseDown = (e) => {

    if (this.props.disabled) return;

    const { handle, leftArrow, rightArrow, slider } = this.state;

    let state = states.NONE;
    let dragInterval = null;
    let dragOffset = 0;

    // transition to the correct state based on where the user clicks
    if (handle && handle.contains(e.target)) {

      state = states.DRAGGING_HANDLE;
      // the drag offset is used to keep the distance between the
      // mouse pointer and the handle constant during dragging
      dragOffset = this.getDragOffset(e, handle);

      // If the user has not provided an onDrag handler, we use
      // the state value as the dragging value, and we make certain
      // that this equals the current value of the slider
      const { onDrag } = this.props;
      if (!onDrag) {
        const { value } = this.getValues();
        this.setState({ value });
      }

    } else if (leftArrow && leftArrow.contains(e.target)) {

      state = states.DRAGGING_LEFT_ARROW;
      // start timer for interval adjustments
      dragInterval = setInterval(this.handleDragInterval, 100);

    } else if (rightArrow && rightArrow.contains(e.target)) {

      state = states.DRAGGING_RIGHT_ARROW;
      // start timer for interval adjustments
      dragInterval = setInterval(this.handleDragInterval, 100);

    } else if (slider && slider.contains(e.target)) {
      state = states.CLICKING_RAIL;
    }

    if (state !== states.NONE) {

      this.setState({
        state,
        dragOffset,
        dragInterval,
        dragDelta: 0,
      });
      this.stopEvent(e);

    }
  }

  // handler when the user stops dragging the handle
  handleStopDragHandle = (e) => {
    const { value } = this.getValues();
    // transition to idle state
    this.setState({ state: states.NONE });
    this.setValue(value);
    this.stopEvent(e);
  }

  // handler when the user stops dragging an arrow
  handleStopDragArrow = (e) => {
    const { dragInterval } = this.state;
    // stop the timer for interval adjustments
    clearInterval(dragInterval);
    // transition to idle state
    this.setState({ state: states.NONE });
    this.stopEvent(e);
  }

  // compute the value based on the mouse coordinate relative
  // to the rail
  computeValue = (e, dragOffset) => {
    const { rail } = this.state;
    const railRect = rail.getBoundingClientRect();
    const { min, max } = this.getValues();

    // calculate the position of the mouse event as a percentage relative
    // to the rail
    let percentage = (e.x - dragOffset - railRect.left) / railRect.width;
    // eslint-disable-next-line no-nested-ternary
    percentage = (percentage < 0) ? 0 : (percentage > 1) ? 1 : percentage;
    // calculate the new value using the percentage and the current min and max
    const newValue = percentage * (max - min) + min;

    return newValue;
  }

  // handler when there is a potential click
  handleClickRail = (e) => {
    const { slider } = this.state;
    // Check that we are inside the slider.
    // Only both a mousedown and mouseup inside the
    // slider counts as a click.
    if (slider.contains(e.target)) {
      const { value } = this.getValues();
      const newValue = this.computeValue(e, 0);

      if (value !== newValue) {
        this.setValue(newValue);
      }
    }
    this.stopEvent(e);
  }

  // handler when the user releases the button
  handleMouseUp = (e) => {

    if (this.props.disabled) return;

    const { state } = this.state;

    // switch to the correct handler based on
    // the state of the slider
    switch (state) {
      case states.DRAGGING_HANDLE:
        this.handleStopDragHandle(e);
        break;
      case states.DRAGGING_LEFT_ARROW:
      case states.DRAGGING_RIGHT_ARROW:
        this.handleStopDragArrow(e);
        break;
      case states.CLICKING_RAIL:
        this.handleClickRail(e);
        break;
      default:
    }
  }

  // handler for mousemove when dragging handle
  handleDragHandle = (e) => {
    const { dragOffset } = this.state;
    const { value } = this.getValues();

    // update the (drag) value based on the mouse position
    const newValue = this.computeValue(e, dragOffset);
    if (value !== newValue) {
      this.setDragValue(newValue);
    }
    this.stopEvent(e);
  }

  // handler for mousemove when dragging left arrow
  handleDragLeftArrow = (e) => {
    const { leftArrow } = this.state;

    const rect = leftArrow.getBoundingClientRect();

    // calculate the distance between the mouse pointer
    // and the left of the arrow
    const dragDelta = -(e.x - rect.left);

    this.setState({ dragDelta });

    this.stopEvent(e);
  }

  // handler for mousemove when dragging right arrow
  handleDragRightArrow = (e) => {
    const { rightArrow } = this.state;

    const rect = rightArrow.getBoundingClientRect();

    // calculate the distance between the mouse pointer
    // and the left of the arrow
    const dragDelta = e.x - rect.left;

    this.setState({ dragDelta });

    this.stopEvent(e);
  }

  // handler for mousemove
  handleMouseMove = (e) => {

    if (this.props.disabled) return;

    const { state } = this.state;

    // switch to the correct handler based
    // on the state of the slider
    switch (state) {
      case states.DRAGGING_HANDLE:
        this.handleDragHandle(e);
        break;
      case states.DRAGGING_LEFT_ARROW:
        this.handleDragLeftArrow(e);
        break;
      case states.DRAGGING_RIGHT_ARROW:
        this.handleDragRightArrow(e);
        break;
      default:
    }

  }

  // calculate the left position of the handle based on the current slider value
  getHandleLeft = () => {
    const { rail, handle, slider } = this.state;
    const { min, max, value } = this.getValues();
    if (!rail || !handle || !slider) {
      return 0;
    }

    const railRect = rail.getBoundingClientRect();
    const handleRect = handle.getBoundingClientRect();
    const sliderRect = slider.getBoundingClientRect();

    return railRect.left
      - sliderRect.left
      + ((value - min) / (max - min)) * railRect.width
      - handleRect.width / 2;
  }

  // render the tooltip that appears under the handle when dragging, if dragging
  renderDragHandleTooltip = (left) => {
    const { state } = this.state;
    const { value } = this.getValues();

    if (state === states.DRAGGING_HANDLE) {
      return (
        <div
          className="fcc-slider-tooltip"
          style={{
            left,
          }}
        >
          {value}
        </div>
      );
    }

    return null;
  }

  // render the tooltip that appears under the left arrow when dragging, if dragging
  renderDragLeftArrowTooltip = () => {
    const { state } = this.state;

    if (state === states.DRAGGING_LEFT_ARROW) {
      const { min } = this.getValues();

      return (
        <div
          className="fcc-slider-tooltip"
          style={{
            left: 0,
          }}
        >
          {min}
        </div>
      );
    }

    return null;
  }

  // render the tooltip that appears under the right arrow when dragging, if dragging
  renderDragRightArrowTooltip = () => {
    const { state } = this.state;

    if (state === states.DRAGGING_RIGHT_ARROW) {
      const { rightArrow, slider } = this.state;
      const { max } = this.getValues();
      const rightArrowRect = rightArrow.getBoundingClientRect();
      const sliderRect = slider.getBoundingClientRect();

      return (
        <div
          className="fcc-slider-tooltip"
          style={{
            left: sliderRect.width - rightArrowRect.width,
          }}
        >
          {max}
        </div>
      );
    }

    return null;
  }

  render() {

    const { disabled, style } = this.props;

    const handleLeft = this.getHandleLeft();

    return (
      <div
        className="fcc-slider"
        ref={this.setSliderRef}
        style={style}
      >
        <div
          className="fcc-slider-right-arrow"
          ref={this.setRightArrowRef}
        >
        </div>
        <div
          className="fcc-slider-left-arrow"
          ref={this.setLeftArrowRef}
        >
        </div>
        <div
          className="fcc-slider-rail"
          ref={this.setRailRef}
        >
        </div>
        {
          !disabled ?
          <div className="fcc-slider-handle"
            ref={this.setHandleRef}
            style={{ left: handleLeft }}
          >
          </div>
          : null
        }

        { this.renderDragHandleTooltip(handleLeft) }
        { this.renderDragLeftArrowTooltip() }
        { this.renderDragRightArrowTooltip() }

      </div>
    );

  }

}
