import mongoose from 'mongoose';

// const {Schema, model} = mongoose;

const  AdminSchema = new mongoose.Schema({
    fullname:{
        type: String
    },
    phone:{
        type: String
    },
    email:{
        type: String
    },
    password:{
        type:String
    }
},{timestamps:true});
const Admin = mongoose.models.Admin ||mongoose. model('Admin', AdminSchema);

export default Admin;