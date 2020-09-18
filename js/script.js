const start1 = document.getElementById('start')
const stop1 = document.getElementById('stop')
const video = document.getElementById('video')
Promise.all([

    faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
    faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
    faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
    faceapi.nets.faceExpressionNet.loadFromUri('/models')
]).then(startVideo)
var tr;

function startVideo() {
    navigator.getUserMedia({ video: {} },
        stream => {
            video.srcObject = stream;
            tr = stream.getTracks();
        },
        err => console.error(err)
    )
}
stream1 = video.srcObject

function stopVideo() {

    tr.forEach(function(track) {
        if (track.readyState == 'live') {
            track.stop();
        }
    });

}
var max = 0
var checkFocus = 0
var checkFocusCounter = 0

start1.addEventListener('click', () => {
    const canvas = faceapi.createCanvasFromMedia(video)
    document.getElementById('box1').append(canvas)
    const displaySize = { width: video.width, height: video.height }
    faceapi.matchDimensions(canvas, displaySize)
    var lists = new Array();
    const imgUrl = `sourav.jpg`

    const img = faceapi.fetchImage(imgUrl);
    setInterval(async() => {
        const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions();
        // console.log(detections);
        lists = detections;
        if (lists.length > max) {
            max = lists.length;
        }
        if (lists.length == 0 && max > 0) {
            checkFocus = 1;
            checkFocusCounter = checkFocusCounter + 1;
        }
        const resizedDetections = faceapi.resizeResults(detections, displaySize)
        canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
        faceapi.draw.drawDetections(canvas, resizedDetections)
        faceapi.draw.drawFaceLandmarks(canvas, resizedDetections)
        faceapi.draw.drawFaceExpressions(canvas, resizedDetections)

    }, 100)

})

stop1.addEventListener('click', () => {

    console.log(`No. of peoples: ${max}`)
    if (max > 1) {
        document.getElementById('multiPeople').innerHTML = "Multiple people were detected here: " + max
    }
    if (max == 1) {
        document.getElementById('multiPeople').innerHTML = "User was detected here. "
    }
    if (max == 0) {
        document.getElementById('notPeople').innerHTML = "User not present throughout the session."
    }
    if (checkFocus == 1 && checkFocusCounter >= 2) {
        console.log(`CheckFocusCounter: ${checkFocusCounter}`);
        document.getElementById('handPeople').innerHTML = "User face was not visible properly. (" + (checkFocusCounter * 0.1 / 60).toFixed(3) + " mins)"
        document.getElementById('paritalPeople').innerHTML = `User was partially present in session. (${(checkFocusCounter * 0.1 / 60).toFixed(3)} mins)`
    }
    // stopVideo();
})


//for checking the user is authenticated or not
function checkImage() {
    const imgUrl = `sourav.jpg`

    const img = faceapi.fetchImage(imgUrl);
    setInterval(async() => {
        const fullFaceDescription = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDiscriptor();

        console.log([fullFaceDescription.descriptor])
    }, 100)

}