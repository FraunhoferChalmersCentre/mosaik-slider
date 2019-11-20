# mosaik-datasheet

[![Build Status](https://travis-ci.com/FraunhoferChalmersCentre/mosaik-slider.svg?branch=master)](https://travis-ci.com/FraunhoferChalmersCentre/mosaik-slider)

**mosaik-slider** is a React component for a slider with adjustable limits. The adjustment of the min/max handles is regulated by the magnitude of the offset of the drag position from the nominal handle position. Once in an increment/decrement zone, the adjustment is made every 100ms.

## Installation
```sh
npm i -S @hagmar/mosaik-slider
```

## Usage

Import the slider:

```js
import Slider from '@hagmar/mosaik-slider'
```

To render an uncontrolled slider:

```js
render() {
  return (
    <Slider />
  );
}
```

The `min`, `max`, `value`, `onChangeMin`, `onChangeMax`, `onChangeValue`, and `onDrag` properties can be provided to control all or selected parts of the slider operation. A fully controlled slider would then be rendered by e.g.:

```js
<Slider
  min={ this.state.min }
  max={ this.state.max }
  value={ this.state.value }
  onChangeMin={ (min) => this.setState({ min }) }
  onChangeMax={ (max) => this.setState({ max }) }
  onChangeValue={ (value) => this.setState({ value }) }
  onDrag={ (value) => this.setState( { value }) }
/>
```

## Copyright
Copyright Fraunhofer-Chalmers Centre (2019)
