const express = require("express");
const adminController = require("../controllers/adminController")
const adminRouter = express.Router();
const upload = require("../config/multer");
const auth = require("../config/auth");

adminRouter.get("/", auth.isManagerOrAdmin, (req, res) => res.redirect("/admin/vouchers"));
adminRouter.get("/vouchers", auth.isManagerOrAdmin, adminController.vouchers);
adminRouter.put("/vouchers/set", auth.isManagerOrAdmin, adminController.setStatus);

adminRouter.get("/users", auth.isAdmin, adminController.users);
adminRouter.post("/users",  auth.isAdmin, express.urlencoded({ extended: true }), adminController.ban);

adminRouter.get("/addTour", auth.isAdmin, adminController.showTourForm);
adminRouter.post("/addTour", auth.isAdmin, upload.single("tour_image"), adminController.addTour);

adminRouter.get("/addHotel", auth.isAdmin, adminController.showHotelForm);
adminRouter.post("/addHotel", auth.isAdmin, upload.single("hotel_image"), adminController.addHotel);

adminRouter.get("/init", adminController.init);
 
module.exports = adminRouter;