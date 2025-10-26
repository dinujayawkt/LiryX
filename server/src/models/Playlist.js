const { Schema, model, Types } = require('mongoose')

const playlistSchema = new Schema(
  {
    user: { type: Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    description: { type: String, default: '' },
    coverUrl: { type: String, default: '' },
    tracks: [{ type: Types.ObjectId, ref: 'Song' }],
  },
  { timestamps: true }
)

playlistSchema.index({ user: 1, title: 1 })

module.exports = model('Playlist', playlistSchema)
