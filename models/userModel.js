const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema ({
  first_name: { type: String, required: true, minLength: 2, maxLength: 100 },
  last_name: { type: String, required: true, minLength: 2, maxLength: 100 },
  username: { type: String, required: true, minLength: 2, maxLength: 100 },
  password: { type: String, required: true, minLength: 8, maxLength: 100 },
  member: { type: Boolean, default: false },
  isAdmin: { type: Boolean, default: false },
});

// Virtual for user's full name
UserSchema.virtual('fullname').get(function () {
  let fullname = '';
  if(this.first_name && this.last_name) {
    fullname = `${this.first_name} ${this.last_name}`;
  }
  return fullname;
});

// Virtual user URL
UserSchema.virtual('url').get(function () {
  return `/user/${this._id}`;
});

module.exports = mongoose.model('User', UserSchema);
