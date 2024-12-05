import mongoose,{Schema} from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt"


const userSchema =new Schema({

    username:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trime:true,
        index : true
    },

    fullname:{
        type:String,
        required:true,
        lowercase:true,
        trime:true,
        index : true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trime:true,
      
    },
    Password:{
        type:String,
        required:[,true,"password is required"],
    },

    refreshToken: {
        type: String,
      },

    

}
,{
    timestamps:true
})

userSchema.pre("save",async function(next){
    if(!this.isModified("Password")) return next();
    this.Password = bcrypt.hash(this.Password,10);
    next();
})

// userSchema.methods.isPasswordMatched = async function (enteredPassword) {
//     return await bcrypt.compare(enteredPassword, this.Password);
//   };

userSchema.methods.isPasswordMatched =async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.Password);
}

userSchema.methods.generateaccessToken = function () {
  return  jwt.sign({
        _id : this._id ,
        email : this.email,
        fullname : this.fullname,
        username : this.username   
    }
    ,
    process.env.ACCESS_TOKEN_SECRET,
    {expiry : process.env.ACCESS_TOKEN_EXPIRY  }
    )
}
userSchema.methods.generaterefreshToken = function () {
  return  jwt.sign({
        _id : this._id ,
        email : this.email,
        fullname : this.fullname,
        username : this.username   
    }
    ,
    process.env.REFRESH_TOKEN_SECRET,
    {expiry : process.env.REFRESH_TOKEN_EXPIRY   }
    )
}


export const user = mongoose.model('user',userSchema)