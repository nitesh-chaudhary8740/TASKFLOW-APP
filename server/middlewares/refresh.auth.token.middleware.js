const { generateAdminTokens } = require("../controllers/admin.controller");
const { Admin } = require("../models/admin.model");

require("dotenv").configDotenv();
const jwt = require("jsonwebtoken");
const refreshAccessToken = async (req, res, next) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
        return res.status(401).json({ msg: "Refresh Token missing. Please log in again.", success: false });
    }

    try {
        const decodedRefresh = await jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        if(decodedRefresh.role==="admin"){
            const admin = await Admin.findById(decodedRefresh._id)
            if (!admin || admin.refreshToken !== refreshToken) {   
                return res.status(401).json({ msg: "Refresh Token revoked or invalid. Please log in.", success: false });
                // Token is either revoked (cleared in DB) or invalid
            }
            const { accessToken: newAccessToken, refreshToken: newRefreshToken } = await generateAdminTokens(admin._id);
            const options = { httpOnly: true, secure: true, sameSite: 'None' }; // Match your setup
        
            res.cookie("accessToken", newAccessToken, options)
            .cookie("refreshToken", newRefreshToken, options);
            req.user = admin; 
            console.log("refresh token generated")
        }
        
        next(); 

    } catch (error) {
        // This catches errors like 'jwt expired' on the REFRESH TOKEN
        console.error("Refresh Token Failed:", error.message);
        return res.status(401).json({ msg: "Refresh Token expired. Please log in again.", success: false,tokenRevoked:true });
    }
};
module.exports=refreshAccessToken