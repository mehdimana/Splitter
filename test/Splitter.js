var Splitter = artifacts.require("./Splitter.sol");

contract('Splitter', function(accounts) {
	var contract;
	var owner = accounts[0];

	beforeEach(function() {
		return Splitter.new(accounts[1], accounts[2], {from: owner})
			.then(function(instance){
				contract = instance;
			})
	})

	it("should initialize as expected", function() {
		return Splitter.deployed().then(function() {
		  return contract.owner({from: owner});
		}).then(function(actualOwner) {
		  assert.equal(owner, actualOwner, "owner of the contract was not well initialized.");
		  return contract.firstReceiver;
		}).then(function(actualReceiver){
		  assert.equal(accounts[1], actualReceiver.owner, "first receiver was not well initialized");
		  assert.equal(0, actualReceiver.ammountAlreadyReceived.toString(10), "first receiver ammount was not well initialized");
		  return contract.secondReceiver;	
		}).then(function(actualReceiver){
		  assert.equal(accounts[2], actualReceiver.owner, "second receiver was not well initialized");
		  assert.equal(0, actualReceiver.ammountAlreadyReceived.toString(10), "second receiver ammount was not well initialized");
		  return contract.balance;	
		}).then(function(actualBalance){
		  assert.equal(0, actualBalance.toString(10), "balance was not well initialized");
		  	
		})
	});
 });