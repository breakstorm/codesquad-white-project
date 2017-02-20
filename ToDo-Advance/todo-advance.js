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
		//데이터 저장 내용
		if(inputDateElement.value === ""){
			var date = new Date();
    		var dateValue = date.getFullYear().toString() + '-' + (date.getMonth()+1).toString() + '-' + date.getDate().toString()
		}
		else{
			var dateValue = inputDateElement.value;
		}
		var result = 'false/' + inputTextElement.value + '/' + dateValue;
		//로컬스토리지 저장
		setTodoList(keyString, keyStringNumber, result);
		//저장한 데이터값 화면에 출력
		setNewTodoList(listElement, inputTextElement.value, dateValue);
		//저장한 Check 표시
		// setNewTodoListCheckbox(listElement)
		// localStorage.setItem(keyString, key,result);
		// keyStringNumber = parseInt(localStorage.getItem(keyString));
	})

}


function setNewTodoList(listElement, tempText, tempDate){
	var setString = '<li><input type="checkbox" name="check" class="check">' + tempText + '<input type="date" name="done" class="done" value="' + tempDate + '"></li>';
	listElement.insertAdjacentHTML('beforeend', setString);
	return true;
}

function setTodoList(tempKeyString, tempKeyStringNumber, tempResult){
	var temp = tempKeyString + tempKeyStringNumber;
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
	//checkbox값 넣기
	insertStorageCheckbox(listElement, storageData, tempKeyString);
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
	// console.log(storageData);
	storageLength = parseInt(window.localStorage.getItem(tempKeyString));
	for(i=0; i < storageLength; i++){
		var tempKey = tempKeyString + i;
		var tempString = window.localStorage.getItem(tempKey).replace(/.+\/(.+)\/\d+-\d+-\d+/,"$1")
		// var tempChecked = window.localStorage.getItem(tempKey).replace(/(.+)\/.+\/\d+-\d+-\d+/,"$1")
		// if(tempChecked === "true") var tempCheckBoolean = true;
		// else var tempCheckBoolean = 0;
		var tempDate = window.localStorage.getItem(tempKey).replace(/.+\/.+\/(\d+-\d+-\d+)/,"$1")
		var tempHTML = '<li><input type="checkbox" name="check" class="check" checked="">' + tempString + '<input type="date" name="done" class="done" value="' + tempDate + '"></li>';
		listElement.insertAdjacentHTML("beforeend",tempHTML);
	}
	// test = true/테스트4/2017-04-04
	// pattern = /.+\/(.+)\/\d+-\d+-\d+/
	// result = test.replace(/.+\/(.+)\/\d+-\d+-\d+/,"$1");
	// "테스트4"
}

function insertStorageCheckbox(listElement, storageData, tempKeyString){
	var tempList = document.querySelectorAll(".check");
	for(i=0; i < tempList.length; i++){
		// var temp = document.querySelector(".check:nth-child("+(i+1)+")");
		var tempString = storageData[i].replace(/(.+)\/.+\/\d+-\d+-\d+/,"$1");
		if(tempString === "true") tempList[i].checked = true;
		else tempList[i].checked = false;
	}
}
