//DESCRIPTION: checks session and session id for login and authentication check on pages that needs one shoukd be user
//NOTE: will add for admin 

const db = require('../config/db'); 

module.exports = async (req, res, next) => {
  req.user = null; 

  //If there is no session and session id, exit
  if (!req.session || !req.session.userId) { 
    return res.status(401).json({ isLoggedIn: false, message: "Unauthorized. Please log in." });
  }
  try {
    //check if that session id exist or was saved
    const [rows] = await db.execute('SELECT * FROM user WHERE user_id = ?', [req.session.userId]); 
    if (rows.length === 0) {
      return res.status(401).json({ isLoggedIn: false, message: "Session invalid. User not found." });
    }
    // attach user records to user property
    req.user = rows[0];
    //fadmin guard
    if (req.baseUrl.includes('/api/admin') && req.session.role !== 'admin') {
        return res.status(403).json({ success: false, message: "Access Denied: Admins only." });
    }

    next();

  } catch (error) {
    console.error("Auth middleware error:", error);
    return res.status(500).json({ message: "Server error during authentication" });
  }
};