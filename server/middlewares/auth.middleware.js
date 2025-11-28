const verifyJWT = async (req, res, next) => {
    try {
        const token = req.cookies.accessToken;

        if (!token) {
            return res.status(401).json({ msg: "Access Token not found", success: false });
        }
        const decodedToken = await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        req.adminId = decodedToken._id; 
        
        next(); // Proceed to the protected route handler
        
    } catch (error) {
        console.error("JWT Verification Failed:", error.message);
        return res.status(401).json({ msg: "Invalid or expired Access Token", success: false });
    }
};
module.exports=verifyJWT;