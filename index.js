console.log("starting");
const inquirer = require("inquirer");
const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const web3 = createAlchemyWeb3(
  "https://eth-mainnet.alchemyapi.io/v2/6hvJk7StztjBHEPW3DT3GP_ifo041gKk"
);

inquirer
  .prompt([
    /* Pass your questions in here */
    //takes one or two block numbers as inputs
    {
      type: "input",
      name: "blockRange",
      message:
        "What is the block number or block number range (please use a space to separate the two block numbers for indicating a range) you would like to look at?",
    },
  ])
  .then((answers) => {
    // check input
    let block = [];
    let txns = [];
    let total = 0;
    if (answers.blockRange.includes(" ")) {
      block = answers.blockRange.split(" ");
    } else {
      block.push(answers.blockRange);
      //get the latest block number

      async function latestBlock() {
        let latest = await web3.eth.getBlockNumber();
        console.log("The latest block number is " + latest);
        block.push(String(latest));
        answers.blockRange = `We are looking at block ${block[0]} to ${block[1]}`;
      }

      async function totalEth() {
        txns = await web3.alchemy.getAssetTransfers({
          fromBlock: "latest",
          excludeZeroValue: true,
          category: [],
        });
        txns = Object.values(txns)[0].filter((txn) => txn.asset == "ETH");
        total = txns.map((txn) => txn.value).reduce((a, b) => a + b, 0);
        answers.totalEth = `Total Eth transfered is ${total}`;
        console.log(answers);
      }

      latestBlock();
      totalEth();
      answers.totalEth = total;
    }

    //Which addresses received Ether and how much did they receive in total?

    // Which addresses sent Ether and how much did they send in total?

    // Of these addresses, which are contract addresses?
    // console.log(answers, "end");
  });
