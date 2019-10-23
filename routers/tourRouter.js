const express = require("express");
const tourController = require("../controllers/tourController");
const tourRouter = express.Router();
const upload = require("../config/multer");
const auth = require("../config/auth");

tourRouter.get("/", tourController.index);
tourRouter.post("/", express.urlencoded({ extended: true }), tourController.filter);
tourRouter.get("/:id", tourController.card);
tourRouter.put("/:id", auth.isManagerOrAdmin, upload.none(), tourController.edit);
tourRouter.delete("/:id", auth.isManagerOrAdmin, tourController.delete);
tourRouter.post("/:id", auth.isAuth, tourController.order);

module.exports = tourRouter;