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
        tx[0].reduce((previous: any, current: any) => {
          return previous + Number(current.gasPrice) * current.gas;
        }, 0) /
        tx.length /
        1000000000000000000.0
      );
    } catch (error) {
      throw error;
    }
  };
  private getAllTransactionsInBlock = async (blockData: any[]) => {
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
            blocks.push((data.transactions as Array<any>).flat().filter(data=>{
              return data.input == "0x"
            }));

            if (counter === total) resolve();
          })
        );
      });

      batch.execute();
    });

    return blocks;
    } catch (error) {
      console.log(error)
    }
  };
  private clearAllSubscriptions = () => {
    this.wsClient.eth.clearSubscriptions();
  };

  getBlocksAsArray=(num:number, option:number)=>{
    let blocks = []
    for (let index = 0; index <= option; index++) {
      blocks.push(num-index)
    }
    return blocks;
  }

  getLiveAverageFeeEstimate = async (res: Response, option: number) => {
    let block: any = {};
    try {
      block = await new Promise((resolve, reject) => {
        this.wsClient.eth.subscribe("newBlockHeaders",{},(err:any, head:any) => {
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
      let blockData = this.getBlocksAsArray(block.number, option)
      let transactions = await this.getAllTransactionsInBlock(blockData);
      return res.status(200).json({
        averageTransactionFee: this.calculateAverageGasFee(transactions!),
        blockFullness:
          Math.abs(
            ((block.gasLimit - block.gasUsed) / block.gasLimit) * 100 - 100
          ) + "%",
      });
    } catch (error) {
      return res.status(500).json({
        error,
      });
    }
  };
}
