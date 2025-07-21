import multer from "multer";

const storage = multer.memoryStorage(); // or use diskStorage if saving locally
const upload = multer({ storage });

export default upload;
