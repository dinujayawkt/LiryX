const { Schema, model, Types } = require('mongoose')

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    // Optional external auth provider id (e.g., Clerk). Make unique but allow multiple nulls.
    clerkId: { type: String, unique: true, sparse: true, default: null },
    favorites: [{ type: Types.ObjectId, ref: 'Song' }],
  },
  { timestamps: true }
)

// Ensure the index is created with the correct options
userSchema.index({ clerkId: 1 }, { unique: true, sparse: true })

module.exports = model('User', userSchema)
