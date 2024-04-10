const mongoose = require('mongoose');
const {Schema} = mongoose;

const userSchema = new Schema({
    name: {type: String},
    username: {type: String, required: true, unique: true},
    email: { type: String, required: true},
    password: { type: String, required: true},
    image: {type: String},
    address: {type: String},
    selectedOption: {type: [Schema.Types.Mixed]},
    isVerified:{type:Boolean, default: false},
    token:{type:String, default: null}
})


exports.User = mongoose.model('User', userSchema);