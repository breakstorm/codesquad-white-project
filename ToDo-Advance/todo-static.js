function staticInit(){

    var test = [1,2,3,4,5,6,7];

    /*
     해당 라벨을 가지고서 date값 비교
     로컬 스토리지에서 날짜값 파싱하기
     완료여부 파싱하기
     data1 : 날짜별 데이터 수 yyyy-mm-dd
     data2 : 완료 데이터 수 name.checked = true/false
     data3 : 미완료 데이터 수 name.checked = true/false
      *data1 = data2 + data3
    */
        
    //라벨값 만들기
    //라벨값에 따른 숫자(전체,완료,미완료)
    //data배열의 값 가져오기 (오브젝트?)

    //period값은 month / week / day로 라디오버튼에서 가져온다.
    var date = new Date();
    var dateTodayString = date.getFullYear().toString() + '-' + date.getMonth().toString() + '-' + date.getDate().toString()
    var dateStruct={
        period:"month",
        dateToday:date,    
        dateTodayString:dateTodayString,
        labelData:[],
        labelPeriod:[],
        listCount:[],
        listCountMiss:[],
        listCountDone:[],
    }

    //로컬 스토리지 사용을 하기 위한 초기화
    var keyString = 'keyNumber';
    var keyStringNumber = 0;
    var key = keyString + keyStringNumber;
    // getStringNumber(keyString);
    // 함수로 밖으로 뺄려면 reference 타입으로 변환해야 함.
    if(localStorage.getItem(keyString) !== null){
        var keyStringNumber = parseInt(localStorage.getItem(keyString));
    }
    else{
        // var keyStringNumber = 0;
        console.log("data empty");
        return false; //로컬스토리지에 데이터가 없어서 그래프를 그릴수 없음.
    }
    

    //라벨값 가져오는 기능 (배열, 주기, 현재 날짜값)
    getLabelData(dateStruct, keyString, keyStringNumber);
    //주기값을 기준으로 데이터 수 입력
    getListCount(dateStruct, keyString, keyStringNumber);

    //그래프 설정값
    var color = Chart.helpers.color;
    var data = {
        labels: ["January", "February", "March", "April", "May", "June", "July"],
        datasets: [{
                    label: 'Dataset 1',
                    backgroundColor: color(window.chartColors.red).alpha(0.5).rgbString(),
                    borderColor: window.chartColors.red,
                    borderWidth: 1,
                    data: test
                }, {
                    label: 'Dataset 2',
                    backgroundColor: color(window.chartColors.blue).alpha(0.5).rgbString(),
                    borderColor: window.chartColors.blue,
                    borderWidth: 1,
                    data: test
                }, {
                    label: 'Dataset 3',
                    backgroundColor: color(window.chartColors.green).alpha(0.5).rgbString(),
                    borderColor: window.chartColors.green,
                    borderWidth: 1,
                    data: test
                }]
            };

    //그래프 화면에 그리틑 부분
    var ctx = document.querySelector(".mid-Chart").getContext("2d");
    var myBarChart = new Chart(ctx,{
    	type: 'bar',
    	data: data,
    	options: {
    		responsive: true,
    		//maintainAspectRatio: false,
    		legend:{
    			position: 'bottom',
    		},
    		title:{
    			display: true,
    			text: 'todo-static'
    		}
    		// scales:{
    		// 	xAxes:[{
    		// 		stacked: true
    		// 	}],
    		// 	yAxes:[{
    		// 		stacked: true
    		// 	}]
    		// }
    	}
    });
    

    

}

function getLabelData(dateStruct, tempKeyString, tempKeyStringNumber){
    /*
        날짜변수 생성 및 원하는 데이터 가져오기
        var d = new Date()
        d.getFullYear().toString() + '-' + d.getMonth().toString() + '-' + d.getDate().toString()

        날짜변수 만드는 방법
        d = new Date(2017-1-1);
        Thu Jan 01 1970 09:00:02 GMT+0900 (KST)

        날짜변수 크기비교
    */

    /*
    //날짜
        일별 data수 카운트 하기
        주별 data수 카운트 하기(디폴트)
        월별 data수 카운트 하기
        날짜 기준 만드는 방법
        오늘 날짜를 함수로 가져온다
        (today - 7) * 4 = W / W-1 / W-2 / W-3 ==> 라벨로 저장
    */
    //오늘날짜 기준으로 D-30을 만든다.
    var tempdate = dateStruct.dateToday;
    switch(dateStruct.period){
        case 'week':
            for(i=0; i<5; i++){
                var tempString = "week-" + i;
                var tempdateString = tempdate.getFullYear().toString() + '-' + (tempdate.getMonth()+1).toString() + '-' + tempdate.getDate().toString()
                tempdate.setDate(tempdate.getDate() - 7);
                tempdateString = tempdateString + '/' + tempdate.getFullYear().toString() + '-' + (tempdate.getMonth()+1).toString() + '-' + tempdate.getDate().toString()
                dateStruct.labelPeriod.push(tempdateString);
                dateStruct.labelData.push(tempString);
            }
            break;

        case 'month':
            for(i=0; i<5; i++){
                var tempString = "month-"+i;
                var tempdateString = tempdate.getFullYear().toString() + '-' + (tempdate.getMonth()+1).toString() + '-' + tempdate.getDate().toString()
                tempdate.setDate(tempdate.getMonth() - 1);
                tempdateString = tempdateString + '/' + tempdate.getFullYear().toString() + '-' + (tempdate.getMonth()+1).toString() + '-' + tempdate.getDate().toString()
                dateStruct.labelPeriod.push(tempdateString);
                dateStruct.labelData.push(tempString);
            }
            break;

        case 'day':
            for(i=0; i<30; i++){
                var tempString = "day-"+i;
                var tempdateString = tempdate.getFullYear().toString() + '-' + (tempdate.getMonth()+1).toString() + '-' + tempdate.getDate().toString()
                tempdate.setDate(tempdate.getDate() - 1);
                dateStruct.labelPeriod.push(tempdateString);
                dateStruct.labelData.push(tempString);
            }
            break;
    }

    
};

function getListCount(dateStruct, tempKeyString, tempKeyStringNumber){
    //데이터 입력(데이터 리스트 개수)
    //forEach를 이용해서 period값에 로컬스토리지 전체를 검색. 충족변수 확인.
    //로컬 스토리지의 값을 date로 만들어야 함.
    //기준데이터 - experimental dateStruct.period
    //비교데티터 - control 로컬 스토리지
    var done = 0;
    var miss = 0;

    switch(dateStruct.period){
        case 'week':

            //전체에서 period 기준 맞는 데이터 거르기
            //period별 데이터에서 true/false 거르기
            dateStruct.listCount =  dateStruct.labelPeriod.length;
            for(i=0; i < tempKeyStringNumber; i++){
                key = tempKeyString+i;
                rawData = window.localStorage.getItem(key);
                keyData = rawData.replace(/(.+)\/.+\/\d+-\d+-\d+/,"$1");
                if(keyData === true) done++;
                else miss++;
                dateStruct.listCountDone.push(done);
                dateStruct.listCountMiss.push(miss);
            }
            break;

        case 'month':
            break;

        case 'day':
            dateStruct.listCount =  dateStruct.labelPeriod.length;
            for(i=0; i < tempKeyStringNumber; i++){
                key = tempKeyString+i;
                rawData = window.localStorage.getItem(key);
                keyData = rawData.replace(/(.+)\/.+\/\d+-\d+-\d+/,"$1");
                if(keyData === true) done++;
                else miss++;
                dateStruct.listCountDone.push(done);
                dateStruct.listCountMiss.push(miss);
            }
            break;
    }



    //우선 날짜값(string)값을 배열에 다 넣고서
    /*
    var tempKey = tempKeyString;
    var tempArr = [];
    for(i = 0; i < tempKeyStringNumber; i++){
        tempKey = tempKeyString + i;
        tempArr.push(window.localStorage.getItem(tempKey))
    }
    */


}

document.addEventListener("DOMContentLoaded", function(evt){
    staticInit();
});

