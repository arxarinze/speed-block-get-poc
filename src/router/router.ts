import express, { Router } from "express";
import {getLiveAverageFeeEstimate } from "../controllers/controller";

export const router: Router = express.Router();

//router.get("/get-fee-estimate", getAverageFeeEstimate);
router.get("/get-fee-estimate", getLiveAverageFeeEstimate)

