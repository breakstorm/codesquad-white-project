/* Set the width of the side navigation to 250px and the left margin of the page content to 250px and add a black background color to body */
// function openNav() {
//     document.getElementById("mySidenav").style.width = "250px";
//     document.getElementById("main").style.marginLeft = "250px";
//     document.body.style.backgroundColor = "rgba(0,0,0,0.4)";
// }

/* Set the width of the side navigation to 0 and the left margin of the page content to 0, and the background color of body to white */
// function closeNav() {
//     document.getElementById("mySidenav").style.width = "0";
//     document.getElementById("main").style.marginLeft = "0";
//     document.body.style.backgroundColor = "white";
// }

document.querySelector(".top-menuButton").addEventListener("click",function(evt){
	document.querySelector(".sideNavigation").style.width = "250px";
});

document.querySelector(".closeMenu").addEventListener("click",function(evt){
	document.querySelector(".sideNavigation").style.width = "0px";
});

document.addEventListener("DOMContentLoaded", function(evt){
	init();
});

function init(){
	var listElement = document.querySelector("ul");
	var inputTextElement = document.querySelector("textarea")
	var inputDateElement = document.querySelector(".inputDone");
	var inputButtonElement = document.querySelector(".inputButton");
	var keyString = 'keyNumber';
	var keyStringNumber = 0;
	var key = keyString + keyStringNumber;
	if(localStorage.getItem(keyString) !== null){
		var keyStringNumber = parseInt(localStorage.getItem(keyString));
		listInit(listElement, keyStringNumber, keyString);
	}
	else{
		// var keyStringNumber = 0;
		localStorage.setItem(keyString, keyStringNumber.toString());
	}
	

	//버튼을 클릭하면 input 값이 스토리지에 저장
	//화면에 DOM조작을 함
	inputButtonElement.addEventListener("click", function(evt){
		if(evt.target.tagName !== "BUTTON") return false;
		var result = inputTextElement.value + '/' + inputDateElement.value;
		setTodoList(keyString, keyStringNumber, result);
		// localStorage.setItem(keyString, key,result);
		keyStringNumber = parseInt(localStorage.getItem(keyString));
	})

}



function setTodoList(tempKeyString, tempKeyStringNumber, tempResult){
	var temp = tempKeyString + tempKeyStringNumber
	localStorage.setItem(temp, tempResult);
	tempKeyStringNumber += 1;
	localStorage.setItem(tempKeyString, tempKeyStringNumber.toString());
}

function listInit(listElement, tempKeyStringNumber, tempKeyString){
	//로컬스토리지 항목 전체 화면 나타내기

	var storageData = [];

	//리스트 삭제
	listAllDelete(listElement);
	//배열에 스토리지의 모든값 받기
	getAllStorageData(listElement, storageData, tempKeyString);
	//해당 위치에 모든 배열의 값 넣기
	insertStorageData(listElement, storageData, tempKeyString);
	//Date값, checkbox값 넣기
}

function listAllDelete(listElement){
	//전체 child li가 몇개인지 파악한다.
	//child 숫자만큼 반복하며 li 삭제
	var tempLength = listElement.children.length
	for(i=0; i < tempLength; i++){
		listElement.removeChild(listElement.firstElementChild);
	}
}

function getAllStorageData(listElement, storageData, tempKeyString){
	storageLength = parseInt(window.localStorage.getItem(tempKeyString));
	for(i=0; i < storageLength; i++){
		var tempKey = tempKeyString + i;
		storageData.push(window.localStorage.getItem(tempKey));
	}
}

function insertStorageData(listElement, storageData, tempKeyString){
	console.log(storageData);
	storageLength = parseInt(window.localStorage.getItem(tempKeyString));
	for(i=0; i < storageLength; i++){
		var tempKey = tempKeyString + i;
		var tempString = window.localStorage.getItem(tempKey).replace(/(.+)\/\d+-\d+-\d+/,"$1")
		var tempHTML = '<li><input type="checkbox" name="check" class="check">'+tempString+'<input type="date" name="done" class="done"></li>'
		listElement.insertAdjacentHTML("beforeend",tempHTML);
	}
	// test = 테스트4/2017-04-04
	// pattern = /.+\/\d+-\d+-\d+/
	// result = test.replace(/(\w+)\/\d+\-\d+\-\d+/,"$1");
	// "테스트4"
}
// test = 테스트4/2017-04-04
// pattern = /.+\/\d+-\d+-\d+/
// result = test.replace(/(\w+)\/\d+\-\d+\-\d+/,"$1");
// "테스트4"