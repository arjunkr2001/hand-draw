let w = window.innerWidth
let h = window.innerHeight
let vw,vh
const videoElement = document.querySelector('.input_video');
const canvasElement = document.querySelector('.output_canvas');
const ctx = canvasElement.getContext('2d');
let dc = document.getElementById('draw')
videoElement.addEventListener('loadedmetadata',e=>{
  vw = videoElement.videoWidth
  vh = videoElement.videoHeight
  canvasElement.width = vw
  canvasElement.height = vh
  dc.width = vw
  dc.height = vh
})
let dctx = dc.getContext('2d')
let x,y,px,py

function onResults(results) {
    ctx.save();
    ctx.clearRect(0, 0, canvasElement.width, canvasElement.height);
    ctx.drawImage(results.image, 0, 0, canvasElement.width, canvasElement.height);
    if (results.multiHandLandmarks) {
        for (const landmarks of results.multiHandLandmarks) {
          //console.log(landmarks)
          px = x
          py = y
          x = landmarks[8].x*vw
          y = landmarks[8].y*vh
          ctx.beginPath()
          ctx.fillStyle = "#00ffee"
          ctx.arc(x,y,10,0,2*Math.PI)
          ctx.fill()
          drawConnectors(ctx, landmarks, HAND_CONNECTIONS,{color: '#00ffee', lineWidth: 5});
          drawLandmarks(ctx, landmarks, {color: '#ee00ff', lineWidth: 2});
          if(landmarks[8].y<landmarks[12].y-0.1){
            dctx.beginPath()
            dctx.moveTo(px,py)
            dctx.strokeStyle = "#00ff00"
            dctx.lineWidth = 3
            dctx.lineTo(x,y)
            dctx.stroke()
          }
        }
    }
    ctx.restore();
}
    
const hands = new Hands({locateFile: (file) => {
  return `hands/${file}`;
}});
hands.setOptions({
    selfieMode: true,
    maxNumHands: 1,
    modelComplexity: 1,
    minDetectionConfidence: 0.5,
    minTrackingConfidence: 0.5
});
hands.onResults(onResults);
    
const camera = new Camera(videoElement, {
  onFrame: async () => {
    await hands.send({image: videoElement});
  },
  width: w,
  height: h
});
camera.start();