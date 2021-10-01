import multer from 'multer';

const currentTime = new Date().toJSON().slice(0, 10);

const storage = multer.diskStorage({
    destination: function (_req, _file, cb) {
        cb(null, `./${process.env.UPLOAD_PATH}`);
    },
    filename: function (_req, file, cb) {
        cb(null, `${currentTime}--${file.originalname}`);
    }
});

const upload = multer({ storage: storage });
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const startUpload = (formName: string) => upload.single(formName);
export default startUpload;
