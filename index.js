let AbletonAPI = require('./abletonapi');

//Data read
AbletonAPI.getScenes().then((scenes) => {console.log('Scene data: ',scenes)});
AbletonAPI.getTracks().then((tracks) => {console.log('Tracks data: ',tracks)});
AbletonAPI.getDevicesForTrack(11).then((devices) => {console.log('Device data: ',devices)});
AbletonAPI.getDevicesForTrack('master_track').then((devices) => {console.log('Master devices data: ',devices)});
AbletonAPI.getParametersForDevice('master_track', 0).then((parameters) => {console.log('Master device 0 parameters: ',parameters)});
AbletonAPI.getTempo().then((tempo) => {console.log('Tempo info:', tempo)});
AbletonAPI.getClipsForTrack(17).then((clips) => {console.log('Clips for track 17', clips)});

//Data write
AbletonAPI.playClip(17, 284);
AbletonAPI.setTempo(120);
AbletonAPI.playScene(1);
AbletonAPI.setParameterForDevice('master_track', 0, 5, 100);
