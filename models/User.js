import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import { Type } from '@google/genai'

const userSchema=new mongoose.Schema({
    username:{
        type:String,
        required:[true,'Please provide a username'],
        unique:true,
        trim:true,
        minlength:[3,'username must be atleast 3 characters long']
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        email:[true,'please provide a valid email']
    },
    password:{
        type:String,
        required:[true,'please provide a password'],
        minlength:[6,'password msut be atleast 6 character long'],
        select:false
    },
    profileImage:{
        type:String,
        default:null
    }
},{
    timestamps:true
});


//hash password before saving
userSchema.pre('save',async function(){
    if(!this.isModified('password')){
        return;
    }

    const salt=await bcrypt.genSalt(10);
    this.password=await bcrypt.hash(this.password,salt);
})

//compare password method
userSchema.methods.matchPassword=async function(enteredPassword){
    return await bcrypt.compare(enteredPassword,this.password)
}

const UserModel=mongoose.model('User',userSchema);

export default UserModel;