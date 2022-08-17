"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLiveAverageFeeEstimate = void 0;
const web3_service_1 = require("../services/web3.service");
const getLiveAverageFeeEstimate = async (req, res) => {
    let option = req.query?.option || 0;
    await new web3_service_1.Web3Service().getLiveAverageFeeEstimate(res, parseInt(option.toString()));
    return res;
};
exports.getLiveAverageFeeEstimate = getLiveAverageFeeEstimate;
