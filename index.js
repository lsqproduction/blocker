require("dotenv").config();
const inquirer = require("inquirer");
const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const web3 = createAlchemyWeb3(
  `https://eth-mainnet.alchemyapi.io/v2/${process.env.API_KEY}`
);

inquirer
  .prompt([
    //takes one or two block numbers as inputs
    {
      type: "input",
      name: "blockRange",
      message:
        "Please enter the block number or block range (please use a space to separate the two block numbers for indicating a range)?",
    },
  ])
  .then((answers) => {
    // check input
    let block = [],
      txns = [],
      total = 0;

    if (answers.blockRange.includes(" ")) {
      block = answers.blockRange.split(" ");
    } else {
      block.push(answers.blockRange);
    }

    async function checkContract(address) {
      await web3.eth.getCode(address, "latest", (result) => {
        if (result.length > 2) {
          return (address += "(contract)");
        }
      });
    }

    async function blocker() {
      let from = "0x" + Number(block[0]).toString(16);
      let to = block[1] ? "0x" + Number(block[1]).toString(16) : "latest";

      try {
        txns = await web3.alchemy.getAssetTransfers({
          fromBlock: from,
          toBlock: to,
          excludeZeroValue: true,
        });

        //total eth calculation
        txns = Object.values(txns)[0].filter((txn) => txn.asset == "ETH");
        total = txns.map((txn) => txn.value).reduce((a, b) => a + b, 0);
        answers.totalEth = `Total Eth transfered is ${total}`;

        //Which addresses received Ether and how much did they receive in total?

        answers.received = txns.map((txn) => {
          return {
            address: txn.to,
            received: `${txn.value}Eth`,
          };
        });

        // Which addresses sent Ether and how much did they send in total?
        answers.send = txns.map((txn) => {
          return {
            address: txn.from,
            send: `${txn.value}Eth`,
          };
        });

        console.log("answers", answers);
      } catch (error) {
        console.error(error);
      }
    }

    blocker();
  });
