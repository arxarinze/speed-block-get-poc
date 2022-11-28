# Esimate Fees From Stream

## ***proof of concept to show block retrieval speed at 5 blocks and at 200 blocks with similar timing***

### GET /api/get-fee-estimate
***This will solve the question 1a and also include additonal metric "block fullness of last block" in percentage***

### GET /api/get-fee-estimate?option=true
***0 means last block****
***This will solve the question include 1b where option = 'n blocks' and also include additonal metrics "block fullness of last block" in percentage***
***This can be used to test last 5 blocks and the last 30 blocks****

## Getting Started

```
cp env.example .env
add your web3 Node to .env file
yarn install
yarn run dev #for development use
yarn run build && yarn run start #for production use
```

***run api as stated above***


## Optimization Results
```
✓ should get have properties last in property (6733 ms)
✓ should get have properties averageTransactionFees for n = 5 blocks lockFullnes in property (33381 ms)
✓ should get have properties averageTransactionFees for n = 30 blocks lockFullnes in property (21593 ms)
```
***30 blocks came in faster than 5 blocks showing similar response time between them and the delay is due to the filling of the last block when they were each called***
