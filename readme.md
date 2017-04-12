# Ableton Live Node API

Ableton Live API written in Node, using the awesome project [Max4Node](https://github.com/alpacaaa/max4node)

**Notice** that this API is under development and more features will come as time goes

## Requirements

- Ableton Live
- Max4Live
- NodeJS

## Installation

1. Run `yarn install`
2. Start Ableton Live and add the `max4node.amxd` device to your mix. Find it in `node_modules/max4node/max_device/max4node.amxd`
3. You are good to go! :D

## Methods

### playScene(scene)

Fires a scene in Ableton Live

Parameters:

- `Scene` - Index of scene to play 

### getMaxData(method, path, property)

Returns a `Promise` with value from request - please see the [The Live Object Model](https://docs.cycling74.com/max7/vignettes/live_object_model) for more more info.

Parameters:

- `Method` - can be set to `get` or `count`
- `Path` - The max for live path according the [LOM](https://docs.cycling74.com/max7/vignettes/live_object_model) ex `live_set scenes`
- `Property` - The property you want to get ex `ClipSlots`

### getScenes()

Returns a `Promise` with an array containing scene data from the Ableton Live.
Current data is `name` and `color`. 

## Examples

For examples of usage see `index.js`