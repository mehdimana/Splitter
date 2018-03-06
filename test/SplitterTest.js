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
		  return contract.firstReceiver.call({from: owner});
		}).then(function(actualReceiver){
		  assert.equal(accounts[1], actualReceiver[0], "first receiver was not well initialized");
		  assert.equal(0, actualReceiver[1].toString(10), "first receiver ammount was not well initialized");
		  return contract.secondReceiver.call({from: owner});	
		}).then(function(actualReceiver){
		  assert.equal(accounts[2], actualReceiver[0], "second receiver was not well initialized");
		  assert.equal(0, actualReceiver[1].toString(10), "second receiver ammount was not well initialized");
		  return contract.balance.call({from: owner});	
		}).then(function(actualBalance){
		  assert.equal(0, actualBalance.toString(10), "balance was not well initialized");
		  	
		})
	});

	it("should fail if first or second receiver is the owner", async () => {
		try {
	      await Splitter.new(accounts[0], accounts[2], {from: owner});
	      assert.fail('should have thrown before');
	    } catch(error) {
				if(error.toString().indexOf("VM Exception while processing transaction") != -1) {
					//ok test success
					return new Promise(resolve => resolve("ok"));
				} else {
					// if the error is something else (e.g., the assert from previous promise), then we fail the test
					assert(false, "---"+error.toString());
				}
	    }

		try {
	      await Splitter.new(accounts[1], accounts[0], {from: owner});
	      assert.fail('should have thrown before');
	    } catch(error) {
				if(error.toString().indexOf("VM Exception while processing transaction") != -1) {
					//ok test success
					return new Promise(resolve => resolve("ok"));
				} else {
					// if the error is something else (e.g., the assert from previous promise), then we fail the test
					assert(false, "---"+error.toString());
				}
	    }
	});

 });