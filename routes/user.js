const express = require("express")
const bcrypt = require("bcrypt")
const salt =10;
const router = express.Router();
const jwt =require("jsonwebtoken")
const SECRET_CODE="QWERTYUIOPASDFGHJKLZXCVBNM"
const {user} = require("../schemas/user-schema")
router.post("/signup",async(req,res)=>{//creating login details
    bcrypt.genSalt(salt,(saltErr,saltValue)=>{
        if(saltErr){
            res.status(401).send("unable to process ")
        }else{
            bcrypt.hash(req.body.password,saltValue,(hashErr,hashValue)=>{
                if(hashErr){
                    res.status(401).send("unable to hash")
                }else{
                    user.create({username:req.body.username,password:hashValue,email:req.body.email |"",mobile:req.body.mobile |""}).then((user)=>{
                        res.status(200).send(user.username +" " + "is created");

                    }).catch((err)=>{
                        res.status(400).send(err.message)
                    })
                }
            })
        }
    })

    
})


router.post("/login",async(req,res)=>{// reading in db 
    //authentication part
    user.findOne({username: req.body.username}).then((user)=>{
        if(!user){
            res.status(401).send("user not found")
        }else{
            if(!bcrypt.compareSync(req.body.password,user.password)){
                res.status(401).send("incorrect password")
            }else{
                const token = jwt.sign({id:user._id,username:user.username},SECRET_CODE);
                res.status(200).send({message:"user loggingin success",token:token});
            }
        }
    }).catch(()=>{

    }).finally(()=>{

    })

})
module.exports=router;