//THis gives us the user overview and how the new user can be created.
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  FirstName: {
    type: String,
    required: [true, 'Please tell us your name!']
  },

  LastName: {
    type: String,
    required: [true, 'Please tell us your name!']
  },

  email: {
    type: String,
    required: [true, 'Please provide your email'],
    unique: true,
    lowercase: true
  },

  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 8,
    select: false
  },
  // validate password
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password'],
    // validate will only work on save or creating the user
    validate:{
        validator: function(pwd){
          return pwd === this.password;
        },
        message: " the password confirmation did not match"
    }
  },
  passwordChangedAt: Date,
  passwordResetExpires: Date,
  active: {
    type: Boolean,
    default: true,
    select: false
  }
});

// add encrypting the password middleware
userSchema.pre('save', async function(next){
  if(!this.isModified('password')){
    return next;
  }
  // if new and modified
  // npm install bcryptjs
  this.password = await bcrypt.hash(this.password, 12); // how intensive the CPU will be
  this.passwordConfirm = undefined; // we dop not want to store in database
  next();
});

userSchema.methods.correctPassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
