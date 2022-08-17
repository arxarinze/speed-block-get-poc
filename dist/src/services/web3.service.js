"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Web3Service = void 0;
const web3_1 = __importDefault(require("web3"));
class Web3Service {
    constructor() {
        this.calculateAverageGasFee = (tx) => {
            try {
                return (tx[0].reduce((previous, current) => {
                    return previous + Number(current.gasPrice) * current.gas;
                }, 0) /
                    tx.length /
                    1000000000000000000.0);
            }
            catch (error) {
                throw error;
            }
        };
        this.getAllTransactionsInBlock = async (blockData) => {
            const batch = new this.client.BatchRequest();
            let _this = this;
            const total = blockData.length;
            let counter = 0;
            let blocks = [];
            await new Promise(function (resolve, reject) {
                blockData.forEach((da) => {
                    batch.add(_this.client.eth.getBlock.request(da, true, (error, data) => {
                        if (error)
                            return reject(error);
                        counter++;
                        blocks.push(data.transactions.flat().filter(data => {
                            return data.input == "0x";
                        }));
                        if (counter === total)
                            resolve();
                    }));
                });
                batch.execute();
            });
            return blocks;
        };
        this.clearAllSubscriptions = () => {
            this.wsClient.eth.clearSubscriptions();
        };
        this.getLastNthBlocks = async (blockNumber, n) => {
            try {
                let blockData = [];
                for (let index = 0; index <= n; index++) {
                    blockData.push(...(await this.client.eth.getBlock(blockNumber - index, true)).transactions.flat());
                }
                return blockData;
            }
            catch (err) {
                throw err;
            }
        };
        this.getBlocksAsArray = (num, option) => {
            let blocks = [];
            for (let index = 0; index <= option; index++) {
                blocks.push(num + index);
            }
            return blocks;
        };
        this.getLiveAverageFeeEstimate = async (res, option) => {
            let block = {};
            try {
                block = await new Promise((resolve, reject) => {
                    this.wsClient.eth.subscribe("newBlockHeaders", {}, (err, head) => {
                        const { number, gasLimit, gasUsed } = head;
                        resolve({
                            number,
                            gasLimit,
                            gasUsed,
                        });
                    });
                });
                this.clearAllSubscriptions();
                console.log(`Accumulating ${option} Blocks`);
                let blockData = this.getBlocksAsArray(block.number, option);
                console.log(blockData);
                //let blockData = await this.getLastNthBlocks(block.number, option);
                let transactions = await this.getAllTransactionsInBlock(blockData);
                return res.status(200).json({
                    averageTransactionFee: this.calculateAverageGasFee(transactions),
                    blockFullness: Math.abs(((block.gasLimit - block.gasUsed) / block.gasLimit) * 100 - 100) + "%",
                });
            }
            catch (error) {
                return res.status(500).json({
                    error,
                });
            }
        };
        try {
            this.wsClient = new web3_1.default(process.env.INFURA_WS_TEST_NODE);
            this.client = new web3_1.default(process.env.INFURA_TEST_NODE);
        }
        catch (error) {
            throw error;
        }
    }
}
exports.Web3Service = Web3Service;
