import express from "express";
import {
  getAllCities,
  createCity,
  updateCity,
  deleteCity,
} from "../controllers/CityControllers.js";

const router = express.Router();

router.get("/cities", getAllCities);
router.post("/cities", createCity);
router.put("/cities/:id", updateCity);
router.delete("/cities/:id", deleteCity);

export default router;
