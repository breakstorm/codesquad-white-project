
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
	var smallListElement = document.querySelector(".list");
	var deleteButtonElement = document.querySelector(".deleteButton");
	var midElement = document.querySelector(".todo-mid");

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
	});
	//화면의 체크박스 조작 이벤트
	midElement.addEventListener("change", function(evt){
		if(evt.target.className !== "check") return false;
		console.log(evt.target);
	});
	listElement.addEventListener("click", function(evt){
		//해당 리스트 삭제
		if(evt.target.className === "deleteButton"){
			var keyText = evt.target.previousSibling.previousSibling.data;
			//컨텍스트의 텍스트값 로컬스토리지 검색
			var keyIndex = searchLocalStorage(keyString, keyStringNumber, keyText);
			var controlIndex = parseInt(keyIndex.replace(/.+(\d+)/,"$1"));
			//로컬스토리지 컨텍스트값 삭제
			window.localStorage.removeItem(keyIndex);
			//로컬스토리지 재정렬
			rearrangeLocalStorage(keyString, keyStringNumber ,keyIndex, controlIndex);
			keyStringNumber = window.localStorage.getItem(keyString);
			//웹페이지 컨텍스트 삭제
			listElement.removeChild(evt.target.parentElement.parentElement);
		}
		//리스트 수정
	})
}

function rearrangeLocalStorage(tempKeyString, tempKeyStringNumber, tempKeyIndex, tempControlIndex){
	//시작값 = 컨트롤값+1 ~ tempKeyStringNumber -2
	//셋.로컬스토리지 ...
	//removeItem(tempKeyStringNumber)
	var tempValue;
	var tempKey;
	//0~11 일때 9까지조회
	for(i = tempControlIndex+1; i < tempKeyStringNumber; i++){
		tempKey = tempKeyString+i;
		tempValue = window.localStorage.getItem(tempKey);
		tempKey = tempKeyString + (i-1);
		window.localStorage.setItem(tempKey, tempValue);
	}
	tempKey = tempKeyString+(tempKeyStringNumber-1);
	window.localStorage.removeItem(tempKey);
	window.localStorage.setItem(tempKeyString, tempKeyStringNumber-1);
}

function searchLocalStorage(tempKeyString, tempKeyStringNumber, keyText){
	//var temp;
	var tempKey;
	var controlText;
	var rawText;
	//var length = tempKeyStringNumber;
	for(i=0; i < tempKeyStringNumber; i++){
		tempKey = tempKeyString + i;
		rawText = window.localStorage.getItem(tempKey);
		controlText = rawText.replace(/.+\/(.+)\/\d+-\d+-\d+/,"$1");
		if(keyText === controlText) break;
	}
	return tempKey;
}

function setNewTodoList(listElement, tempText, tempDate){
	var setString = '<li><div class="list"><input type="checkbox" name="check" class="check">' + tempText + '<input type="date" name="done" class="done" value="' + tempDate + '"><button class="deleteButton">delete</button></div></li>';
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
		var tempHTML = '<li class="listText"><div class="list"><input type="checkbox" name="check" class="check" checked="">' + tempString + '<input type="date" name="done" class="done" value="' + tempDate + '"><button class="deleteButton">delete</button></div></li>';
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
