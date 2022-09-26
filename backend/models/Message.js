import mongoose from "mongoose";
const Scheme = mongoose.Schema;

const messageSchema = new Scheme({
  sender: {
    type: String,
    required: true
  },
  senderColor: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  time: {
    type: String,
    requried: true
  }
}, { timestamps: true });

const Message = mongoose.model('Message', messageSchema);

export default Message;

