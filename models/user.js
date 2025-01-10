import mongoose from 'mongoose';
// const {Schema , model} = mongoose;
const UserSchema = new mongoose.Schema({
    name:{
        type: String
    },
    email:{
        type: String
    },
    phone:{
        type: String
    },
    gender:{
        type:String
    },
    password: {
        type:String
    }
},
{
timestamps: true,
});
const User = mongoose.models.User || mongoose.model('User', UserSchema);
export default User;