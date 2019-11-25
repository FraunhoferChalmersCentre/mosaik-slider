"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireWildcard(require("react"));

require("./slider.css");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// states that the slider can be in
var states = {
  NONE: 0,
  // idle
  DRAGGING_HANDLE: 1,
  // handle is being dragged
  DRAGGING_LEFT_ARROW: 2,
  // arrow on left side is dragged
  DRAGGING_RIGHT_ARROW: 3,
  // arrow on right side is dragged
  CLICKING_RAIL: 4 // other part of slider is being clicked

};

var Slider =
/*#__PURE__*/
function (_Component) {
  _inherits(Slider, _Component);

  function Slider(props) {
    var _this;

    _classCallCheck(this, Slider);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Slider).call(this, props));

    _defineProperty(_assertThisInitialized(_this), "getValues", function () {
      var _this$props = _this.props,
          propMin = _this$props.min,
          propMax = _this$props.max,
          propValue = _this$props.value,
          onDrag = _this$props.onDrag;
      var _this$state = _this.state,
          stateMin = _this$state.min,
          stateMax = _this$state.max,
          stateValue = _this$state.value,
          state = _this$state.state; // we use the state value either if the value is not provided by the parent
      // or if the parent has not provided an onDrag handler during dragging

      var value;

      if (propValue === undefined || state === states.DRAGGING_HANDLE && !onDrag) {
        value = stateValue;
      } else {
        value = propValue;
      } // choose prop values over state values if provided


      return {
        min: propMin === undefined ? stateMin : propMin,
        max: propMax === undefined ? stateMax : propMax,
        value: value
      };
    });

    _defineProperty(_assertThisInitialized(_this), "setDragValue", function (value) {
      var onDrag = _this.props.onDrag;

      if (onDrag) {
        onDrag(value);
      }

      _this.setState({
        value: value
      });
    });

    _defineProperty(_assertThisInitialized(_this), "setValue", function (value) {
      var onChangeValue = _this.props.onChangeValue;

      if (onChangeValue) {
        onChangeValue(value);
      } else {
        _this.setState({
          value: value
        });
      }
    });

    _defineProperty(_assertThisInitialized(_this), "setMin", function (min) {
      var onChangeMin = _this.props.onChangeMin;

      if (onChangeMin) {
        onChangeMin(min);
      }

      _this.setState({
        min: min
      });
    });

    _defineProperty(_assertThisInitialized(_this), "setMax", function (max) {
      var onChangeMax = _this.props.onChangeMax;

      if (onChangeMax) {
        onChangeMax(max);
      }

      _this.setState({
        max: max
      });
    });

    _defineProperty(_assertThisInitialized(_this), "stopEvent", function (e) {
      e.stopPropagation();
      e.preventDefault();
    });

    _defineProperty(_assertThisInitialized(_this), "getDragOffset", function (e, ref) {
      var rect = ref.getBoundingClientRect();
      return e.clientX - rect.left - rect.width / 2;
    });

    _defineProperty(_assertThisInitialized(_this), "getRelativeAdjustmentMagnitude", function (delta) {
      if (delta > 25) return 0;
      if (delta > 10) return -1;
      if (delta < -25) return 0;
      if (delta < -10) return -1;
      return -2; // no adjustment
    });

    _defineProperty(_assertThisInitialized(_this), "toFixed", function (n, mag, f) {
      if (mag < 0) {
        // using the built-in for numbers with decimals
        // since the alternative results in round-off artifacts
        return parseFloat(n.toFixed(-mag));
      }

      var factor = Math.pow(10, mag);
      return f(n / factor) * factor;
    });

    _defineProperty(_assertThisInitialized(_this), "handleDragInterval", function () {
      var _this$state2 = _this.state,
          dragDelta = _this$state2.dragDelta,
          state = _this$state2.state;

      var _this$getValues = _this.getValues(),
          min = _this$getValues.min,
          max = _this$getValues.max,
          value = _this$getValues.value;

      var ram = _this.getRelativeAdjustmentMagnitude(dragDelta);

      if (ram === -2) return; // short circuit for no adjustment

      var span = max - min;
      var spanMagnitude = Math.floor(Math.log10(span) - 1e-16);
      var adjustmentMagnitude = ram + spanMagnitude;
      var direction = Math.sign(dragDelta);
      var newSpan = span + direction * Math.pow(10, adjustmentMagnitude);

      if (state === states.DRAGGING_LEFT_ARROW) {
        var f = direction === 1 ? Math.floor : Math.ceil;

        var newMin = _this.toFixed(max - newSpan, adjustmentMagnitude, f); // preserve min >= value and min < max


        newMin = newMin >= max ? min : newMin;
        newMin = newMin > value ? min : newMin;
        if (newMin !== min) _this.setMin(newMin);
      } else
        /* DRAGGING_RIGHT_ARROW) */
        {
          var _f = direction === 1 ? Math.ceil : Math.floor;

          var newMax = _this.toFixed(min + newSpan, adjustmentMagnitude, _f); // preserve max >= value and max > min


          newMax = newMax <= min ? max : newMax;
          newMax = newMax < value ? max : newMax;
          if (newMax !== max) _this.setMax(newMax);
        }
    });

    _defineProperty(_assertThisInitialized(_this), "handleMouseDown", function (e) {
      if (_this.props.disabled) return;
      var _this$state3 = _this.state,
          handle = _this$state3.handle,
          leftArrow = _this$state3.leftArrow,
          rightArrow = _this$state3.rightArrow,
          slider = _this$state3.slider;
      var state = states.NONE;
      var dragInterval = null;
      var dragOffset = 0; // transition to the correct state based on where the user clicks

      if (handle && handle.contains(e.target)) {
        state = states.DRAGGING_HANDLE; // the drag offset is used to keep the distance between the
        // mouse pointer and the handle constant during dragging

        dragOffset = _this.getDragOffset(e, handle); // If the user has not provided an onDrag handler, we use
        // the state value as the dragging value, and we make certain
        // that this equals the current value of the slider

        var onDrag = _this.props.onDrag;

        if (!onDrag) {
          var _this$getValues2 = _this.getValues(),
              value = _this$getValues2.value;

          _this.setState({
            value: value
          });
        }
      } else if (leftArrow && leftArrow.contains(e.target)) {
        state = states.DRAGGING_LEFT_ARROW; // start timer for interval adjustments

        dragInterval = setInterval(_this.handleDragInterval, 100);
      } else if (rightArrow && rightArrow.contains(e.target)) {
        state = states.DRAGGING_RIGHT_ARROW; // start timer for interval adjustments

        dragInterval = setInterval(_this.handleDragInterval, 100);
      } else if (slider && slider.contains(e.target)) {
        state = states.CLICKING_RAIL;
      }

      if (state !== states.NONE) {
        _this.setState({
          state: state,
          dragOffset: dragOffset,
          dragInterval: dragInterval,
          dragDelta: 0
        });

        _this.stopEvent(e);
      }
    });

    _defineProperty(_assertThisInitialized(_this), "handleStopDragHandle", function (e) {
      var _this$getValues3 = _this.getValues(),
          value = _this$getValues3.value; // transition to idle state


      _this.setState({
        state: states.NONE
      });

      _this.setValue(value);

      _this.stopEvent(e);
    });

    _defineProperty(_assertThisInitialized(_this), "handleStopDragArrow", function (e) {
      var dragInterval = _this.state.dragInterval; // stop the timer for interval adjustments

      clearInterval(dragInterval); // transition to idle state

      _this.setState({
        state: states.NONE
      });

      _this.stopEvent(e);
    });

    _defineProperty(_assertThisInitialized(_this), "computeValue", function (e, dragOffset) {
      var rail = _this.state.rail;
      var railRect = rail.getBoundingClientRect();

      var _this$getValues4 = _this.getValues(),
          min = _this$getValues4.min,
          max = _this$getValues4.max; // calculate the position of the mouse event as a percentage relative
      // to the rail


      var percentage = (e.x - dragOffset - railRect.left) / railRect.width; // eslint-disable-next-line no-nested-ternary

      percentage = percentage < 0 ? 0 : percentage > 1 ? 1 : percentage; // calculate the new value using the percentage and the current min and max

      var newValue = percentage * (max - min) + min;
      return newValue;
    });

    _defineProperty(_assertThisInitialized(_this), "handleClickRail", function (e) {
      var slider = _this.state.slider; // Check that we are inside the slider.
      // Only both a mousedown and mouseup inside the
      // slider counts as a click.

      if (slider.contains(e.target)) {
        var _this$getValues5 = _this.getValues(),
            value = _this$getValues5.value;

        var newValue = _this.computeValue(e, 0);

        if (value !== newValue) {
          _this.setValue(newValue);
        }
      }

      _this.stopEvent(e);
    });

    _defineProperty(_assertThisInitialized(_this), "handleMouseUp", function (e) {
      if (_this.props.disabled) return;
      var state = _this.state.state; // switch to the correct handler based on
      // the state of the slider

      switch (state) {
        case states.DRAGGING_HANDLE:
          _this.handleStopDragHandle(e);

          break;

        case states.DRAGGING_LEFT_ARROW:
        case states.DRAGGING_RIGHT_ARROW:
          _this.handleStopDragArrow(e);

          break;

        case states.CLICKING_RAIL:
          _this.handleClickRail(e);

          break;

        default:
      }
    });

    _defineProperty(_assertThisInitialized(_this), "handleDragHandle", function (e) {
      var dragOffset = _this.state.dragOffset;

      var _this$getValues6 = _this.getValues(),
          value = _this$getValues6.value; // update the (drag) value based on the mouse position


      var newValue = _this.computeValue(e, dragOffset);

      if (value !== newValue) {
        _this.setDragValue(newValue);
      }

      _this.stopEvent(e);
    });

    _defineProperty(_assertThisInitialized(_this), "handleDragLeftArrow", function (e) {
      var leftArrow = _this.state.leftArrow;
      var rect = leftArrow.getBoundingClientRect(); // calculate the distance between the mouse pointer
      // and the left of the arrow

      var dragDelta = -(e.x - rect.left);

      _this.setState({
        dragDelta: dragDelta
      });

      _this.stopEvent(e);
    });

    _defineProperty(_assertThisInitialized(_this), "handleDragRightArrow", function (e) {
      var rightArrow = _this.state.rightArrow;
      var rect = rightArrow.getBoundingClientRect(); // calculate the distance between the mouse pointer
      // and the left of the arrow

      var dragDelta = e.x - rect.left;

      _this.setState({
        dragDelta: dragDelta
      });

      _this.stopEvent(e);
    });

    _defineProperty(_assertThisInitialized(_this), "handleMouseMove", function (e) {
      if (_this.props.disabled) return;
      var state = _this.state.state; // switch to the correct handler based
      // on the state of the slider

      switch (state) {
        case states.DRAGGING_HANDLE:
          _this.handleDragHandle(e);

          break;

        case states.DRAGGING_LEFT_ARROW:
          _this.handleDragLeftArrow(e);

          break;

        case states.DRAGGING_RIGHT_ARROW:
          _this.handleDragRightArrow(e);

          break;

        default:
      }
    });

    _defineProperty(_assertThisInitialized(_this), "getHandleLeft", function () {
      var _this$state4 = _this.state,
          rail = _this$state4.rail,
          handle = _this$state4.handle,
          slider = _this$state4.slider;

      var _this$getValues7 = _this.getValues(),
          min = _this$getValues7.min,
          max = _this$getValues7.max,
          value = _this$getValues7.value;

      if (!rail || !handle || !slider) {
        return 0;
      }

      var railRect = rail.getBoundingClientRect();
      var handleRect = handle.getBoundingClientRect();
      var sliderRect = slider.getBoundingClientRect();
      return railRect.left - sliderRect.left + (value - min) / (max - min) * railRect.width - handleRect.width / 2;
    });

    _defineProperty(_assertThisInitialized(_this), "renderDragHandleTooltip", function (left) {
      var state = _this.state.state;

      var _this$getValues8 = _this.getValues(),
          value = _this$getValues8.value;

      if (state === states.DRAGGING_HANDLE) {
        return _react["default"].createElement("div", {
          className: "fcc-slider-tooltip",
          style: {
            left: left
          }
        }, value);
      }

      return null;
    });

    _defineProperty(_assertThisInitialized(_this), "renderDragLeftArrowTooltip", function () {
      var state = _this.state.state;

      if (state === states.DRAGGING_LEFT_ARROW) {
        var _this$getValues9 = _this.getValues(),
            min = _this$getValues9.min;

        return _react["default"].createElement("div", {
          className: "fcc-slider-tooltip",
          style: {
            left: 0
          }
        }, min);
      }

      return null;
    });

    _defineProperty(_assertThisInitialized(_this), "renderDragRightArrowTooltip", function () {
      var state = _this.state.state;

      if (state === states.DRAGGING_RIGHT_ARROW) {
        var _this$state5 = _this.state,
            rightArrow = _this$state5.rightArrow,
            slider = _this$state5.slider;

        var _this$getValues10 = _this.getValues(),
            max = _this$getValues10.max;

        var rightArrowRect = rightArrow.getBoundingClientRect();
        var sliderRect = slider.getBoundingClientRect();
        return _react["default"].createElement("div", {
          className: "fcc-slider-tooltip",
          style: {
            left: sliderRect.width - rightArrowRect.width
          }
        }, max);
      }

      return null;
    });

    _this.state = {
      state: states.NONE,
      value: 5,
      // current value, used when uncontrolled
      min: 1,
      // current minimum, used when uncontrolled
      max: 10,
      // current maximum, used when uncontrolled
      rail: null,
      // reference to rail
      handle: null,
      // reference to handle
      slider: null,
      // reference to slider
      leftArrow: null,
      // reference to left arrow
      rightArrow: null,
      // reference to right arrow
      dragOffset: 0,
      // mouse pointer offset when handle is dragged
      dragInterval: null,
      // interval timer when arrows are dragged
      dragDelta: 0 // current x delta when arrow is being dragged

    };
    _this.setHandleRef = _this.setHandleRef.bind(_assertThisInitialized(_this));
    _this.setRailRef = _this.setRailRef.bind(_assertThisInitialized(_this));
    _this.setSliderRef = _this.setSliderRef.bind(_assertThisInitialized(_this));
    _this.setLeftArrowRef = _this.setLeftArrowRef.bind(_assertThisInitialized(_this));
    _this.setRightArrowRef = _this.setRightArrowRef.bind(_assertThisInitialized(_this));
    return _this;
  }

  _createClass(Slider, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      // set up global mouse event listeners since components do not receive mouse events
      // when cursor is outside of the component (as when in dragging)
      this.onMouseDownListener = document.addEventListener("mousedown", this.handleMouseDown);
      this.onMouseUpListener = document.addEventListener("mouseup", this.handleMouseUp);
      this.onMouseMoveListener = document.addEventListener("mousemove", this.handleMouseMove);
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
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

      var dragInterval = this.state.dragInterval;

      if (dragInterval) {
        clearInterval(dragInterval);
      }
    } // functions to set the references to the different
    // parts of the slider

  }, {
    key: "setHandleRef",
    value: function setHandleRef(handle) {
      this.setState({
        handle: handle
      });
    }
  }, {
    key: "setRailRef",
    value: function setRailRef(rail) {
      this.setState({
        rail: rail
      });
    }
  }, {
    key: "setSliderRef",
    value: function setSliderRef(slider) {
      this.setState({
        slider: slider
      });
    }
  }, {
    key: "setLeftArrowRef",
    value: function setLeftArrowRef(leftArrow) {
      this.setState({
        leftArrow: leftArrow
      });
    }
  }, {
    key: "setRightArrowRef",
    value: function setRightArrowRef(rightArrow) {
      this.setState({
        rightArrow: rightArrow
      });
    } // get the min, max and value from the state or props depending
    // on whether the component is controlled or not

  }, {
    key: "render",
    value: function render() {
      var _this$props2 = this.props,
          disabled = _this$props2.disabled,
          style = _this$props2.style;
      var handleLeft = this.getHandleLeft();
      return _react["default"].createElement("div", {
        className: "fcc-slider",
        ref: this.setSliderRef,
        style: style
      }, _react["default"].createElement("div", {
        className: "fcc-slider-right-arrow",
        ref: this.setRightArrowRef
      }), _react["default"].createElement("div", {
        className: "fcc-slider-left-arrow",
        ref: this.setLeftArrowRef
      }), _react["default"].createElement("div", {
        className: "fcc-slider-rail",
        ref: this.setRailRef
      }), !disabled ? _react["default"].createElement("div", {
        className: "fcc-slider-handle",
        ref: this.setHandleRef,
        style: {
          left: handleLeft
        }
      }) : null, this.renderDragHandleTooltip(handleLeft), this.renderDragLeftArrowTooltip(), this.renderDragRightArrowTooltip());
    }
  }]);

  return Slider;
}(_react.Component);

exports["default"] = Slider;