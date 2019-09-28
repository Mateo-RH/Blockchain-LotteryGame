const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());

const compiledFactory = require('../ethereum/build/LotteryFactory.json');
const compiledLottery = require('../ethereum/build/Lottery.json');

let accounts;
let factory;
let lotteryAddress;
let lottery;

beforeEach(async () => {
  accounts = await web3.eth.getAccounts();

  factory = await new web3.eth.Contract(JSON.parse(compiledFactory.interface))
    .deploy({ data: compiledFactory.bytecode })
    .send({ from: accounts[0], gas: '1000000' });

  await factory.methods.createLottery('10000000000000000').send({
    from: accounts[0],
    gas: '1000000'
  });

  // const addresses = ....
  // lotteryAddress = addresses[0]
  [lotteryAddress] = await factory.methods.getDeployedLotteries().call();
  lottery = await new web3.eth.Contract(
    JSON.parse(compiledLottery.interface),
    lotteryAddress
  );
});

describe('Lottery Contract', () => {
  it('deploys a factory and lottery', () => {
    assert.ok(factory.options.address);
    assert.ok(lottery.options.address);
  });

  it('allows one account to enter', async () => {
    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei('0.01', 'ether')
    });

    const players = await lottery.methods.getPlayers().call({
      from: accounts[0]
    });

    assert.equal(accounts[0], players[0]);
    assert.equal(1, players.length);
  });

  it('allows multiple accounts to enter', async () => {
    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei('0.01', 'ether')
    });
    await lottery.methods.enter().send({
      from: accounts[1],
      value: web3.utils.toWei('0.01', 'ether')
    });
    await lottery.methods.enter().send({
      from: accounts[2],
      value: web3.utils.toWei('0.01', 'ether')
    });

    const players = await lottery.methods.getPlayers().call({
      from: accounts[0]
    });

    assert.equal(accounts[0], players[0]);
    assert.equal(accounts[1], players[1]);
    assert.equal(accounts[2], players[2]);
    assert.equal(3, players.length);
  });

  it('requires an amount of ether to enter', async () => {
    try {
      await lottery.methods.enter().send({
        from: accounts[0],
        value: 0
      });
      assert(false);
    } catch (err) {
      assert(err);
    }
  });

  it('only manager can call pickwinner', async () => {
    try {
      await lottery.methods.pickWinner().send({
        from: accounts[1]
      });
      assert(false);
    } catch (err) {
      assert(true);
    }
  });

  it('sends money to the winner', async () => {
    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei('0.01', 'ether')
    });

    const initialBalance = await web3.eth.getBalance(accounts[0]);
    await lottery.methods.pickWinner().send({
      from: accounts[0]
    });

    const finalBalance = await web3.eth.getBalance(accounts[0]);
    const difference = finalBalance - initialBalance;
    assert(difference > web3.utils.toWei('0.0098', 'ether'));
  });

  it('resets the array of players after pick the winner', async () => {
    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei('0.01', 'ether')
    });

    await lottery.methods.pickWinner().send({
      from: accounts[0]
    });

    const players = await lottery.methods.getPlayers().call({
      from: accounts[0]
    });

    assert(players.length == 0);
  });

  it('sends all the balance of the contract to the winner', async () => {
    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei('0.01', 'ether')
    });

    await lottery.methods.pickWinner().send({
      from: accounts[0]
    });

    const balance = await web3.eth.getBalance(lottery.options.address);
    assert(balance == 0);
  });
});
