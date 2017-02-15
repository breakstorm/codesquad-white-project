function staticInit(){

    var bottomElement = document.querySelector(".todo-bottom");


    /* 데이터값 세팅 부분*/    
    /*
     해당 라벨을 가지고서 date값 비교
     로컬 스토리지에서 날짜값 파싱하기
     완료여부 파싱하기
     data1 : 날짜별 데이터 수 yyyy-mm-dd
     data2 : 완료 데이터 수 name.checked = true/false
     data3 : 미완료 데이터 수 name.checked = true/false
      *data1 = data2 + data3
    */  
    //period값은 month / week / day로 라디오버튼에서 가져온다.
    var date = new Date();
    var dateTodayString = date.getFullYear().toString() + '-' + (date.getMonth()+1).toString() + '-' + date.getDate().toString()
    var dateStruct = new Object();
    var dateStruct={
        period:"week",
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
    //선택된 단위로 데이터값 초기화
    getSettingData(dateStruct,keyString, keyStringNumber);

    
    /* 그래프 설정값 */
    var color = Chart.helpers.color;
    var data = {
        labels:dateStruct.labelData,
        datasets: [{
                    label: '전체',
                    backgroundColor: color(window.chartColors.red).alpha(0.5).rgbString(),
                    borderColor: window.chartColors.red,
                    borderWidth: 1,
                    data: dateStruct.listCount
                }, {
                    label: '완료',
                    backgroundColor: color(window.chartColors.blue).alpha(0.5).rgbString(),
                    borderColor: window.chartColors.blue,
                    borderWidth: 1,
                    data: dateStruct.listCountDone
                }, {
                    label: '미완료',
                    backgroundColor: color(window.chartColors.green).alpha(0.5).rgbString(),
                    borderColor: window.chartColors.green,
                    borderWidth: 1,
                    data: dateStruct.listCountMiss
                }]
            };
    options={
        responsive: true,
            //maintainAspectRatio: false,
            legend:{
                position: 'bottom',
            },
            title:{
                display: true,
                // text: 'todo-static'
            },
            scales:{
                xAxes:[{
                    type: 'category'
                }],
                yAxes:[{
                    type: 'linear',
                        display: true,
                        ticks:{
                            // max: 10,
                            min: 0,
                            fixedStepSize: 1
                            // stepSize: 1
                        }
                }]
            }
    }
    chartConfig={
        type: 'bar',
        data: data,
        options: options
    }

    //그래프 화면에 그리틑 부분
    var ctx = document.querySelector(".mid-Chart").getContext("2d");
    var myBarChart = new Chart(ctx,chartConfig);
    
    document.querySelector("canvas").addEventListener("click", function(evt){
        var activeBars = myBarChart.getElementAtEvent(evt);
        var tempDate = dateStruct.labelPeriod[activeBars[0]._index];
        var tempPeriodData = {
            tempDone:[],
            tempMiss:[]
        };
    //dateStruct.labelPeriod[activeBars[0]._index]
    //로컬스토리지에서 해당 기간의 값을 검색
    getSearchData(tempDate, tempPeriodData, keyString, keyStringNumber, dateStruct.period)
    //해당 데이터값을 화면에 표시
    setPeriodListPage(bottomElement, tempPeriodData);
    myBarChart.update();
    });

    document.querySelector(".mid-period").addEventListener("change",function(evt){
        // console.log(evt.target.value);
        if(evt.target.checked === false) return;
        //dateStruct 데이터값 초기화
        setDateStructDefault(dateStruct);
        //기간값 변경
        setDateStructPeriod(dateStruct, evt.target.value);
        //데이터 세팅 변경
        getSettingData(dateStruct,keyString, keyStringNumber);
        //myBarChart 데이터 변경
        setChartData(dateStruct, myBarChart);
        //그래프 업데이트
        myBarChart.update();
        // myBarChart.clear();
        // myBarChart.render();
        // myBarChart.destroy();
        // var myBarChart = new Chart(ctx, chartConfig);
    });
}

function setChartData(dateStruct, myBarChart) {
    myBarChart.data.labels = dateStruct.labelData;
    myBarChart.data.datasets[0].data = dateStruct.listCount;
    myBarChart.data.datasets[1].data = dateStruct.listCountDone;
    myBarChart.data.datasets[2].data = dateStruct.listCountMiss;
    return true;
}


function setDateStructPeriod(dateStruct, value) {
    dateStruct.period = value;
    return true;
}


function setDateStructDefault(dateStruct){
    // dateStruct.period = "";
    dateStruct.labelData = [];
    dateStruct.labelPeriod = [];
    dateStruct.listCount = [];
    dateStruct.listCountDone = [];
    dateStruct.listCountMiss = [];
    return true;
}


function getSettingData(dateStruct, tempKeyString, tempKeyStringNumber){
    //라벨값 가져오는 기능 (배열, 주기, 현재 날짜값)
    getLabelData(dateStruct, tempKeyString, tempKeyStringNumber);
    //주기값을 기준으로 데이터 수 입력
    getListCount(dateStruct, tempKeyString, tempKeyStringNumber);    
}


function getSearchData(tempDate, tempPeriodData, tempKeyString, tempKeyStringNumber, tempPeriod){
    //기간값1, 기간값2 파싱하기
    var maxPeriodText = tempDate.replace(/(.+)\/.+/,"$1");
    var maxPeriod = new Date(maxPeriodText);
    var minPeriodText = tempDate.replace(/.+\/(.+)/,"$1");
    var minPeriod = new Date(minPeriodText);
    //로컬스토리지 전체 접근
    //주, 월 단위의 경우
    if(tempPeriod === 'week' || tempPeriod === 'month'){
        for(i=0; i < tempKeyStringNumber; i++){
            key = tempKeyString+i;
            rawData = window.localStorage.getItem(key);
            controlDateText = rawData.replace(/.+\/.+\/(\d+-\d+-\d+)/,"$1");
            controlDate = new Date(controlDateText);
            controlWork = rawData.replace(/(.+)\/.+\/\d+-\d+-\d+/,"$1");
            if(controlDate >= minPeriod && controlDate <= maxPeriod){
                if(controlWork === "true") tempPeriodData.tempDone.push(rawData.replace(/.+\/(.+)\/\d+-\d+-\d+/,"$1"));
                else tempPeriodData.tempMiss.push(rawData.replace(/.+\/(.+)\/\d+-\d+-\d+/,"$1"))
            }

        }
    }
    else if(tempPeriod ==='day'){
        for(i=0; i < tempKeyStringNumber; i++){
            key = tempKeyString+i;
            rawData = window.localStorage.getItem(key);
            controlDateText = rawData.replace(/.+\/.+\/(\d+-\d+-\d+)/,"$1");
            controlDate = new Date(controlDateText);
            controlDateText = controlDate.getFullYear().toString() + '-' + (controlDate.getMonth()+1).toString() + '-' + controlDate.getDate().toString()
            controlWork = rawData.replace(/(.+)\/.+\/\d+-\d+-\d+/,"$1");
            if(controlDateText === tempDate){
                if(controlWork === "true") tempPeriodData.tempDone.push(rawData.replace(/.+\/(.+)\/\d+-\d+-\d+/,"$1"));
                else tempPeriodData.tempMiss.push(rawData.replace(/.+\/(.+)\/\d+-\d+-\d+/,"$1"))
            }

        }   
    }
    //해당 기간값에 해당하는 데이터 접근
    //텍스트 내용, 완료여부, 날짜값 가져오기
}


function setPeriodListPage(bottomElement, tempPeriodData){
    //bottom영역에 있는 엘리먼트 삭제
    deleteElementAllChild(bottomElement);
    //완료부분 삽입
    //완료부분 데이터 삽입
    setPeriodListPageDonework(bottomElement, tempPeriodData);
    //미완료부분 삽입
    //미완료부분 데이터 삽입
    setPeriodListPageMisswork(bottomElement, tempPeriodData);
}


function deleteElementAllChild(bottomElement){
    let length = bottomElement.children.length;
    if(length === 0) return;
    for(i=0; i < length; i++){
        bottomElement.removeChild(bottomElement.firstElementChild)
    }
}


function setPeriodListPageDonework(bottomElement, tempPeriodData){
    bottomElement.insertAdjacentHTML('beforeend','<h2>완료한 일</h2><ul class="donework"></ul>');
    newPoint = document.querySelector(".donework");
    for(temp in tempPeriodData.tempDone) {
        var htmlString = "<li>" + tempPeriodData.tempDone[temp] + "</li>"
        newPoint.insertAdjacentHTML('beforeend', htmlString);
    }
}


function setPeriodListPageMisswork(bottomElement, tempPeriodData){
    bottomElement.insertAdjacentHTML('beforeend','<h2>미완료한 일</h2><ul class="misswork"></ul>');
    newPoint = document.querySelector(".misswork");
    for(temp in tempPeriodData.tempMiss) {
        var htmlString = "<li>" + tempPeriodData.tempMiss[temp] + "</li>"
        newPoint.insertAdjacentHTML('beforeend', htmlString);
    }
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
    dateStruct.dateToday = new Date();
};

function getListCount(dateStruct, tempKeyString, tempKeyStringNumber){
    //데이터 입력(데이터 리스트 개수)
    //forEach를 이용해서 period값에 로컬스토리지 전체를 검색. 충족변수 확인.
    //로컬 스토리지의 값을 date로 만들어야 함.
    //기준데이터 - experimental dateStruct.period -> minDate / maxDate
    //비교데티터 - control 로컬 스토리지
    var done = 0;
    var miss = 0;
    var list = 0;

    switch(dateStruct.period){
        case 'week':
            //전체에서 period 기준 맞는 데이터 거르기
            for(i=0; i < dateStruct.labelPeriod.length; i++){
                var dateString = dateStruct.labelPeriod[i];
                var maxText = dateString.replace(/(.+)\/.+/,"$1");
                maxDate = new Date(maxText);
                var minText = dateString.replace(/.+\/(.+)/,"$1");
                minDate = new Date(minText);

            //period별 데이터에서 true/false 거르기
                for(j=0; j < tempKeyStringNumber; j++){
                    key = tempKeyString+j;
                    rawData = window.localStorage.getItem(key);
                    keyData = rawData.replace(/(.+)\/.+\/\d+-\d+-\d+/,"$1");
                    keyDate = rawData.replace(/.+\/.+\/(\d+-\d+-\d+)/,"$1");
                    controlDate = new Date(keyDate)
                    if(controlDate > minDate && controlDate < maxDate){
                        if(keyData === "true") done++;
                        else miss++;
                        
                        list++;    
                    }
                }
                dateStruct.listCountDone.push(done);
                dateStruct.listCountMiss.push(miss);
                dateStruct.listCount.push(list);
                done = 0;
                miss = 0;
                list = 0;
            }
            
            break;

        case 'month':
            //전체에서 period 기준 맞는 데이터 거르기
            for(i=0; i < dateStruct.labelPeriod.length; i++){
                var dateString = dateStruct.labelPeriod[i];
                var maxText = dateString.replace(/(.+)\/.+/,"$1");
                maxDate = new Date(maxText);
                var minText = dateString.replace(/.+\/(.+)/,"$1");
                minDate = new Date(minText);

            //period별 데이터에서 true/false 거르기
                for(j=0; j < tempKeyStringNumber; j++){
                    key = tempKeyString+j;
                    rawData = window.localStorage.getItem(key);
                    keyData = rawData.replace(/(.+)\/.+\/\d+-\d+-\d+/,"$1");
                    keyDate = rawData.replace(/.+\/.+\/(\d+-\d+-\d+)/,"$1");
                    controlDate = new Date(keyDate)
                    if(controlDate > minDate && controlDate < maxDate){
                        if(keyData === "true") done++;
                        else miss++;
                        
                        list++;    
                    }
                }
                dateStruct.listCountDone.push(done);
                dateStruct.listCountMiss.push(miss);
                dateStruct.listCount.push(list);
                done = 0;
                miss = 0;
                list = 0;
            }
            break;

        case 'day':
            //전체에서 period 기준 맞는 데이터 거르기
            for(i=0; i < dateStruct.labelPeriod.length; i++){
                var dateString = dateStruct.labelPeriod[i];
                var maxText = dateString.replace(/(.+)\/.+/,"$1");
                maxDate = new Date(maxText);
                var minText = dateString.replace(/.+\/(.+)/,"$1");
                minDate = new Date(minText);

            //period별 데이터에서 true/false 거르기
                for(j=0; j < tempKeyStringNumber; j++){
                    key = tempKeyString+j;
                    rawData = window.localStorage.getItem(key);
                    keyData = rawData.replace(/(.+)\/.+\/\d+-\d+-\d+/,"$1");
                    keyDate = rawData.replace(/.+\/.+\/(\d+-\d+-\d+)/,"$1");
                    controlDate = new Date(keyDate)
                    controlDateText = controlDate.getFullYear().toString() + '-' + (controlDate.getMonth()+1).toString() + '-' + controlDate.getDate().toString()
                    if(controlDateText == minText ){
                        if(keyData === "true") done++;
                        else miss++;
                        
                        list++;    
                    }
                }
                dateStruct.listCountDone.push(done);
                dateStruct.listCountMiss.push(miss);
                dateStruct.listCount.push(list);
                done = 0;
                miss = 0;
                list = 0;
            }
            break;
    }
}


document.querySelector(".top-menuButton").addEventListener("click",function(evt){
    document.querySelector(".sideNavigation").style.width = "250px";
});


document.querySelector(".closeMenu").addEventListener("click",function(evt){
    document.querySelector(".sideNavigation").style.width = "0px";
});


document.addEventListener("DOMContentLoaded", function(evt){
    staticInit();
});

