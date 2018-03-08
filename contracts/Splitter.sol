pragma solidity ^0.4.19;

contract Splitter {
    struct Receiver {
        address owner;
        uint ammountAvailable;
    }

    address public owner;
    Receiver public firstReceiver;
    Receiver public secondReceiver;
    bool public isContractActive;
    
    function Splitter(address receiver1, address receiver2) public {
        owner = msg.sender;
        
        require(receiver1 != address(0));
        require(receiver1 != msg.sender);
        require(receiver2 != address(0));
        require(receiver2 != msg.sender);
        
        firstReceiver.owner = receiver1;
        secondReceiver.owner = receiver2;
        
        isContractActive = true;
    }
    
    /**
     * a receiver withdraw his available balance
     */
    function withdrawFunds() public {
        require(isContractActive);
        uint ammountToTransfer;
        if (msg.sender == firstReceiver.owner) {
            ammountToTransfer = firstReceiver.ammountAvailable;
            firstReceiver.ammountAvailable = 0;
            firstReceiver.owner.transfer(ammountToTransfer);
        } else if (msg.sender == secondReceiver.owner) {
            ammountToTransfer = secondReceiver.ammountAvailable;
            secondReceiver.ammountAvailable = 0;
            secondReceiver.owner.transfer(ammountToTransfer);
        } else {
            assert(false);
        }
    }

    /**
     * owner sends funcds to this contract
     * - only owner can send funds
     * - ammount sent cannot be 0
     * - amount is split between receivers but not ssent to the them
     */
    function sendFunds() public payable returns(bool success) {
        require(msg.sender == owner);
        require(isContractActive);
        uint ammountToSplit = msg.value;
        assert(ammountToSplit > 0);
        split(ammountToSplit);
        return true;
    }
    
    /**
     * transfer the funds in this contract between two receivers.
     * returns the total ammount that is send to the receivers;
     */
    function split(uint ammountToSplit) private {
        uint ammountReceived = ammountToSplit /2;
        firstReceiver.ammountAvailable += ammountReceived;
        secondReceiver.ammountAvailable += ammountReceived;
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