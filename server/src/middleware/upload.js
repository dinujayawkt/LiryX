const multer = require('multer')
const { CloudinaryStorage } = require('multer-storage-cloudinary')
const { configureCloudinary } = require('../config/cloudinary')

const cloudinary = configureCloudinary()

const audioStorage = new CloudinaryStorage({
  cloudinary,
  params: async (_req, _file) => ({
    folder: 'lyrics/music',
    resource_type: 'video', // allows large audio files
    format: 'mp3',
  }),
})

const imageStorage = new CloudinaryStorage({
  cloudinary,
  params: async (_req, _file) => ({
    folder: 'lyrics/images',
    resource_type: 'image',
    format: 'jpg',
  }),
})

const uploadAudio = multer({ storage: audioStorage })
const uploadImage = multer({ storage: imageStorage })

module.exports = { uploadAudio, uploadImage }
