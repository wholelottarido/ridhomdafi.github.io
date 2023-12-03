const express = require('express');
const multer = require('multer');
const fs = require('fs');
const { exec } = require('child_process');

const app = express();
const upload = multer({ dest: 'uploads/' });

app.post('/saveRecording', upload.single('video'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('Tidak ada file yang diunggah');
    }

    const inputFile = req.file.path;
    const destination = 'recordings/'; // Ubah sesuai dengan folder penyimpanan yang diinginkan
    const outputFile = `${destination}recorded-video.webm`;

    fs.rename(inputFile, outputFile, (err) => {
        if (err) {
            console.error('Gagal menyimpan file:', err);
            return res.status(500).send('Gagal menyimpan rekaman');
        }
        console.log('Rekaman berhasil disimpan di server');
        res.status(200).send('Rekaman berhasil disimpan');
    });
});

app.post('/convertToMP4', upload.single('video'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('Tidak ada file yang diunggah');
    }

    const inputFile = req.file.path;
    const destination = 'recordings/'; // Ubah sesuai dengan folder penyimpanan yang diinginkan
    const outputFile = `${destination}converted-video.mp4`;

    const command = `ffmpeg -i ${inputFile} ${outputFile}`;
    exec(command, async (error, stdout, stderr) => {
        if (error) {
            console.error(`Error: ${error.message}`);
            return res.status(500).send('Konversi gagal');
        }
        console.log(`Konversi berhasil`);

        const convertedBuffer = await fs.promises.readFile(outputFile);
        res.set({
            'Content-Type': 'video/mp4',
            'Content-Disposition': 'attachment; filename=converted-video.mp4',
        });
        res.send(convertedBuffer);
    });
});

app.listen(3000, () => {
    console.log('Server berjalan pada port 3000');
});
