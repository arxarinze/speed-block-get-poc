import { Request, Response } from "express";
import { Web3Service } from "../services/web3.service";
export const getLiveAverageFeeEstimate = async (req: Request, res: Response) => {
    let option = Boolean(req.query?.option!) || false
  await new Web3Service().getLiveAverageFeeEstimate(res, option)
  return res
};
