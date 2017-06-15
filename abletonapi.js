let Max4Node = require('max4node');

class AbletonAPI {
    constructor() {
        this.max = new Max4Node();
        this.max.bind();
    }

    /**
     * Plays a single scene
     * @param scene
     */
    playScene(scene) {
        this.fireMaxData('live_set scenes ' + scene);
    }

    /**
     * Retruns max data as promise
     * @param method
     * @param path
     * @param property
     * @returns {Promise}
     */
    getMaxData(method, path, property) {
        return new Promise((resolve, reject) => {
            let data = {
                path: path,
                property: property
            };

            switch (method) {
                case "get":
                    this.max.get(data).on('value', resolve);
                    break;
                case "count":
                    this.max.count(data).on('value', resolve);
                    break;
                default:
                    reject(null);
                    break;
            }
        });
    }

    /**
     * Sets max data
     * @param path
     * @param property
     * @param value
     */
    setMaxData(path, property, value) {
        let data = {
            path: path,
            property: property,
            value: value
        };

        this.max.set(data);
    };

    /**
     * Fires a cue or data point
     * @param path
     */
    fireMaxData(path) {
        this.max.call({
            path: path,
            method: 'fire'
        });
    }

    /**
     * Retruns an array with object data from Ableton
     * @param path
     * @param property
     * @param valuesToGet
     * @returns {Promise.<TResult>}
     */
    getMaxList(path, property, valuesToGet) {
        return this.getMaxData('count', path, property)
            .then((count) => {
                return new Promise((resolve, reject) => {
                    let data = [ ];
                    let promises = [ ];
                    for(let i = 0; i<count; i++) {
                        promises[i] = new Promise((resolve, reject) => {
                            let subpath = path + ' ' + property + ' ' + i;
                            let subpromises = [ ];
                            for(let y in valuesToGet) {
                                subpromises.push(this.getMaxData('get', subpath, valuesToGet[y]));
                            }

                            Promise.all(subpromises).then((values) => {
                                data[i] = { };
                                data[i].id = i;
                                for(let z in values) {
                                    data[i][valuesToGet[z]] = values[z];
                                }
                                resolve();
                            })
                        });
                    }
                    Promise.all(promises).then(() => {
                        resolve(data);
                    });
                });
            });
    };

    /**
     * Returns list of scenes in Ableton live with name and color
     * @returns {Promise.<TResult>}
     */
    getScenes() {
        return this.getMaxList('live_set', 'scenes', ['name', 'color']);
    }

    /**
     * Returns song tempo
     * @returns {Promise}
     */
    getTempo() {
        return this.getMaxData('get', 'live_set master_track mixer_device song_tempo', 'value');
    }

    /**
     * Sets song tempo
     * @param tempo
     */
    setTempo(tempo) {
        this.setMaxData('live_set master_track mixer_device song_tempo', 'value', tempo);
    }

    /**
     * Retruns list of all tracks
     * @returns {Promise.<TResult>}
     */
    getTracks() {
        return this.getMaxList('live_set', 'tracks', ['name']);
    }

    /**
     * Returns all clips for a given track
     * @param track
     * @returns {Promise.<TResult>}
     */
    getClipsForTrack(track) {
        let path = 'live_set tracks ' + track;
        if(track === 'master_track') {
            path = 'live_set master_track';
        }

        return this.getMaxList(path, 'clip_slots', ['has_clip'])
            .then((clips) => {
                return new Promise((resolve, reject) => {
                    let Promises = [ ];
                    let ClipID = [ ];
                    for(let i in clips) {
                        if(clips[i].has_clip) {
                            let clipPath = path + ' clip_slots ' + clips[i].id + ' clip';
                            ClipID.push(clips[i].id);
                            Promises.push(Promise.all([
                                this.getMaxData('get', clipPath, 'name'),
                                this.getMaxData('get', clipPath, 'color'),
                                this.getMaxData('get', clipPath, 'is_audio_clip'),
                                this.getMaxData('get', clipPath, 'is_midi_clip')
                            ]));
                        }
                    }

                    Promise.all(Promises).then((clips) => {
                        let result = [ ];
                        for(let i in ClipID) {
                            result.push({
                                id: ClipID[i],
                                clip: {
                                    name: clips[i][0],
                                    color: clips[i][1],
                                    is_audio_clip: clips[i][2],
                                    is_midi_clip: clips[i][3]
                                }
                            });
                        }

                        resolve(result);
                    });
                });
            });
    }

    /**
     * Returns list of devices for track
     * @param track
     * @returns {Promise.<TResult>}
     */
    getDevicesForTrack(track) {
        let path = 'live_set tracks ' + track;
        if(track === 'master_track') {
            path = 'live_set master_track';
        }

        return this.getMaxList(path, 'devices', ['name', 'type', 'class_name', 'can_have_drum_pads', 'can_have_chains'])
            .then((devices) => {
                return new Promise((resolve, reject) => {
                    let promises = [ ];
                    for(let i in devices) {
                        promises[i] = this.getParametersForDevice(track, i);
                    }

                    Promise.all(promises).then((values) => {
                        for(let y in values) {
                            devices[y]['Parameters'] = values[y];
                        }

                        resolve(devices);
                    });
                });
            });
    }

    /**
     * Returns parameters for device or master_track
     * @param track
     * @param device
     * @returns {Promise.<TResult>}
     */
    getParametersForDevice(track, device) {
        let device_values = [
            'default_value',
            'is_enabled',
            'is_quantized',
            'max',
            'min',
            'name',
            'original_name',
            'value'
        ];

        if(track === 'master_track') {
            return this.getMaxList('live_set master_track devices ' + device, 'parameters', device_values);
        } else {
            return this.getMaxList('live_set tracks ' + track + ' devices ' + device, 'parameters', device_values);
        }
    }

    /**
     * Sets parameter for device
     * @param track
     * @param device
     * @param parameterId
     * @param value
     */
    setParameterForDevice(track, device, parameterId, value) {
        let path = '';
        if(track === 'master_track') {
            path = 'live_set master_track devices ' + device + ' parameters ' + parameterId;
        } else {
            path = 'live_set tracks ' + track + ' devices ' + device + ' parameters ' + parameterId;
        }

        Promise.all([this.getMaxData('get', path, 'min'), this.getMaxData('get', path, 'max')]).then((minMax) => {
            if(value < minMax[0]) {
                this.setMaxData(path, 'value', minMax[0]);
            } else if(value > minMax[1]) {
                this.setMaxData(path, 'value', minMax[1]);
            } else {
                this.setMaxData(path, 'value', value);
            }
        });
    }
}

module.exports = new AbletonAPI();