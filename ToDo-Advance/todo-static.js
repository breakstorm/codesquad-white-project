var color = Chart.helpers.color;
var test = [1,2,3,4,5,6,7];
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
            }
            ]

        };

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
//유형1
//일별 data수 카운트 하기
//주별 data수 카운트 하기
//월별 data수 카운트 하기
//날짜 기준 만드는 방법
//오늘 날짜를 함수로 가져온다
//(today - 7) * 4 = W / W-1 / W-2 / W-3 ==> 라벨로 저장


// 해당 라벨을 가지고서 date값 비교
//로컬 스토리지에서 날짜값 파싱하기
//완료여부 파싱하기
//data1 : 날짜별 데이터 수 yyyy-mm-dd
//data2 : 완료 데이터 수 name.checked = true/false
//data3 : 미완료 데이터 수 name.checked = true/false
//*data1 = data2 + data3
