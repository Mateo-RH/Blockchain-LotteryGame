import Web3 from 'web3';

let web3;

if (typeof window !== 'undefined' && typeof window.web3 !== 'undefined') {
  // We are in the browser and metamask is running
  const getProvider = async () => {
    await window.web3.currentProvider.enable(); // request authentication
  };
  getProvider();
  web3 = new Web3(window.web3.currentProvider);
} else {
  // We are on the server *OR* the user is not running metamask
  const provider = new Web3.providers.HttpProvider(
    'https://rinkeby.infura.io/v3/b09b8166ec634325a6c1f000983900ae'
  );
  web3 = new Web3(provider);
}

export default web3;
