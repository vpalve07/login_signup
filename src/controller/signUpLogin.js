const userModel = require("../model/userRegModel")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const {isValidEmail,passwordVal} = require("../validations/validations");

const create_user = async function(req,res){
    try {

        // ====== Getting data from request body ====== //

        let data = req.body

        // ====== Handling Validations for Input value ====== //

        if(!data.first_name) return res.status(400).send({ status: false, message: "first name is mandatory" })
        if(!data.last_name) return res.status(400).send({ status: false, message: "last name is mandatory" })
        if(!data.email) return res.status(400).send({ status: false, message: "email is mandatory" })
        if(!data.password) return res.status(400).send({ status: false, message: "password is mandatory" })
    
        // ====== Checking for correct pattern/format of email & password====== //

        if (!isValidEmail(data.email)) return res.status(400).send({ status: false, message: "email is Invalid" });
        if (!passwordVal(data.password)) return res.status(400).send({ status: false, message: "Password must be at least 1 lowercase, at least 1 uppercase,contain at least 1 numeric character , at least one special character, range between 8-15"});

        // ====== Checking if Email id is unique or not ====== //

        let findEmail = await userModel.findOne({email:data.email})
        if(findEmail) return res.status(403).send({status:false,message:"Email Id is already exist"})
    
        // ====== Using bcrypt librabry for hashing the password ====== //

        const saltRounds = data.password.length
        let hash = await bcrypt.hash(data.password, saltRounds)
        data.password = hash
    
        // ====== Creating user document in database ====== //

        let create_data = await userModel.create(data)
        return res.status(200).send({status:true,message:"User created Successfully"})
    } catch (error) {
        return res.status(500).send({status:false,message:error.message})
    }
}

const login = async function(req,res){
    try {

        // ====== Getting data from request body ====== //

        let data = req.body
        let { email, password } = data

        // ====== Handling Validations for Input value ====== //

        if (!email) return res.status(400).send({ status: false, message: "email id is required for login" })
        if (!password) return res.status(400).send({ status: false, message: "password is required for login" })
    
        // ====== Checking for correct pattern/format of email & password====== //

        if (!isValidEmail(data.email)) return res.status(400).send({ status: false, message: "email format is Invalid" });
        if (!passwordVal(data.password)) return res.status(400).send({ status: false, message: "Password must be at least 1 lowercase, at least 1 uppercase,contain at least 1 numeric character , at least one special character, range between 8-15"});
    
        // ====== Checking if we have any user with Email id ====== //

        let userData = await userModel.findOne({email:email})
        if(!userData) return res.status(404).send({status:false,message:"no user found with this Email id"})
    
        // ====== Using bcrypt librabry for comparing with stored password ====== //

        bcrypt.compare(password, userData.password, (err, pass) => {
            if (err) throw err
            if (pass) {

                // ====== Generating JWT token for authorization ====== //

                let token = jwt.sign({ emailId: userData.email },process.env.secret_key)
                return res.status(200).send({ status: true, message: "User Logged in successfully",token:token})
            }else{
                return res.status(400).send({ status: false, message: "Password is wrong" })
              }
        })
    } catch (error) {
        return res.status(500).send({status:false,message:error.message})
    }
}

module.exports = {create_user,login}