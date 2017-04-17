let AbletonAPI = require('./abletonapi');

//Data read
AbletonAPI.getScenes().then((scenes) => {console.log('Scene data: ',scenes)});
AbletonAPI.getTracks().then((tracks) => {console.log('Tracks data: ',tracks)});
AbletonAPI.getTempo().then((tempo) => {console.log('Tempo info:', tempo)});

//Data write
AbletonAPI.setTempo(120);
AbletonAPI.playScene(1);