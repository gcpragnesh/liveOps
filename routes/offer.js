const express =require("express");
const req=require("express/lib/request")
const router =express.Router();
const jwt=require("jsonwebtoken")
const SECRET_CODE="QWERTYUIOPASDFGHJKLZXCVBNM";
const {offer} = require("../schemas/offer-schema")

const getUserToken=(token)=>{
    return new Promise((resolve,reject)=>{
        if(token){
            let userData
            try{
                userData=jwt.verify(token,SECRET_CODE)
                resolve(userData)

            }catch(err){
                reject("invalid token")

            }
        }else{
            reject("token not created")
        }
    })
}

router.post("/list",async(req,res)=>{
    const validOffers=[];
    offer.find().then((offers)=>{
        offers.filter((offer)=>{//filter age >30 &installed <5days
            const rules =offer.target.split("and")
            //console.log(rules);
            rules.forEach((rule)=>{
                let keyPoint={}
                if(rule.includes(">")){
                   keyPoint= {key:rule.trim().split(">")[0].trim(),value:parseInt(rule.trim().split(">")[1])}
                   if(req.body[keyPoint.key]>keyPoint.value){
                    validOffers.push(offer);
                   }
                   console.log()
                }else{
                   keyPoint= {key:rule.trim().split("<")[0],value:(rule.trim().split("<")[1])}
                   if(req.body[keyPoint.key]<keyPoint.value){
                    validOffers.push(offer);
                   }
                   console.log(validOffers)

                }
               
            })


        })
        res.status(200).send(validOffers)

    }).catch(()=>{
        res.status(500).send("internal server error")

    })


})

router.post("/create",async(req,res)=>{
    getUserToken(req.headers.authorization).then((user)=>{
      //  res.status(200).send(user)
      offer.create({...req.body,username:user.username}).then((offer)=>{
        res.status(200).send(offer)

      }).catch((err)=>{
        res.status(400).send({message:err.message})
      })

    }).catch((err)=>{
        res.status(400).send(err)
    })

})
router.put("/api/:offerId",async(req,res)=>{
    const offerId=req.params.offerId;
    const updatedOffer=req.body;

    if(!isValidOfferId(offerId)||!isValidOffer(updatedOffer)){
        res.status(400).send({error:"invalid offer data"})
        return;
    }
})

router.delete("/delete",async(req,res)=>{
    offer.deleteOne({_id:req.body.id})

})
module.exports=router;