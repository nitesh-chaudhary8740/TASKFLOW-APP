require("dotenv").configDotenv();
const jwt = require("jsonwebtoken");
const refreshAccessToken = require("./refresh.auth.token.middleware");
const verifyJWT = async (req, res, next) => {
    try {
        const token = req.cookies.accessToken;
        if (!token) {
            return res.status(401).json({ msg: "Access Token not found", success: false });
        }
        const decodedToken = await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        req.user = decodedToken; 
 
        next(); // Proceed to the protected route handler
        
    } catch (error) {
       if (error instanceof jwt.TokenExpiredError) {
            console.log("Access Token Expired. Attempting refresh...");
            // Instead of returning 401, proceed to the refresh middleware
            return refreshAccessToken(req,res,next);
           
        }

        // For all other errors (invalid signature, wrong secret), unauthorized access is denied
        console.error("JWT Verification Failed (Invalid):", error.message);
        return res.status(401).json({ msg: "Invalid Access Token", success: false });
    
    }
};
module.exports=verifyJWT;