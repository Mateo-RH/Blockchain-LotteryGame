import web3 from './web3';
import LotteryFactory from './build/LotteryFactory.json';

const instance = new web3.eth.Contract(
  JSON.parse(LotteryFactory.interface),
  '0x52debAF887A07cD7e2dC5fB0216C6CD750082fF3'
);

export default instance;
