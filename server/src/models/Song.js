const { Schema, model, Types } = require('mongoose')

const songSchema = new Schema(
  {
    title: { type: String, required: true },
    artist: { type: String, required: true },
    album: { type: Types.ObjectId, ref: 'Album' },
    duration: { type: Number, default: 0 },
    audioUrl: { type: String, required: true },
    coverUrl: { type: String },
  },
  { timestamps: true }
)

module.exports = model('Song', songSchema)
