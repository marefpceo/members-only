const { DateTime } = require('luxon');

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MessageSchema = new Schema ({
  author: { type: Schema.Types.ObjectId, ref: 'User' },
  message_title: { type: String, required: true, minLength: 2, maxLength: 100 },
  text: { type: String, required: true, minLength: 2, maxLength: 250 },
  timestamp: { type: Date, default: Date.now },
});

// Virtual message URL
MessageSchema.virtual('url').get(function () {
  return `/message/${this._id}`;
});

// Virtual for date conversion
MessageSchema.virtual('timestamp_formatted').get(function () {
  return this.timestamp.toLocaleString(DateTime.DATETIME_FULL);
});

module.exports = mongoose.model('Message', MessageSchema);
