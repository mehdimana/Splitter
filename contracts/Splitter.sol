pragma solidity ^0.4.19;

contract Splitter {
    struct Receiver {
        address owner;
        uint ammountAlreadyReceived;
    }

    address public owner;
    Receiver public firstReceiver;
    Receiver public secondReceiver;
    uint public balance; //in wei
    uint private totalAmmountSentByOwner; //in wei
    
    function Splitter(address receiver1, address receiver2) public {
        owner = msg.sender;
        
        firstReceiver.owner = receiver1;
        firstReceiver.ammountAlreadyReceived = 0;
        
        secondReceiver.owner = receiver2;
        secondReceiver.ammountAlreadyReceived = 0;
        
        balance = 0;
        totalAmmountSentByOwner = 0;
    }
    
    /**
     * owner sends funcds to this contract
     * - only owner can send funds
     * - ammount sent cannot be 0
     */
    function sendFunds() public payable returns(bool success) {
        require(msg.sender == owner);
        assert(msg.value > 0);
        totalAmmountSentByOwner += msg.value;
        return true;
    }
    
    /**
     * owner split the funds in this contract between two receivers.
     * - balnce should be > 0
     * - the sender should be the owner
     * returns the total ammount that is send to the receivers;
     */
    function split() public returns(uint ammountSplit) {
        require(balance > 0);
        require(msg.sender == owner); //only Alice can split.
        
        uint actualBalance = balance;
        splitTo(firstReceiver);
        splitTo(secondReceiver);
        
        return actualBalance - balance;
    }
    
    /**
     * sends funds to one receiver
     */
    function splitTo (Receiver receiver) private {
        uint ammountToSendToEachReceiver = totalAmmountSentByOwner / 2; //TODO how to deal with number non dividable by 2?
        assert(ammountToSendToEachReceiver > receiver.ammountAlreadyReceived); // this situation should never occur
        
        uint ammountToSendToThisReceiver = ammountToSendToEachReceiver - receiver.ammountAlreadyReceived;
        if (ammountToSendToThisReceiver > 0) {
            if (firstReceiver.owner.send(ammountToSendToThisReceiver)) {
                firstReceiver.ammountAlreadyReceived += ammountToSendToThisReceiver;
                balance -= ammountToSendToThisReceiver;
            } else {
                //TODO handle error
            }
        }
    }
}