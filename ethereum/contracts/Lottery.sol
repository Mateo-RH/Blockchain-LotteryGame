pragma solidity ^0.4.17;

contract LotteryFactory {
    address[] public deployedLotteries;
    
    function createLottery(uint minimum) public {
        address newLottery = new Lottery(minimum, msg.sender);
        deployedLotteries.push(newLottery);
    }
    
    function getDeployedLotteries() public view returns(address[]) {
        return deployedLotteries;
    }
}


contract Lottery {
    address public manager;
    uint public contribution;
    address[] public players;
    uint public playersCount;
    
    modifier restricted() {
        require(msg.sender == manager);
        _;
    }
    
    function Lottery(uint minimunContribution, address creator) public {
        manager = creator;
        contribution = minimunContribution;
    }
    
    function enter() public payable {
        require(msg.value == contribution);
        
        players.push(msg.sender);
        playersCount++;
    }
    
    function random() private view returns (uint) {
        return uint(keccak256(block.difficulty, now, players));
    }
    
    function pickWinner() public restricted {
        uint index = random() % players.length;
        players[index].transfer(this.balance);
        players = new address[](0);
        playersCount = 0;
    }

    
    function getPlayers() public view returns (address[]) {
        return players;
    }

    function getSummary() public view returns (
        uint, uint, uint, address
    ) {
        return (
            contribution,
            this.balance,
            playersCount,
            manager
        );
    }
}