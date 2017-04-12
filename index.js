let AbletonAPI = require('./abletonapi');
AbletonAPI.getScenes().then((scenes) => {console.log(scenes)});