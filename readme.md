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

- [Scenes](#scenes)
- [Tracks](#tracks)
- [Devices](#devices)
- [MaxData](#maxdata)

### Scenes

#### getScenes()

Returns a `Promise` with an array containing scene data from the Ableton Live.
Current data is `name` and `color`. 

#### playScene(scene)

Fires a scene in Ableton Live

Parameters:

- `Scene` - Index of scene to play 

### Tracks

#### getTracks()

Returns a `Promise` with the of tracks from Ableton Live

### Song Tempo

#### getTempo()

Returns a `Promise` with the current song tempo in BPM

#### setTempo(tempo)

Sets the current song tempo in BPM

Paramters:

- `Tempo` - BPM tempo to set

### Devices

#### getDevicesForTrack(track)

Returns a `Promise` with a list of devices with parameters for the given track.

Parameters:

- `track` - The trackID

#### getParametersForDevice(track, device)

Return a `Promise` with device an array containing all device parameters for a single device

Paramters

- `track` - The trackID
- device - The device id

#### setParameterForDevice(track, device, parameterId, value)

Sets a specific parameter to the given value, on specific device. If value is lower or greater then min/max values for the given parameter, the value will be set to the lowest or highest possible parameter.

Parameters:

- `track` - The track id
- `device` - The device id
- `parameterId` - The parameter ID for the given parameter you want to change
- `value` - The value you want top change the parameter to

### Max data

#### getMaxData(method, path, property)

Returns a `Promise` with value from request - please see the [The Live Object Model](https://docs.cycling74.com/max7/vignettes/live_object_model) for more more info.

Parameters:

- `Method` - can be set to `get` or `count`
- `Path` - The max for live path according the [LOM](https://docs.cycling74.com/max7/vignettes/live_object_model) ex `live_set scenes`
- `Property` - The property you want to get ex `ClipSlots`

#### setMaxData(path, property,  value)

Sets a property value in Ableton by the Live Object Model path

Parameters

- `Path` - Live Object Model path
- `Property` - The property to set on the object
- `Value` - The value to set the property to

#### fireMaxData(path)

Make it possible to call an fire event on an object given by the Live Object Model

Parameters:

- `Path`- The Live Object Model path to call an fire event on

#### getMaxList(path, property, valuesToGet) 

Returns an array of objects with values given by the `valuesToGet` parameter

Paameters:

- `Path` - The Live Object Model path
- `Property` - The property to return the list data from
- `valuesToGet` - An array containing the name of the values to get from the Live Object Model

## Examples

For examples of usage see `index.js`