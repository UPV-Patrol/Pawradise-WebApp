//DESCRIPTION: handles administrative view logic for tracking user transactions and proof uploads


const db = require('../src/config/db');

// get all sponsor w deets of users
exports.getAllSponsorships = async (req, res) => {
    try {
        const filterYear = req.query.year || 2026;
        const [rows] = await db.query(
            `SELECT 
                s.sponsor_id,
                s.sponsor_type,
                s.entity_name,
                s.contact_number,
                s.fb_link_1,
                s.fb_link_2,
                s.target_pets,
                s.sponsorship_month,
                s.amount,
                s.proof_img,
                s.status,
                s.created_at,
                u.username AS registered_username,
                u.email AS registered_email
             FROM sponsorship s
             INNER JOIN user u ON s.user_id = u.user_id
             ORDER BY s.created_at DESC`,
            [filterYear] 
        );

        console.log("Admin query successful. Rows found:", rows.length);

        return res.status(200).json({ success: true, data: rows });

    } catch (err) {
        console.error("Admin controller error:", err);
        return res.status(500).json({ 
            success: false, 
            message: "Server error", 
            error: err.message 
        });
    }
};


//for stats of most sponsored for the month plus most sponsored pet
exports.getStats = async (req, res) => {
    try {
        const filterYear = req.query.year || 2026; // default

        // Query filtering by the YEAR of the created_at timestamp
        const [sponsorships] = await db.query(
            `SELECT target_pets, sponsorship_month 
             FROM sponsorship 
             WHERE status != 'denied' AND YEAR(created_at) = ?`, 
            [filterYear]
        );

        const petCounts = {};
        sponsorships.forEach(row => {
            if (!row.target_pets) return;
            const pets = row.target_pets.split(',').map(p => p.trim());
            pets.forEach(pet => {
                petCounts[pet] = (petCounts[pet] || 0) + 1;
            });
        });

        //top20 desc by count
        const top20PetStats = {};
        Object.entries(petCounts)
            .sort((a, b) => b[1] - a[1]) 
            .slice(0, 20)               
            .forEach(([petName, count]) => {
                top20PetStats[petName] = count; 
            });


        const monthCounts = {};
        sponsorships.forEach(row => {
            if (!row.sponsorship_month) return;
            const month = row.sponsorship_month.trim();
            monthCounts[month] = (monthCounts[month] || 0) + 1;
        });

        return res.status(200).json({
            success: true,
            petStats: top20PetStats, 
            monthStats: monthCounts 
        });

    } catch (err) {
        console.error("Stats error:", err);
        return res.status(500).json({ success: false, message: "Server error", error: err.message });
    }
};

// update stat
exports.updateStatus = async (req, res) => {
    const { id } = req.params;      //sponsor_id from URL
    const { status } = req.body;    // see if verified or not

    //only allow valid status
    const allowed = ['pending', 'verified', 'denied'];
    if (!allowed.includes(status)) {
        return res.status(400).json({ success: false, message: "Invalid status value" });
    }

    try {
        await db.query(
            'UPDATE sponsorship SET status = ? WHERE sponsor_id = ?',
            [status, id]
        );

        return res.status(200).json({ success: true, message: `Status updated to ${status}` });

    } catch (err) {
        console.error("Update status error:", err);
        return res.status(500).json({ success: false, message: "Server error", error: err.message });
    }
};