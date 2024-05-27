const  jwt  = require("jsonwebtoken");

module.exports  =  (req,res,next)=>{
    try {
        const token =  req.headers.authorization.split(" ")[1];
        const decodedToken =  jwt.verify(token,"RANDOM-TOKEN");
        req.user =  decodedToken;

    // pass down functionality to the endpoint
    next();
        }
        
    catch (error) {
        res.status(401).json({
            error:"Hello world"
        })
    }
  
  
}


