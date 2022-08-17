"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const router_1 = require("./src/router/router");
const cors_1 = __importDefault(require("cors"));
dotenv_1.default.config();
exports.app = (0, express_1.default)();
const port = process.env.PORT;
const allowedOrigins = ['*']; //* is included for development purposes only
const options = {
    origin: allowedOrigins
};
// Then pass these options to cors:
exports.app.use((0, cors_1.default)(options));
exports.app.use(express_1.default.json());
exports.app.use('/api', router_1.router);
exports.app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
});
