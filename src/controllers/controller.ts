import { Request, Response } from "express";
import { Web3Service } from "../services/web3.service";
export const getLiveAverageFeeEstimate = async (
  req: Request,
  res: Response
) => {
  let option = req.query?.option || 0;
  await new Web3Service().getLiveAverageFeeEstimate(res, parseInt(option.toString()));
  return res;
};
