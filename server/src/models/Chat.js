import mongoose from 'mongoose';

const chatSchema = new mongoose.Schema(
  {
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
    ],
    listingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Listing',
      required: true,
    },
    interestId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'InterestRequest',
      required: true,
    },
  },
  { timestamps: true }
);

// Each interest request maps to exactly one chat
chatSchema.index({ interestId: 1 }, { unique: true });

const Chat = mongoose.model('Chat', chatSchema);
export default Chat;
