"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = __importDefault(require("express"));
const controller_1 = require("../controllers/controller");
exports.router = express_1.default.Router();
//router.get("/get-fee-estimate", getAverageFeeEstimate);
exports.router.get("/get-fee-estimate", controller_1.getLiveAverageFeeEstimate);
