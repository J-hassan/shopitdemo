export default (user, statusCode, res) => {
    const token = user.getJwtToken();
  
    const options = {
      expires: new Date(
        Date.now() + process.env.JWT_EXPIRES_TIME * 24 * 60 * 60 * 1000
      ),
      httpOnly: true,
      secure: true, // Set 'Secure' flag for production only
      sameSite: "None", // 'None' for production, 'Lax' for development
    };
  
    res.status(statusCode).cookie("token", token, options).json({
      success: true,
    });
  };
  