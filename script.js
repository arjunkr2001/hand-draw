let w = window.innerWidth
let h = window.innerHeight
let vw,vh
const videoElement = document.querySelector('.input_video');
const canvasElement = document.querySelector('.output_canvas');
const ctx = canvasElement.getContext('2d');
let dc = document.getElementById('draw')
let oc = document.getElementById('overlay')
videoElement.addEventListener('play',()=>{
  setTimeout(()=>{
    document.getElementById("spinner").remove()
  },5000)
})
videoElement.addEventListener('loadedmetadata',e=>{
  vw = videoElement.videoWidth
  vh = videoElement.videoHeight
  canvasElement.width = vw
  canvasElement.height = vh
  dc.width = vw
  dc.height = vh
  oc.width = vw
  oc.height = vh
})
let octx = oc.getContext('2d')
let dctx = dc.getContext('2d')
let x,y,px,py

function onResults(results) {
    ctx.save();
    ctx.clearRect(0, 0, canvasElement.width, canvasElement.height);
    octx.clearRect(0,0,oc.width,oc.height)
    ctx.drawImage(results.image, 0, 0, canvasElement.width, canvasElement.height);
    if (results.multiHandLandmarks) {
        for (const landmarks of results.multiHandLandmarks) {
          //console.log(landmarks[12].z)
          px = x
          py = y
          x = landmarks[8].x*vw
          y = landmarks[8].y*vh
          //console.log(x,y)
          ctx.beginPath()
          ctx.fillStyle = "#00ffee"
          ctx.arc(x,y,10,0,2*Math.PI)
          ctx.fill()
          //drawConnectors(ctx, landmarks, HAND_CONNECTIONS,{color: '#00ffee', lineWidth: 5});
          //drawLandmarks(ctx, landmarks, {color: '#ee00ff', lineWidth: 2});
          if(landmarks[8].y<landmarks[16].y-0.1){
            if(landmarks[8].y>landmarks[12].y){
              octx.beginPath()
              octx.fillStyle = "rgba(15,143,255,0.5)"
              octx.rect(x-20,y-20,50,50)
              octx.fill()
              dctx.clearRect(x-20,y-20,50,50)
            }
            else{
              dctx.beginPath()
              dctx.moveTo(px,py)
              dctx.strokeStyle = "#00ff00"
              dctx.lineWidth = 3
              dctx.lineTo(x,y)
              dctx.stroke()
            }
          }
          if(landmarks[20].y<landmarks[12].y-((-landmarks[12].z*0.833)+0.05)){
            dctx.clearRect(0, 0, dc.width, dc.height)
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