import { model as Donation } from "../model/Donations.js";

const allowedImageTypes = ['image/png', 'image/jpeg'];

export const addNewDonation = async (req, res) => {
    // console.log(req.files);
    const donation = new Donation({
        donatur: {
            nama: req?.body?.nama_donatur,
            email: req?.body?.email_donatur,
            wasap: req?.body?.wasap_donatur
        },
        nama_barang: req?.body?.nama_barang,
        deskripsi_barang: req?.body?.deskripsi_barang,
        foto_barang: req?.files?.map((file) => file.filename),
        anonim: req?.body?.anonim,
    });

    console.log(donation);

    // all are required
    if(!donation.donatur.nama || !donation.donatur.email
        || !donation.donatur.wasap
        || !donation.nama_barang
        || !donation.deskripsi_barang
        || !donation.foto_barang
        || donation.anonim == undefined
    ) {
        return res.status(400).json({
            'message': 'Wajib mengisi form dengan lengkap'
        });
    }

    for(const file of req.files) {
        
        // Filesize can't exceed 5 MB
        if(file.size > 5000000) {
            return res.status(400).json({
                'message': 'Ukuran foto maksimal 5MB'
            });
        }

        // Invalid type of image
        if(allowedImageTypes.indexOf(file.mimetype) == -1) {
            return res.status(400).json({
                'message': 'Jenis foto tidak valid'
            });
        }
    }

    // return res.sendStatus(200);

    try {
        const result = donation.save();
        console.log(result);

        return res.status(201).json({
            'message': 'berhasil'
        });
    } catch(error) {
        console.log(error);
        return res.sendStatus(500);
    }
}

export const getAllDonations = async (req, res) => {
    try {
        const donations = await Donation.find();
        if(!donations) {
            return res.sendStatus(204);
        }
        res.json(donations);
    } catch (error) {
        console.error(error);
        return res.sendStatus(500);
    }
}

export const updateDonations = async (req, res) => {

    console.log(req.body);
    
    if(!req?.body?.id) {
        return res.status(400).json({
            'message': 'Parameter `id` diperlukan'
        });
    }

    const donation = await Donation.findOne({ _id: req.body.id }).exec();
    if (!donation) {
        return res.status(400).json({
            'message': `Tidak ada donasi dengan ID ${req.body.id}`
        });
    }

    if(req?.body?.nama_donatur) donation.donatur.nama = req?.body?.nama_donatur;
    if(req?.body?.email_donatur) donation.donatur.email = req?.body?.email_donatur;
    if(req?.body?.wasap_donatur) donation.donatur.wasap = req?.body?.wasap_donatur;
    if(req?.body?.nama_barang) donation.nama_barang = req?.body?.nama_barang;
    if(req?.body?.deskripsi_barang) donation.deskripsi_barang = req?.body?.deskripsi_barang;
    if(req?.body?.anonim) donation.anonim = req?.body?.anonim;
    if(req?.body?.status) donation.status = req?.body?.status;
    if(req?.body?.error) donation.error = req?.body?.error;

    try {
        const result = await donation.save();
        return res.status(200).json({
            'message': 'Data Berhasil diupdate'
        });

    } catch(error) {
        console.log(error);
        return res.sendStatus(500);
    }
}
