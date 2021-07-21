var ContractAddress;
var ContractObject;
var ContractState;

function checkWallet(){
	if(window.zilPay){
		return true;
	}else{
		return false;
	}
}

async function connectWallet(){
	return (await window.zilPay.wallet.connect());
}

function loadContract(contractAddr){
	try{
		return window.zilPay.contracts.at(contractAddr);
	}catch(err){
		console.log(err.message);
		return false;
	}
}

function onloadInit(){
	connectAppToWallet();
	observer();
	console.clear();
}

function loadGallery(flag){
	if(!ContractObject){
		alert("Please load contract first");
		return;
	}

	var gallery = document.querySelector("#gallery-container");
	gallery.innerHTML = "";

	tokenOwners = ContractState.token_owners;
	tokenUris = ContractState.token_uris;

	galleryCode = "<h2 style='width:100%' class='HVCenter'>" + ContractObject.init[1].value + "</h2>";

	var currentAccountAddress = window.zilPay.wallet.defaultAccount.base16;

	for(i in tokenOwners){

		if(flag){
			if(tokenOwners[i].toUpperCase() !== currentAccountAddress.toUpperCase()){			
				continue;
			}
		}

		var transferBtn = "";
		if(tokenOwners[i].toUpperCase() == currentAccountAddress.toUpperCase()){			
			transferBtn = "<button onclick='transferNFT(" + i + ")'>Transfer</button>"
		}		


		galleryCode += `
		<div id="nft-${i}" class="nft-card">
			<div class="nft-card-id HVCenter">NFT ID: ${i}&nbsp;${transferBtn}</div>
			<div class="nft-card-img-holder HVCenter">
				<img src="${tokenUris[i]}"></div>
			<div class="nft-card-owner">Owner:&nbsp;${tokenOwners[i]}</div>
		</div>
		`;
	}

	gallery.innerHTML = galleryCode;
}

async function connectAppToWallet(){
	check1 = checkWallet();
	check2 = await connectWallet();
	if(check1 && check2){
		//if successful hide button and show net and address
		document.querySelector("#wallet-address-container").style.display = "inline-block";
		document.querySelector("#connect-button-container").style.display = "none";

		//get and set network and address
		let networkName = window.zilPay.wallet.net;
		let currentAddress = window.zilPay.wallet.defaultAccount.bech32;
		document.querySelector("#wallet-network-span").innerHTML = networkName;
		document.querySelector("#wallet-address-span").innerHTML = currentAddress;
	}else{
		//if connection failed 
		alert("Something went wrong connecting wallet, try again later.");
	}
}

function observer(){
	window.zilPay.wallet.observableAccount().subscribe(function (acc){
		if(acc) connectAppToWallet();
	});

	window.zilPay.wallet.observableNetwork().subscribe(function (net){
		if(net) connectAppToWallet();
	});
}


function loadNFTContract(){
	var contractAddress = prompt("Please enter contract address");
	
	ContractObject = loadContract(contractAddress);
	if(ContractObject){
		ContractObject.getState().then(function(stateData){
			ContractState = stateData;
			ContractAddress = contractAddress;
			alert("Contract State Loaded Successfully!");
			ContractObject.getInit().then(function(x){
				loadGallery(false);
			});

		});
	}else{
		ContractObject = undefined;
	}
}

function showMintbox() {
	document.querySelector("#mintbox-container").style.display = "flex";
}

function hideMintbox() {
	document.querySelector("#mintbox-container").style.display = "none";
}

function mintNFT(){

	if(!ContractObject){
		alert("Please load contract first");
		return;
	}

	/*check if the user is a minter*/
	flag = false;
	var currentAccountAddress = window.zilPay.wallet.defaultAccount.base16;
	for(i in ContractState.minters){
		if(i.toUpperCase() == currentAccountAddress.toUpperCase()){
			flag = true;
			break;
		}
	}

	if(!flag){
		alert("You don't have a mint access");
		return;
	}
	/*check if the user is a minter*/

	//geting inputs
	var NftTo = document.querySelector("#mintnft_to").value;
	var NftUri = document.querySelector("#mintnft_uri").value;

	/* Code for transaction call */
	const gasPrice = window.zilPay.utils.units.toQa('2000', window.zilPay.utils.units.Units.Li);

	var tx = ContractObject.call('Mint',[{
		vname: "to",
		type: "ByStr20",
		value: NftTo
	},{
		vname: "token_uri",
		type: "String",
		value: NftUri
	}],
	{
		gasPrice: gasPrice,
		gasLimit: window.zilPay.utils.Long.fromNumber(10000)
	});
	/* Code for transaction call */

	//handle the promise accordingly
	tx.then(function(a){
		console.log(a);
	});

	console.log(t);
}


function transferNFT(nftid){

	var receiverAddress = prompt("Please enter the address you want to send NFT ID:" + nftid + " to");

	/* Code for transaction call */
	const gasPrice = window.zilPay.utils.units.toQa('2000', window.zilPay.utils.units.Units.Li);

	var tx = ContractObject.call('Transfer',[{
		vname: "to",
		type: "ByStr20",
		value: receiverAddress+""
	},{
		vname: "token_id",
		type: "Uint256",
		value: nftid+""
	}],
	{
		gasPrice: gasPrice,
		gasLimit: window.zilPay.utils.Long.fromNumber(10000)
	});
	/* Code for transaction call */

	//handle the promise accordingly
	tx.then(function(a){
		console.log(a);
	});

	console.log(t);
}








