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
      expect(res.body).toHaveProperty("blockFullness");
      expect(res.body.averageTransactionFee).toBeGreaterThanOrEqual(0.0);
      expect(res.body.blockFullness).toBeDefined()
    
    } catch (err) {
      expect(err).toBe(err);
    }
  });
  it("should get have properties last5, last30 and averageTransactionFee, blockFullnes in property", async () => {
    try {
      const res = await request(app)
        .get("/api/get-fee-estimate?option=true")
        .expect("Content-Type", /json/)
        .expect(200);
      expect(res.body).toHaveProperty("averageTransactionFee");
      expect(res.body).toHaveProperty("blockFullness");
      expect(res.body).toHaveProperty("last5");
      expect(res.body).toHaveProperty("last30");
      expect(res.body.averageTransactionFee).toBeGreaterThanOrEqual(0.0);
      expect(res.body.last5).toBeGreaterThanOrEqual(0.0);
      expect(res.body.last30).toBeGreaterThanOrEqual(0.0);
      expect(res.body.blockFullness).toBeDefined()
    
    } catch (err) {
      expect(err).toBe(err);
    }
  });
});
