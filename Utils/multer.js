import multer from "multer";

const storage = multer.memoryStorage();

const profilephotoUpload = multer({storage}).single('profilephoto');

const LogoUpload = multer({storage}).single('logo');

export {profilephotoUpload, LogoUpload};