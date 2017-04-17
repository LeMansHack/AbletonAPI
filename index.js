let AbletonAPI = require('./abletonapi');

//Data read
AbletonAPI.getScenes().then((scenes) => {console.log('Scene data: ',scenes)});
AbletonAPI.getTracks().then((tracks) => {console.log('Tracks data: ',tracks)});
AbletonAPI.getDevicesForTrack(0).then((devices) => {console.log('Device data: ',devices)});
AbletonAPI.getDevicesForMasterTrack(0).then((devices) => {console.log('Master devices data: ',devices)});
AbletonAPI.getParametersForDevice('master_track', 0).then((parameters) => {console.log('Master device 0 parameters: ',parameters)});
AbletonAPI.getTempo().then((tempo) => {console.log('Tempo info:', tempo)});

//Data write
AbletonAPI.setTempo(120);
AbletonAPI.playScene(1);