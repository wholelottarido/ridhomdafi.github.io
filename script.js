const startRecordingBtn = document.getElementById('startRecording');
const stopRecordingBtn = document.getElementById('stopRecording');
const saveRecordingBtn = document.getElementById('saveRecording');
const recordedVideo = document.getElementById('recordedVideo');
const fileNameInput = document.getElementById('fileName');
const watermarkInput = document.getElementById('watermarkText');

let mediaRecorder;
let recordedChunks = [];

startRecordingBtn.addEventListener('click', startRecording);
stopRecordingBtn.addEventListener('click', stopRecording);
saveRecordingBtn.addEventListener('click', saveRecording);
fileNameInput.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        saveRecording();
    }
});

async function startRecording() {
    const stream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: true });
    const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });

    stream.addTrack(audioStream.getAudioTracks()[0]);
    mediaRecorder = new MediaRecorder(stream);

    mediaRecorder.ondataavailable = function (e) {
        recordedChunks.push(e.data);
    };

    mediaRecorder.onstop = function () {
        const blob = new Blob(recordedChunks, { type: 'video/webm' });
        recordedVideo.src = URL.createObjectURL(blob);
    };

    recordedChunks = [];
    mediaRecorder.start();
}



function stopRecording() {
    mediaRecorder.stop();
}

function handleKeyPress(event) {
    if (event.key === 'Enter') {
        saveRecording();
    }
}

function saveRecording() {
    const fileName = fileNameInput.value || 'recorded-video'; // Default file name
    const blob = new Blob(recordedChunks, { type: 'video/webm' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `${fileName}.webm`;
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
}
