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
		});
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

	it("should fail if first or second receiver is 0x0", async () => {
		try {
	      await Splitter.new(accounts[1], "", {from: owner});
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
	      await Splitter.new("", accounts[2], {from: owner});
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

	/**
		test sending funcds
	*/

	it("should send funds successfully", function() {
		return Splitter.deployed().then(function() {
		  return contract.sendFunds({from: owner, value: 100});
		}).then(txObject => {
			assert.strictEqual('0x01', txObject.receipt.status.toString(10), "sendFund wass not successfull");
			return contract.firstReceiver.call({from: owner});
		}).then(function(actualReceiver){
			assert.strictEqual('50', actualReceiver[1].toString(10), "first receiver ammount was not well initialized");
			return contract.secondReceiver.call({from: owner});	
		}).then(function(actualReceiver){
			assert.strictEqual('50', actualReceiver[1].toString(10), "second receiver ammount was not well initialized");	
		})
	});

	it("should faill when sending 0 funds", function() {
		return Splitter.deployed().then(function() {
		  return contract.sendFunds({from: owner, value: 0});
		}).then(txObject => {
			console.log(txObject);
			assert(false, "call did not fail as expected.")
		}).catch(error => {
			if(error.toString().indexOf("VM Exception while processing transaction") != -1) {
					//ok test success					
				} else {
					// if the error is something else (e.g., the assert from previous promise), then we fail the test
					assert(false, error.toString());
				}
		});
	});

	it("should faill when not owner sending funds", function() {
		return Splitter.deployed().then(function() {
		  return contract.sendFunds({from: accounts[1], value: 100});
		}).then(txObject => {
			console.log(txObject);
			assert(false, "call did not fail as expected.")
		}).catch(error => {
			if(error.toString().indexOf("VM Exception while processing transaction") != -1) {
					//ok test success					
				} else {
					// if the error is something else (e.g., the assert from previous promise), then we fail the test
					assert(false, error.toString());
				}
		});
	});

	/**
		test kill switch
	*/

	it("should kill the contract when the kill switch is activated", function() {
		return Splitter.deployed().then(function() {
			return contract.killContract({from: owner});
		}).then(txObject => {
			assert.equal(1, txObject.receipt.status, "kill swith fail to activate.")
		   return contract.sendFunds({from: owner, value: 100});
		}).then(txObject => {
			console.log(txObject);
			assert(false, "call did not fail as expected.")
		}).catch(error => {
			if(error.toString().indexOf("VM Exception while processing transaction") != -1) {
					//ok test success					
				} else {
					// if the error is something else (e.g., the assert from previous promise), then we fail the test
					assert(false, error.toString());
				}
		});
	});

 });