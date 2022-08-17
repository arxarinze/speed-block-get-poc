import { Response } from "express";
import Web3 from "web3";

export class Web3Service {
  wsClient: Web3;
  client: Web3;
  constructor() {
    try {
      this.wsClient = new Web3(process.env.INFURA_WS_TEST_NODE!);
      this.client = new Web3(process.env.INFURA_TEST_NODE!);
    } catch (error) {
      throw error;
    }
  }

  private calculateAverageGasFee = (tx: any[]) => {
    try {
      return (
        tx.reduce((previous: any, current: any) => {
          return previous + Number(current.gasPrice) * current.gas;
        }, 0) /
        tx.length /
        1000000000000000000.0
      );
    } catch (error) {
      throw error;
    }
  };
  private getAllTransactionsInBlock = async (blockData: any[]) => { //batch requests to save network calls and further optimize
    try {
      const batch = new this.client.BatchRequest();
    let _this = this;
    const total = blockData.length;
    let counter = 0;
    let blocks: any[] = [];
    await new Promise<void>(function (resolve, reject) {
      blockData.forEach((da) => {
        batch.add(
          (_this.client.eth.getBlock as any).request(da, true,(error:any, data:any) => {
            if (error) return reject(error);
            counter++;
            blocks.push(...(data.transactions as Array<any>).flat().filter(data=>{
              return data.input == "0x"
            })); // to save time spread and filter in one line was neccessary and not meant to be fancy

            if (counter === total) resolve();
          })
        );
      });

      batch.execute();
    });

    return blocks;
    } catch (error) {
      throw error
    }
  };
  private clearAllSubscriptions = () => {
    this.wsClient.eth.clearSubscriptions();
  };

  private getBlocksAsArray=(num:number, option:number)=>{
    let blocks = []
    for (let index = 0; index <= option-1; index++) {
      blocks.push(num-index)
    }
    return blocks;
  }

  getLiveAverageFeeEstimate = async (res: Response, option: number) => {
    if(option > 30){
      res.status(400).json({
        message:"Bad Request option surpasses limit of 30 according to the requirements"
      })
    }
    let block: any = {};
    try {
      block = await new Promise((resolve, reject) => {
        this.wsClient.eth.subscribe("newBlockHeaders",{},(err:any, head:any) => { //subsrcibe to load blocks
          const { number, gasLimit, gasUsed } = head;
          resolve({
            number,
            gasLimit,
            gasUsed,
          });
        });
      });
      this.clearAllSubscriptions(); //end all subscriptions
      console.log(`Accumulating ${option} Blocks`);
      let blockData = option == 0 ? [block.number]:this.getBlocksAsArray(block.number, option) //loads all blocks from last blocks passed in options
      let transactions = await this.getAllTransactionsInBlock(blockData);// gets all transactions in the blocks that are native
      return res.status(200).json({
        averageTransactionFee: this.calculateAverageGasFee(transactions!),
        blockFullnessOfLastBlock:
          Math.abs(
            ((block.gasLimit - block.gasUsed) / block.gasLimit) * 100 - 100
          ) + "%",
      });
    } catch (error:any) {
      return res.status(500).json({
        error:error.message,
      });
    }
  };
}
