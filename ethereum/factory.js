import web3 from './web3';
import LotteryFactory from './build/LotteryFactory.json';

const instance = new web3.eth.Contract(
  JSON.parse(LotteryFactory.interface),
  '0x046e0B076D01953A181A24087230187dba47A576'
);

export default instance;
