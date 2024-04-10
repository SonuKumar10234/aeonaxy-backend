require('dotenv').config();
const { User } = require("../model/User");
const uploadOnCloudinary = require('../utils/cloudinary');
const {Resend} = require('resend');
const crypto=require('crypto');
const resend = new Resend(process.env.RESEND_API_KEY);

exports.createUser = async (req, resp) => {
    try {
            const {name,username,email,password}=req.body;
            const otherInfo={name:name,username:username,email:email,password:password,image:'Not Available',address:'Not Available',selectedOption:[]}
            const user = new User(otherInfo);

            const doc = await user.save();
        
            resp.json({ message: "Signup successfull", createdUser: doc, status: 201 });

    } catch (err) {
        resp.status(400).json(err);
    }

}


// Create an API to check whether username entered by the user already exist in the database or not if yes, 
// send response Username already exist.

exports.checkUsername = async (req, resp) => {
    try {
        const { username} = req.body;
        const checkUser = await User.findOne({ username: username });
        if (checkUser) {
            resp.json({ message: " Username has already been taken", status: 500 });
        }
        else {
            resp.json({ message: "Username available",status:202});
        }

    } catch (err) {
        resp.status(400).json(err);
    }
}

exports.createProfile = async (req, res) => {
  
    try {
        if (!req.file) {
          const saveAddress=await User.updateOne({username:req.body.username},{$set:{address:req.body.address}});
          return res.json({ message: 'No file uploaded' , status: 400});
        }
    
        // Upload image directly to Cloudinary
        const result = await uploadOnCloudinary(req.file.path);

        const userProfile=await User.updateOne({ username:req.body.username}, {$set:{image:result.secure_url, address:req.body.address} });
        const user = await User.findOne({username: req.body.username});
        res.json({ message:'Image uploaded successfully', status:200, user: user });
        
      } catch (error) {
        console.error('Error uploading image:', error);
        res.status(500).json({ error: 'Failed to upload image' });
      }
}


exports.optionSelected = async (req, resp) => {
    const { username, selectedOption } = req.body; // save the selected option 

    try {
        const addSelected=await User.updateOne({username:username},{$set:{selectedOption:selectedOption}});
        resp.json({message:'Success',status:200});

    } catch (error) {
        resp.json({message:"Something went wrong",status:500});
    }
}


// Function to generate a random unique token
const generateUniqueToken = () => {
    try {
      const buffer = crypto.randomBytes(20);
      return buffer.toString('hex');
    } catch (error) {
      console.error('Error generating token:', error);
      return null;
    }
  };

// send thankyou message along with the confirmation email to verify the email.
exports.sendEmail = async (req, resp) => {
    const { username, email } = req.body;
    const token=generateUniqueToken();
    if(!token){
        resp.json({message:"Couldn't generate token try later",status:500});
    }else{
        const saveToken=await User.updateOne({username:username},{$set:{token:token}});
        const { data, error } = await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: `kmonu1666@gmail.com`,
            subject: `Hello ${username}`,
            html: `<p><strong>Thankyou !<b>Please verify your account by clicking the below link:</strong><br>http://localhost:3000/verify?username=${username}&token=${token}</p>`
          });
          

        if (error) {
            return resp.status(400).json({ error });
        }
    
        resp.json({ meassage: data, status: 200 });
    }
}


exports.verifyAccount = async(req,resp)=>{
    const { username, token } = req.body;
    console.log(req.body)
    const findUser = await User.findOne({username:username});
    if(token == findUser?.token){
        const updateStatus=await User.updateOne({username:username},{$set:{isVerified:true}});
        resp.json({message:'Account Verified',status:200});
    }else{
        resp.json({message:"Bad request",status:500});
    }
}
