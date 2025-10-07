const { Schema, model } = require('mongoose')

const albumSchema = new Schema(
  {
    title: { type: String, required: true },
    artist: { type: String, required: true },
    coverUrl: { type: String },
    year: { type: Number },
  },
  { timestamps: true }
)

module.exports = model('Album', albumSchema)
