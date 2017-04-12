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
        this.max.call({
            path: 'live_set scenes ' + scene,
            method: 'fire'
        });
    }

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
     * Returns list of scenes in Ableton live with name and color
     * @returns {Promise.<TResult>}
     */
    getScenes() {
        return this.getMaxData('count', 'live_set', 'scenes')
            .then((count) => {
               return new Promise((resolve, reject) => {
                   let scenes = [ ];
                   let promises = [ ];
                   for(let i = 0; i<count; i++) {
                       promises[i] = new Promise((resolve, reject) => {
                           let path = 'live_set scenes ' + i;
                           let name = this.getMaxData('get', path, 'name');
                           let color = this.getMaxData('get', path, 'color');
                           Promise.all([name, color]).then((values) => {
                               scenes[i] = {
                                   name: values[0],
                                   color: values[1]
                               };
                               resolve();
                           })
                       });
                   }
                   Promise.all(promises).then(() => {
                       resolve(scenes);
                   });
               });
            });
    }
}

module.exports = new AbletonAPI();