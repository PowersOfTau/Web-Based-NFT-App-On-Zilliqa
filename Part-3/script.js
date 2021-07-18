var ContractAddress = "0xb4d83becb950c096b001a3d1c7abb10f571ae75f";
var ContractObject;
var ContractState;

function checkWallet(){
	if(window.zilPay){
		return true;
	}else{
		return false;
	}
}

function connectWallet(){
	if(window.zilPay.wallet.connect()){
		return true;
	}else{
		return false;
	}
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
	if(checkWallet() && connectWallet()){
		ContractObject = loadContract(ContractAddress);
		if(ContractObject){
			ContractObject.getState().then(function(stateData){
				ContractState = stateData;
				alert("Contract State Loaded Successfully!")
				loadGallery();
			});
		}
	}
}

function loadGallery(flag){
	var gallery = document.querySelector("#gallery-container");
	gallery.innerHTML = "";

	tokenOwners = ContractState.token_owners;
	tokenUris = ContractState.token_uris;

	galleryCode = "";

	for(i in tokenOwners){
		galleryCode += `
		<div id="nft-${i}" class="nft-card">
			<div class="nft-card-id HVCenter">NFT ID: ${i}</div>
			<div class="nft-card-img-holder HVCenter">
				<img src="${tokenUris[i]}"></div>
			<div class="nft-card-owner">Owner:&nbsp;${tokenOwners[i]}</div>
		</div>
		`;
	}

	gallery.innerHTML = galleryCode;
}














