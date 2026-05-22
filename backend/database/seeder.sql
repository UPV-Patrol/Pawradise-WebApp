
USE `upv_pawtrol`;

-- CLEAN 
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE `sponsorship`;
TRUNCATE TABLE `favorite`;


DELETE FROM `user`; 
-- reset primary key auto-increment counters 
ALTER TABLE `user` AUTO_INCREMENT = 1; 
SET FOREIGN_KEY_CHECKS = 1;

-- mock data
 
INSERT INTO `user` (`email`, `role`, `username`, `password`, `status`) VALUES
('admin@upv.edu.ph', 'admin', 'pawtrol_admin', '$2b$10$1O7XCDun0k0Hx8LOUdI18OHiDXoKGxjXukQL/GXmw9ydi.jW9BeaK', 'active'),  -- pw: Strawberry123@ admin
('iskolar_juanito@upv.edu.ph', 'user', 'juanito_delacruz', '$2b$10$1EGkbx1bFN9LPqP1cm/64eBwbB65G43yZlaMgusKVaOfYSIYHP9w2', 'active'),  -- pw: Espresso1@
('mariamaria@gmail.com', 'user', 'maria_m', '$2b$10$18HpGDzp0/m0q2W1v4UQueRdPy3.XLkeq35gk6EBFy2q/1mOdxYfG', 'active'),  -- pw: Macchiato2@
('steven@yahoo.com', 'user', 'traralelo', '$2b$10$r7iX4HiFeVApesKWUddTD.SXET/ko2uPrP4G8I6Ys/BOPYIe81af.', 'banned'),  -- pw: Capuccino3@
('pedro_penduko@upv.edu.ph', 'user', 'pedro_p', '$2b$10$fx70mCTjQBQ2bn0nZYH5hexMETSVPR7uvpVfeKDYkE.x9gVIbBfgi', 'active'),  -- pw: Espresso1@
('clara_serena@upv.edu.ph', 'user', 'clara_s', '$2b$10$MCqJ8kNPoerNLXhNHpJ5IeeztrJ/wI00gNCwQ0uywhXW4Z2C/JmCK', 'active'),  -- pw: Macchiato2@
('miguel_tan@gmail.com', 'user', 'miggy_t', '$2b$10$MkoGxzez2sqHJCphkLsaoOItas602E0L5hsH.YdLRzfweAG4w6h52', 'active'),  -- pw: Capuccino3@
('althea_v@upv.edu.ph', 'user', 'althea_val', '$2b$10$gMAtPcFAU7.vHcwIU.sc1.QOMZyvUvKuyBKFhHWaMYB.1LHZC0sa.', 'active'),  -- pw: Espresso1@
('joshua_b@gmail.com', 'user', 'josh_b', '$2b$10$VD0eFeAJmS7QZO/hnnegceNx.qmi39UmeriTBlksPjzb5yL/AFNRK', 'active'),  -- pw: Macchiato2@
('chloe_d@upv.edu.ph', 'user', 'chloe_dev', '$2b$10$Sy97SH7HuJaynasZM9cv2.wuog.SHqswXWHo6rpSr9evngr2pH1w6', 'active'),  -- pw: Capuccino3@
('gab_santos@gmail.com', 'user', 'gab_s', '$2b$10$dBAdi24IKalaLTKVjWiU0ek2qKBERFRpLO5ZfPjrltCY4uO3F103m', 'active'),  -- pw: Espresso1@
('nikki_m@upv.edu.ph', 'user', 'nikki_min', '$2b$10$rBtbnn3sOcVukE8dd.3jGO0x3JCndSS113A7bqgqOhuDIhfzaebUq', 'active'),  -- pw: Macchiato2@
('rafael_c@gmail.com', 'user', 'raf_crux', '$2b$10$PLeKj/kgCe46jWilTe/mcegruq6ekcVCL3eVl979EOdnoJlKeo5MO', 'active'),  -- pw: Capuccino3@
('sofia_l@upv.edu.ph', 'user', 'sofi_luna', '$2b$10$uikdIVD.H1jYC3GuMtldUeiDJCmwBLTGSaCthI893JA9WjHkRMKaS', 'active'),  -- pw: Espresso1@
('christian_g@gmail.com', 'user', 'chan_g', '$2b$10$HvLZNXhyrkKjx1U6.iHY6.KSF.r2jmtNq8cZ83dyvoaeqotb1EW5O', 'active'),  -- pw: Macchiato2@
('troll_account@gmail.com', 'user', 'spammer99', '$2b$10$GDtVn7SJXUAyoh0z7bx2NuW9PuJRVIHWJavpte0b3bQctT5SKUS7O', 'banned');  -- pw: Capuccino3@


-- favorites
INSERT INTO `favorite` (`user_id`, `animal_id`) VALUES 
(2, 101), -- Juanito likes 101
(2, 102), 
(3, 101),
(5, 101),
(5, 103),
(6, 102), 
(7, 104), 
(8, 101), 
(8, 105), 
(9, 102), 
(10, 103),
(11, 104),
(12, 101),
(13, 105),
(14, 102);

-- sponsor
INSERT INTO `sponsorship` 
(`user_id`, `sponsor_type`, `entity_name`, `contact_number`, `fb_link_1`, `fb_link_2`, `target_pets`, `sponsorship_month`, `amount`, `proof_img`, `status`) 
VALUES 
(2, 'individual', NULL, '09171236767', 'fb.com/juan', NULL, 'Blackie & Browny', 'June 2026', 1500.00, 'receipt_def.jpg', 'verified'),
(3, 'group', 'UPV Scions', '091199886543', 'fb.com/maria', 'fb.com/upvscions', 'All Miagao Campus Cats', 'June 2026', 5000.00, 'receipt_def.jpg', 'pending'),
(2, 'business', 'Pawsome Cafe', '09225554444', 'fb.com/owner', 'fb.com/pawsomecafe', 'Chonky Cat', 'July 2026', 2500.00, 'receipt_def.jpg', 'denied'),
(5, 'individual', NULL, '09151112222', 'fb.com/pedro', NULL, 'Whitey', 'June 2026', 1000.00, 'receipt_def.jpg', 'verified'),
(6, 'group', 'UPV Haligi', '09163334444', 'fb.com/clara', 'fb.com/upvhaligi', 'SIT Dogs', 'June 2026', 3500.00, 'receipt_def.jpg', 'verified'),
(7, 'business', 'Miagao Inasal House', '09275556666', 'fb.com/miguel', 'fb.com/miagaoinasal', 'Ginger Cat', 'August 2026', 4000.00, 'receipt_def.jpg', 'pending'),
(8, 'individual', NULL, '09197778888', 'fb.com/althea', NULL, 'Spotty', 'July 2026', 8500.00, 'receipt_def.jpg', 'verified'),
(9, 'individual', NULL, '09209990000', 'fb.com/joshua', NULL, 'Lucky', 'June 2026', 800.00, 'receipt_def.jpg', 'verified'),
(10, 'group', 'UPV Skimmers', '09351234567', 'fb.com/chloe', 'fb.com/upvskimmers', 'All Dorm Area Pups', 'July 2026', 6000.00, 'receipt_def.jpg', 'pending'),
(11, 'business', 'Iloilo Tech Solutions', '09477654321', 'fb.com/gab', 'fb.com/iloilotech', 'Database Doggy', 'June 2026', 12000.00, 'receipt_def.jpg', 'verified'),
(12, 'individual', NULL, '09123456789', 'fb.com/nikki', NULL, 'Tiny Cat', 'June 2026', 1200.00, 'receipt_def.jpg', 'denied'),
(13, 'individual', NULL, '09987654321', 'fb.com/rafael', NULL, 'Browny', 'August 2026', 950.00, 'receipt_def.jpg', 'pending'),
(14, 'group', 'UPV Red Cross Youth', '09234567890', 'fb.com/sofia', 'fb.com/upvrcy', 'Infirmary Stray Animals', 'July 2026', 4500.00, 'receipt_def.jpg', 'verified'),
(15, 'business', 'Campus Bistro', '09776543210', 'fb.com/christian', 'fb.com/campusbistro', 'Fluffy Cat', 'June 2026', 3000.00, 'receipt_def.jpg', 'verified'),
(5, 'individual', NULL, '09151112222', 'fb.com/pedro', NULL, 'Blackie', 'July 2026', 1000.00, 'receipt_def.jpg', 'pending');

COMMIT; -- malapit n

