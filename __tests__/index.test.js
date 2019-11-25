import React from 'react';
import { mount } from 'enzyme';

import Slider from '../src/index';
import MockedSlider from '../src/index';

describe('Slider', () => {

  describe('Mounting and unmounting', () => {

    it('snapshot renders', () => {
      document.addEventListener = jest.fn((event, cb) => {
        return { remove: () => removeMock(event) };
      });
      const component = mount(<Slider />);
      expect(component).toMatchSnapshot();
    });

    it('snapshot renders (disabled)', () => {
      document.addEventListener = jest.fn((event, cb) => {
        return { remove: () => removeMock(event) };
      });
      const component = mount(<Slider disabled={true}/>);
      expect(component).toMatchSnapshot();
    });

    it('it unmounts calling the event listener callbacks', () => {
      const removeMock = jest.fn().mockName('remove event listener');
      document.addEventListener = jest.fn((event, cb) => {
        return { remove: () => removeMock(event) };
      });

      const component = mount(<Slider />);
      component.unmount();
      expect(removeMock.mock.calls.length).toBe(3);
      expect(removeMock.mock.calls[0][0]).toBe('mousedown');
      expect(removeMock.mock.calls[1][0]).toBe('mouseup');
      expect(removeMock.mock.calls[2][0]).toBe('mousemove');
    });

    it('it unmounts cleanly without listener callbacks', () => {
      document.addEventListener = jest.fn((event, cb) => {
        return null;
      });
      const component = mount(<Slider />);
      component.unmount();
    });

  });

  describe('Manipulation', () => {

    let eventMap;

    const refMockMap = {
      handle: {
        bottom: 57,
        height: 14,
        left: 0,
        right: 14,
        top: 43,
        width: 14,
        x: 0,
        y: 43,
      },
      rail: {
        bottom: 52,
        height: 4,
        left: 13,
        right: 1336,
        top: 48,
        width: 1323,
        x: 13,
        y: 48,
      },
      slider: {
        bottom: 57,
        height: 14,
        left: 0,
        right: 1349,
        top: 43,
        width: 1349,
        x: 0,
        y: 43,
      },
      leftArrow: {
        bottom: 57,
        height: 14,
        left: 0,
        right: 7,
        top: 43,
        width: 7,
        x: 0,
        y: 43,
      },
      rightArrow: {
        bottom: 57,
        height: 14,
        left: 1342,
        right: 1349,
        top: 43,
        width: 7,
        x: 1342,
        y: 43,
      },
    }

    function setRefMock(refName) {
      let newState = {};
      newState[refName] = {
        contains: function(name) {
          return name === refName;
        },
        getBoundingClientRect: function() {
          return refMockMap[refName];
        }
      }
      return function () {
        this.setState(newState);
      }
    }

    let setHandleRefMock, setRailRefMock, setSliderRefMock, setLeftArrowRefMock, setRightArrowRefMock;

    function mouseEvent(args) {
      return {
        ...args,
        stopPropagation: () => {},
        preventDefault: () => {},
      };
    }

    beforeAll(() => {
      setHandleRefMock = jest.spyOn(MockedSlider.prototype, 'setHandleRef').mockImplementation(setRefMock('handle'));
      setRailRefMock = jest.spyOn(MockedSlider.prototype, 'setRailRef').mockImplementation(setRefMock('rail'));
      setSliderRefMock = jest.spyOn(MockedSlider.prototype, 'setSliderRef').mockImplementation(setRefMock('slider'));
      setLeftArrowRefMock = jest.spyOn(MockedSlider.prototype, 'setLeftArrowRef').mockImplementation(setRefMock('leftArrow'));
      setRightArrowRefMock = jest.spyOn(MockedSlider.prototype, 'setRightArrowRef').mockImplementation(setRefMock('rightArrow'));
    });

    beforeEach(() => {
      eventMap = {};
      document.addEventListener = jest.fn((event, cb) => {
        eventMap[event] = cb;
      });
    });

    it('it renders (refs mocked)', () => {
      const component = mount(<MockedSlider/>);
      expect(setHandleRefMock.mock.calls.length).toBe(1);
      expect(setRailRefMock.mock.calls.length).toBe(1);
      expect(setSliderRefMock.mock.calls.length).toBe(1);
      expect(setLeftArrowRefMock.mock.calls.length).toBe(1);
      expect(setRightArrowRefMock.mock.calls.length).toBe(1);
    });

    it('it does not respond to dragging handle when disabled', () => {
      const onChangeValue = jest.fn();
      const component = mount(<MockedSlider disabled={true} onChangeValue={onChangeValue}/>);
      eventMap.mousedown(mouseEvent({ target: 'handle', clientX: 6 }));
      eventMap.mousemove(mouseEvent({ x: 100 }));
      eventMap.mouseup(mouseEvent({}));
      expect(onChangeValue.mock.calls.length).toBe(0);
    });

    it('it responds correctly to dragging the handle when uncontrolled without onDrag', () => {
      const onChangeValue = jest.fn();
      const component = mount(<MockedSlider onChangeValue={onChangeValue}/>);
      eventMap.mousedown(mouseEvent({ target: 'handle', clientX: 6 }));
      eventMap.mousemove(mouseEvent({ x: 50 }));
      eventMap.mousemove(mouseEvent({ x: 100 }));
      eventMap.mouseup(mouseEvent({}));
      expect(onChangeValue.mock.calls.length).toBe(1);
      expect(onChangeValue.mock.calls[0][0]).toBeCloseTo(1.598639455782313);
    });

    it('it responds correctly to dragging the handle when uncontrolled with onDrag', () => {
      const onChangeValue = jest.fn();
      const onDrag = jest.fn();
      const component = mount(<MockedSlider onChangeValue={onChangeValue} onDrag={onDrag}/>);
      eventMap.mousedown(mouseEvent({ target: 'handle', clientX: 6 }));
      eventMap.mousemove(mouseEvent({ x: 50 }));
      eventMap.mousemove(mouseEvent({ x: 100 }));
      eventMap.mouseup(mouseEvent({}));
      expect(onChangeValue.mock.calls.length).toBe(1);
      expect(onChangeValue.mock.calls[0][0]).toBe(1.598639455782313);
      expect(onDrag.mock.calls.length).toBe(2);
      expect(onDrag.mock.calls[0][0]).toBe(1.2585034013605443);
      expect(onDrag.mock.calls[1][0]).toBe(1.598639455782313);
    });

    it('it responds correctly to dragging the handle when controlled without onDrag', () => {
      const onChangeValue = jest.fn();
      const component = mount(<MockedSlider onChangeValue={onChangeValue} value={3} min={2} max={4}/>);
      eventMap.mousedown(mouseEvent({ target: 'handle', clientX: 6 }));
      eventMap.mousemove(mouseEvent({ x: 50 }));
      eventMap.mousemove(mouseEvent({ x: 100 }));
      eventMap.mouseup(mouseEvent({}));
      expect(onChangeValue.mock.calls.length).toBe(1);
      expect(onChangeValue.mock.calls[0][0]).toBeCloseTo(2.133030990173847);
    });

    it('it responds correctly to dragging the handle when uncontrolled without onChangeValue', () => {
      const component = mount(<MockedSlider />);
      eventMap.mousedown(mouseEvent({ target: 'handle', clientX: 6 }));
      eventMap.mousemove(mouseEvent({ x: 50 }));
      eventMap.mousemove(mouseEvent({ x: 100 }));
      eventMap.mouseup(mouseEvent({}));
      expect(component).toMatchSnapshot();
    });

    it('it responds correctly to dragging the handle when uncontrolled with onDrag', () => {
      const onChangeValue = jest.fn();
      const onDrag = jest.fn();
      const component = mount(<MockedSlider onChangeValue={onChangeValue} onDrag={onDrag}/>);
      eventMap.mousedown(mouseEvent({ target: 'handle', clientX: 6 }));
      eventMap.mousemove(mouseEvent({ x: 6 }));
      eventMap.mouseup(mouseEvent({}));
      expect(onDrag.mock.calls.length).toBe(1);
      eventMap.mousedown(mouseEvent({ target: 'handle', clientX: 6 }));
      eventMap.mousemove(mouseEvent({ x: 6 }));
      eventMap.mouseup(mouseEvent({}));
      expect(onDrag.mock.calls.length).toBe(1);
    });

    it('dragging the left arrow right increases min and preserves min <= value', () => {
      jest.useFakeTimers();
      const onChangeMin = jest.fn();
      const component = mount(<MockedSlider onChangeMin={onChangeMin}/>);
      eventMap.mousedown(mouseEvent({ target: 'leftArrow' }));
      eventMap.mousemove(mouseEvent({ x: 0 }));
      expect(setInterval).toHaveBeenCalledTimes(1);
      expect(setInterval).toHaveBeenLastCalledWith(expect.any(Function), 100);
      jest.runOnlyPendingTimers();
      expect(onChangeMin.mock.calls.length).toBe(0);
      eventMap.mousemove(mouseEvent({ x: 15 }));
      expect(onChangeMin.mock.calls.length).toBe(0);
      jest.runOnlyPendingTimers();
      expect(onChangeMin.mock.calls.length).toBe(1);
      expect(onChangeMin.mock.calls[0][0]).toBe(1.1);
      eventMap.mousemove(mouseEvent({ x: 30 }));
      jest.runOnlyPendingTimers();
      expect(onChangeMin.mock.calls.length).toBe(2);
      expect(onChangeMin.mock.calls[1][0]).toBe(3);
      jest.runOnlyPendingTimers();
      jest.runOnlyPendingTimers();
      jest.runOnlyPendingTimers();
      expect(onChangeMin.mock.calls.length).toBe(4);
      expect(clearInterval).toHaveBeenCalledTimes(0);
      eventMap.mouseup(mouseEvent({}));
      expect(clearInterval).toHaveBeenCalledTimes(1);
    });

    it('dragging the left arrow right preserves min < max', () => {
      jest.useFakeTimers();
      const onChangeMin = jest.fn();
      const component = mount(<MockedSlider onChangeValue={onChangeMin} value={1.00001} max={1.00001}/>);
      eventMap.mousedown(mouseEvent({ target: 'leftArrow' }));
      eventMap.mousemove(mouseEvent({ x: 30 }));
      jest.runOnlyPendingTimers();
      expect(onChangeMin.mock.calls.length).toBe(0);
    });

    it('dragging the left arrow left decreases min', () => {
      jest.useFakeTimers();
      const onChangeMin = jest.fn();
      const component = mount(<MockedSlider onChangeMin={onChangeMin}/>);
      eventMap.mousedown(mouseEvent({ target: 'leftArrow' }));
      eventMap.mousemove(mouseEvent({ x: 0 }));
      expect(setInterval).toHaveBeenCalledTimes(1);
      expect(setInterval).toHaveBeenLastCalledWith(expect.any(Function), 100);
      jest.runOnlyPendingTimers();
      expect(onChangeMin.mock.calls.length).toBe(0);
      eventMap.mousemove(mouseEvent({ x: -15 }));
      expect(onChangeMin.mock.calls.length).toBe(0);
      jest.runOnlyPendingTimers();
      expect(onChangeMin.mock.calls.length).toBe(1);
      expect(onChangeMin.mock.calls[0][0]).toBe(0.9);
      eventMap.mousemove(mouseEvent({ x: -30 }));
      jest.runOnlyPendingTimers();
      expect(onChangeMin.mock.calls.length).toBe(2);
      expect(onChangeMin.mock.calls[1][0]).toBe(-1);
      expect(clearInterval).toHaveBeenCalledTimes(0);
      eventMap.mouseup(mouseEvent({}));
      expect(clearInterval).toHaveBeenCalledTimes(1);
    });

    it('dragging left arrow without onChangeMin calls setInterval and clearInterval', () => {
      jest.useFakeTimers();
      const component = mount(<MockedSlider />);
      eventMap.mousedown(mouseEvent({ target: 'leftArrow' }));
      eventMap.mousemove(mouseEvent({ x: 15 }));
      expect(setInterval).toHaveBeenCalledTimes(1);
      expect(setInterval).toHaveBeenLastCalledWith(expect.any(Function), 100);
      jest.runOnlyPendingTimers();
      expect(clearInterval).toHaveBeenCalledTimes(0);
      eventMap.mouseup(mouseEvent({}));
      expect(clearInterval).toHaveBeenCalledTimes(1);
    });

    it('dragging right arrow right increases max', () => {
      jest.useFakeTimers();
      const onChangeMax = jest.fn();
      const component = mount(<MockedSlider onChangeMax={onChangeMax}/>);
      eventMap.mousedown(mouseEvent({ target: 'rightArrow' }));
      eventMap.mousemove(mouseEvent({ x: 1342 }));
      expect(setInterval).toHaveBeenCalledTimes(1);
      expect(setInterval).toHaveBeenLastCalledWith(expect.any(Function), 100);
      jest.runOnlyPendingTimers();
      expect(onChangeMax.mock.calls.length).toBe(0);
      eventMap.mousemove(mouseEvent({ x: 1357 }));
      expect(onChangeMax.mock.calls.length).toBe(0);
      jest.runOnlyPendingTimers();
      expect(onChangeMax.mock.calls.length).toBe(1);
      expect(onChangeMax.mock.calls[0][0]).toBe(10.1);
      eventMap.mousemove(mouseEvent({ x: 1372 }));
      jest.runOnlyPendingTimers();
      expect(onChangeMax.mock.calls.length).toBe(2);
      expect(onChangeMax.mock.calls[1][0]).toBe(12);
      expect(clearInterval).toHaveBeenCalledTimes(0);
      eventMap.mouseup(mouseEvent({}));
      expect(clearInterval).toHaveBeenCalledTimes(1);
    });

    it('dragging right arrow left preserves max > min', () => {
      jest.useFakeTimers();
      const onChangeMax = jest.fn();
      const component = mount(<MockedSlider onChangeMax={onChangeMax} value={1} max={1.00001}/>);
      eventMap.mousedown(mouseEvent({ target: 'rightArrow' }));
      eventMap.mousemove(mouseEvent({ x: 1302 }));
      jest.runOnlyPendingTimers();
      expect(onChangeMax.mock.calls.length).toBe(0);
    });

    it('dragging right arrow right decreases max and preserves max >= value', () => {
      jest.useFakeTimers();
      const onChangeMax = jest.fn();
      const component = mount(<MockedSlider onChangeMax={onChangeMax}/>);
      eventMap.mousedown(mouseEvent({ target: 'rightArrow' }));
      eventMap.mousemove(mouseEvent({ x: 1342 }));
      expect(setInterval).toHaveBeenCalledTimes(1);
      expect(setInterval).toHaveBeenLastCalledWith(expect.any(Function), 100);
      jest.runOnlyPendingTimers();
      expect(onChangeMax.mock.calls.length).toBe(0);
      eventMap.mousemove(mouseEvent({ x: 1327 }));
      expect(onChangeMax.mock.calls.length).toBe(0);
      jest.runOnlyPendingTimers();
      expect(onChangeMax.mock.calls.length).toBe(1);
      expect(onChangeMax.mock.calls[0][0]).toBe(9.9);
      eventMap.mousemove(mouseEvent({ x: 1312 }));
      jest.runOnlyPendingTimers();
      expect(onChangeMax.mock.calls.length).toBe(2);
      expect(onChangeMax.mock.calls[1][0]).toBe(8);
      jest.runOnlyPendingTimers();
      jest.runOnlyPendingTimers();
      jest.runOnlyPendingTimers();
      jest.runOnlyPendingTimers();
      expect(onChangeMax.mock.calls.length).toBe(5);
      expect(clearInterval).toHaveBeenCalledTimes(0);
      eventMap.mouseup(mouseEvent({}));
      expect(clearInterval).toHaveBeenCalledTimes(1);
    });

    it('dragging right arrow right without onChangeMax calls setInterval and clearInterval', () => {
      jest.useFakeTimers();
      const component = mount(<MockedSlider />);
      eventMap.mousedown(mouseEvent({ target: 'rightArrow' }));
      eventMap.mousemove(mouseEvent({ x: 1357 }));
      expect(setInterval).toHaveBeenCalledTimes(1);
      expect(setInterval).toHaveBeenLastCalledWith(expect.any(Function), 100);
      jest.runOnlyPendingTimers();
      expect(clearInterval).toHaveBeenCalledTimes(0);
      eventMap.mouseup(mouseEvent({}));
      expect(clearInterval).toHaveBeenCalledTimes(1);
    });

    it('it calls clearInterval if unmounted when dragging', () => {
      jest.useFakeTimers();
      const onChangeMin = jest.fn();
      const component = mount(<MockedSlider onChangeMin={onChangeMin}/>);
      eventMap.mousedown(mouseEvent({ target: 'leftArrow' }));
      eventMap.mousemove(mouseEvent({ x: 15 }));
      expect(clearInterval).toHaveBeenCalledTimes(0);
      component.unmount();
      expect(clearInterval).toHaveBeenCalledTimes(1);
    });

    it('it responds correctly to clicking the slider', () => {
      const onChangeValue = jest.fn();
      const component = mount(<MockedSlider onChangeValue={onChangeValue}/>);
      eventMap.mousedown(mouseEvent({ target: 'slider' }));
      eventMap.mousemove(mouseEvent({ }));
      eventMap.mouseup(mouseEvent({ target: 'slider', x: 500 }));
      expect(onChangeValue).toHaveBeenCalledTimes(1);
      expect(onChangeValue.mock.calls[0][0]).toBe(4.312925170068027);
    });

    it('it saturates to value = max when clicking slider right of rail', () => {
      const onChangeValue = jest.fn();
      const component = mount(<MockedSlider onChangeValue={onChangeValue}/>);
      eventMap.mousedown(mouseEvent({ target: 'slider' }));
      eventMap.mousemove(mouseEvent({ }));
      eventMap.mouseup(mouseEvent({ target: 'slider', x: 1400 }));
      expect(onChangeValue).toHaveBeenCalledTimes(1);
      expect(onChangeValue.mock.calls[0][0]).toBe(10);
    });

    it('it does not change value if new value is equal to old value', () => {
      const onChangeValue = jest.fn();
      const component = mount(<MockedSlider onChangeValue={onChangeValue} value={4.312925170068027}/>);
      eventMap.mousedown(mouseEvent({ target: 'slider' }));
      eventMap.mouseup(mouseEvent({ target: 'slider', x: 500 }));
      expect(onChangeValue).toHaveBeenCalledTimes(0);
    });

    it('it does not change value if mouse down on slider, and mouse up outside slider', () => {
      const onChangeValue = jest.fn();
      const component = mount(<MockedSlider onChangeValue={onChangeValue}/>);
      eventMap.mousedown(mouseEvent({ target: 'slider' }));
      eventMap.mouseup(mouseEvent({ target: 'rail' }));
      expect(onChangeValue).toHaveBeenCalledTimes(0);
    });

    it('the rail itself does not respond to clicking', () => {
      const onChangeValue = jest.fn();
      const component = mount(<MockedSlider onChangeValue={onChangeValue}/>);
      eventMap.mousedown(mouseEvent({ target: 'rail' }));
      eventMap.mouseup(mouseEvent({ target: 'rail', x: 500 }));
      expect(onChangeValue).toHaveBeenCalledTimes(0);
    });

  });

});