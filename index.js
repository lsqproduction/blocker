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
      name: "blockNumbers",
      message:
        "What is the block number or block number range (please use a space to separate the two block numbers for indicating a range) you would like to look at?",
    },
  ])
  .then((answers) => {
    // check input
    let block = [];
    let total = 0;
    if (answers.blockNumbers.includes(" ")) {
      block = answers.blockNumbers.split(" ");
    } else {
      block.push(answers.blockNumbers);
      //get the latest block number

      async function latestBlock() {
        let latest = await web3.eth.getBlockNumber();
        console.log("The latest block number is " + latest);
        block.push(String(latest));
        console.log(block);
        // var transaction = web3.eth.getBlock(latest, true).then(console.log);
      }
      let txns = [];
      async function totalEth() {
        txns = await web3.alchemy.getAssetTransfers({
          fromBlock: "latest",
          excludeZeroValue: true,
          category: [],
        });
        txns = Object.values(txns)[0].filter((txn) => txn.asset == "ETH");
        total = txns.map((txn) => txn.value).reduce((a, b) => a + b, 0);
        console.log(total);
        answers.totalEth = total;
        console.log(answers);
      }

      latestBlock();
      totalEth();

      //Total eth transfered

      answers.totalEth = total;
    }

    //Which addresses received Ether and how much did they receive in total?

    // Which addresses sent Ether and how much did they send in total?

    // Of these addresses, which are contract addresses?
    // console.log(answers, "end");
  });
