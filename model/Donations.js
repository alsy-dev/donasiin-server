import mongoose from "mongoose";
const { Schema } = mongoose;


const donationsSchema = new Schema({
    donatur: {
        nama: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        wasap: {
            type: String,
            required: true
        },
    },
    nama_barang: {
        type: String,
        required: true
    },
    deskripsi_barang: {
        type: String,
        required: true
    },
    foto_barang: [String],
    anonim: {
        type: Boolean,
        default: false
    },
    status: {
        type: String,
        enum: ['Menunggu Verifikasi', 'Dijemput Kurir', 'Disalurkan'],
        default: 'Menunggu Verifikasi'
    },
    error: {
        type: String,
        default: ''
    },
}, {timestamps: true});

export const model = mongoose.model('Donation', donationsSchema);
