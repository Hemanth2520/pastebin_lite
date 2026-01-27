import mongoose from 'mongoose';

const pasteSchema = new mongoose.Schema({
  pasteId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  content: {
    type: String,
    required: true
  },
  maxViews: {
    type: Number,
    default: null,
    min: 1
  },
  viewCount: {
    type: Number,
    default: 0,
    min: 0
  },
  expiresAt: {
    type: Date,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// TTL index for automatic deletion of expired pastes
pasteSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const Paste = mongoose.model('Paste', pasteSchema);

export default Paste;
