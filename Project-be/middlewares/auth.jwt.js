const jwt = require("jsonwebtoken");
const config = require("../auth.config.js");

verifyToken = (req, res, next) => {
    const token = req.header("Authorization");
    // console.log(token);

    if(!token){
        return res.status(403).send({message: "No token provided"});
    }

    jwt.verify(token, config.secret,
        (err, decoded)=>{
            if(err){
                return res.status(401).send({
                    message:"Unauthorized"
                });
            }
            // req.user = decoded;
            next();
        });
};

module.exports = verifyToken;