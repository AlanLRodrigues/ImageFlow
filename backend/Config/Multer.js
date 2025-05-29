const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'Upload/'); 
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const fileFilter = (req, file, cb) => {
    const fileTypes = /\.(jpeg|jpg|png|gif|mp4|avi|mkv|mov)$/; 
    const mimeTypes = /^(image\/(jpeg|jpg|png|gif)|video\/(mp4|avi|x-matroska|quicktime))$/; 

    const extName = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimeType = mimeTypes.test(file.mimetype);

    if (extName && mimeType) {
        return cb(null, true);
    } else {
        return cb(new Error('Apenas imagens e vídeos são permitidos!'), false); 
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 150 * 1024 * 1024 }
})

module.exports = upload;