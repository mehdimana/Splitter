pragma solidity ^0.4.19;

contract Splitter {
    struct Receiver {
        address owner;
        uint ammountAlreadyReceived;
    }

    address public owner;
    Receiver public firstReceiver;
    Receiver public secondReceiver;
    bool public isContractActive;
    
    function Splitter(address receiver1, address receiver2) public {
        owner = msg.sender;
        
        require(receiver1 != address(0));
        require(receiver1 != owner);
        require(receiver2 != address(0));
        require(receiver2 != owner);
        
        
        firstReceiver.owner = receiver1;
        firstReceiver.ammountAlreadyReceived = 0;
        
        secondReceiver.owner = receiver2;
        secondReceiver.ammountAlreadyReceived = 0;
        
        isContractActive = true;
    }
    
    /**
     * owner sends funcds to this contract
     * - only owner can send funds
     * - ammount sent cannot be 0
     * - amount is split between receivers.
     */
    function sendFunds() public payable returns(bool success) {
        require(msg.sender == owner);
        require(isContractActive);
        uint ammountToSplit = this.balance;
        assert(ammountToSplit > 0);
        split(ammountToSplit);
        return true;
    }
    
    /**
     * transfer the funds in this contract between two receivers.
     * returns the total ammount that is send to the receivers;
     */
    function split(uint ammountToSplit) private {
        uint ammountToSend = ammountToSplit /2;
        firstReceiver = splitTo(firstReceiver, ammountToSend);
        secondReceiver = splitTo(secondReceiver, ammountToSend);
    }
    
    /**
     * sends funds to one receiver
     */
    function splitTo(Receiver receiver, uint ammountToSend) private returns(Receiver){
        receiver.owner.transfer(ammountToSend);
        receiver.ammountAlreadyReceived += ammountToSend;
        return receiver;
    }
    
    /**
     * kill switch
     */
     function killContract() public returns(bool success) {
        require(msg.sender == owner);
         isContractActive = false;
         return true;
     }
}