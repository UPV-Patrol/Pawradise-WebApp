//DESCRIPTION: handles all logic in sponsorship

//IMPORTS
const db = require('../src/config/db'); //connect db
//import third-party mod
const bcrypt = require('bcrypt'); //for hashing pw
const validator = require('validator');

const num_of_hashing = 10; 

exports.createSponsorship = async (req, res) => {
    try {
        // console.log("create sponsors is working aaaaaaa"); //test

        const { sponsorType, targetPet, sponsorshipMonth, amount } = req.body;
        //requre the proof of payment
        if (!req.file) {
            return res.status(400).json({ message: "Proof of payment is required." });
        }
        const proof_img = req.file.filename;

        //handle the case where list of animals are chosen since sql cannot handle arrays thus the need for flattening
        const collectedPets = Array.isArray(targetPet) ? targetPet.join(', ') : targetPet || "";

        //obj dictionary for mapping
        const sponsorFieldMap = {
            individual: {
                entityName: null,
                contactNumber: req.body.ind_contactNumber || '',
                fbLink1: req.body.ind_fbLink || null,
                fbLink2: null
            },
            group: {
                entityName: req.body.grp_entityName || null,
                contactNumber: req.body.grp_contactNumber || '',
                fbLink1: req.body.grp_fbLink1 || null,
                fbLink2: req.body.grp_fbLink2 || null
            },
            business: {
                entityName: req.body.biz_entityName || null,
                contactNumber: req.body.biz_contactNumber || '',
                fbLink1: req.body.biz_fbLink1 || null,
                fbLink2: req.body.biz_fbLink2 || null
            }
        };

        //map using dict depending on sponsor type 
        // note: made it more strict using def indiv as fallback
        const matchedLayout = sponsorFieldMap[sponsorType] || sponsorFieldMap.individual;
        const {entityName, contactNumber, fbLink1, fbLink2} = matchedLayout;

        
        const sql = `
            INSERT INTO sponsorship (
                user_id, sponsor_type, entity_name,
                contact_number, fb_link_1, fb_link_2,
                target_pets, sponsorship_month, amount, proof_img
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

        await db.query(sql, [
            req.session.userId,
            sponsorType,
            entityName,
            contactNumber,
            fbLink1,
            fbLink2,
            collectedPets,
            sponsorshipMonth,
            amount,
            proof_img
        ]);

        res.status(201).send("Sponsorship submitted successfully!");

    } catch (error) {
        console.error("Database Error:", error);
        res.status(500).send("Server Error");
    }
};

// to get approved sponsorships to display at homepage
exports.getApprovedSponsors = async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT u.username
            FROM sponsorship s
            JOIN user u ON s.user_id = u.user_id
            WHERE s.status = 'verified'
            ORDER BY s.created_at DESC
        `);
        return res.status(200).json(rows);

    } catch (err) {
        console.error(err);

        return res.status(500).json({ message: 'Failed to fetch sponsors' });
    }
};