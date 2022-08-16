import { Response } from "express";
import Web3 from "web3";

export class Web3Service {
  wsClient: Web3;
  constructor() {
    try {
      this.wsClient = new Web3(process.env.INFURA_TEST_NODE!);
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
      throw error
    }
  };
  private getAllTransactionsInBlock = async (blockData: any) => {
    try {
      let tx: any[] = [];
      let tData: any[] = [];
      for (let index = 0; index < blockData.length; index++) {
        tData.push(...blockData[0].transactions);
      }
      await Promise.all(
        tData.map(async (data: any) => {
          let txData = await this.wsClient.eth.getTransaction(data);
          tx.push(txData);
        })
      );
      return tx;
    } catch (error) {
      throw error;
    }
  };
  private clearAllSubscriptions = () => {
    this.wsClient.eth.clearSubscriptions((err, result) => {});
  };

  private getLastNthBlocks = async (blockNumber: number, n: number) => {
    try {
      let blockData: any[] = [];
      await Promise.all([
        (async () => {
          for (let index = 0; index <= n; index++) {
            blockData.push(
              await this.wsClient.eth.getBlock(blockNumber - index)
            );
          }
        })(),
      ]);
      return blockData;
    } catch (err) {
      throw err;
    }
  };

  getLiveAverageFeeEstimate = async (res: Response, option: boolean) => {
    let blockNumber: any[] = [];
    try {
      this.wsClient.eth
        .subscribe("newBlockHeaders")
        .on("connected", async (subscriptionId) => {
          console.log(subscriptionId);
        })
        .on("data", async (blockHeader): Promise<any> => {
          blockNumber.push(blockHeader);
          if (blockHeader.number > blockNumber[0].number) {
            this.clearAllSubscriptions();
            if (option) {
              let blockData = await this.getLastNthBlocks(
                blockNumber[0].number,
                0
              );
              let last5 = await this.getLastNthBlocks(blockNumber[0].number, 5);
              let last30 = await this.getLastNthBlocks(
                blockNumber[0].number,
                30
              );
              let txs = await this.getAllTransactionsInBlock(blockData);
              let txs5 = await this.getAllTransactionsInBlock(last5);
              let txs30 = await this.getAllTransactionsInBlock(last30);
              return res.status(200).json({
                averageTransactionFee: this.calculateAverageGasFee(txs),
                last5: this.calculateAverageGasFee(txs5),
                last30: this.calculateAverageGasFee(txs30),
                blockFullness:
                  Math.abs(
                    ((blockNumber[0].gasLimit - blockNumber[0].gasUsed) /
                      blockNumber[0].gasLimit) *
                      100 -
                      100
                  ) + "%",
              });
            } else {
              let blockData = await this.getLastNthBlocks(
                blockNumber[0].number,
                0
              );
              let txs = await this.getAllTransactionsInBlock(blockData);
              return res.status(200).json({
                averageTransactionFee: this.calculateAverageGasFee(txs),
                blockFullness:
                  Math.abs(
                    ((blockNumber[0].gasLimit - blockNumber[0].gasUsed) /
                      blockNumber[0].gasLimit) *
                      100 -
                      100
                  ) + "%",
              });
            }
          }
        })
        .on("error", console.error);
    } catch (error) {
      return res.status(500).json({
       error
      });
    }
  };
}
