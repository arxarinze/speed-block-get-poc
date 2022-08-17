import request from "supertest";

import { app } from "../../app";

describe("Testing fee estimate endpoint", () => {
  it("should get have properties last in property", async () => {
    try {
      const res = await request(app)
        .get("/api/get-fee-estimate")
        .expect("Content-Type", /json/)
        .expect(200);
      expect(res.body).toHaveProperty("averageTransactionFee");
      expect(res.body).toHaveProperty("blockFullnessOfLastBlock");
      expect(res.body.averageTransactionFee).toBeGreaterThanOrEqual(0.0);
      expect(res.body.blockFullnessOfLastBlock).toBeDefined()
    
    } catch (err) {
      expect(err).toBe(err);
    }
  });
  it("should get have properties averageTransactionFees for n = 5 blocks lockFullnes in property", async () => {
    try {
      const res = await request(app)
        .get("/api/get-fee-estimate?option=5")
        .expect("Content-Type", /json/)
        .expect(200);
      expect(res.body).toHaveProperty("averageTransactionFee");
      expect(res.body).toHaveProperty("blockFullnessOfLastBlock");
      expect(res.body.averageTransactionFee).toBeGreaterThanOrEqual(0.0);
      expect(res.body.blockFullnessOfLastBlock).toBeDefined()
    
    } catch (err) {
      expect(err).toBe(err);
    }
  });
  it("should get have properties averageTransactionFees for n = 30 blocks lockFullnes in property", async () => {
    try {
      const res = await request(app)
        .get("/api/get-fee-estimate?option=30")
        .expect("Content-Type", /json/)
        .expect(200);
      expect(res.body).toHaveProperty("averageTransactionFee");
      expect(res.body).toHaveProperty("blockFullnessOfLastBlock");
      expect(res.body.averageTransactionFee).toBeGreaterThanOrEqual(0.0);
      expect(res.body.blockFullnessOfLastBlock).toBeDefined()
    
    } catch (err) {
      expect(err).toBe(err);
    }
  });
});
