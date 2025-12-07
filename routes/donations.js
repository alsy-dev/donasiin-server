import express from 'express';
export const router = express.Router();
import multer from 'multer';
import { verifyJWT } from '../middleware/verifyJWT.js';

// Path
import { fileURLToPath } from 'url';
import path from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// UUID
import { v4 as uuidV4 } from 'uuid';

import * as donationsController from '../controller/donationsController.js';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '..', 'uploads'));
    },
    filename: (req, file, cb) => {
        // console.log(req);
        // console.log(req.files);
        const extension = file.mimetype.split('/')[1];
        cb(null, uuidV4() + '.' + extension);
    }
});

// For handling multipart/form-data
const uploads = multer({ storage: storage, });

router.route('/')
    .post(uploads.array('foto_barang'), donationsController.addNewDonation)
    .put(verifyJWT, uploads.none(), donationsController.updateDonations)
    .get(verifyJWT, donationsController.getAllDonations);
