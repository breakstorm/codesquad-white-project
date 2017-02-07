#구현 기술 스펙
 1. 언어 : javascript, HTML, CSS
 2. 라이브러리 및 기술 : 로컬 스토리지, chart.js



#로컬스토리지 사용
참고사이트 : http://ohgyun.com/417
참고사이트 : https://developer.mozilla.org/en/docs/Web/API/Window/localStorage

##사용예
 - 사용자가 입력한 값을 임시로 저장하고 있다가 사용
   (자동완성, 검색내역 불러오기)

##HTML WebStorageAPI의 기능중 LocalStorage 기능
```
HTML WebStorageAPI
 - SessionStorage / 만료기간 있음
 - LocalStorage / 만료기간 없음
```

## 일반 사용예제
```html
    var obj = {};
    var obj2 = {
      toString: function () {
        return "I'am obj2";
      }
    };

    localStorage.setItem('obj', obj);
    localStorage.setItem('obj2', obj2);

    localStorage.getItem('obj'); //--> "[object Object]"
    localStorage.getItem('obj2'); //--> "I'm obj2"
```
 key-value 로 데이터가 저장이 된다.
 value에는 어떠한 형태이든 저장이 가능하다. object 혹은 function 모두 가능
 데이터만료기간

## event 사용예제
```
    window.addEventListener('storage', function (evt) {
      // evt = 이벤트 객체
    }, false);
```

## 사용제한
- 동일 근원 정책을 기준으로 동작한다.
  즉, 프로토콜, 호스트, 포트 중 어느 하나라도 다르면, 각각 별도의 공간에 데이터가 저장된다.
  (document.domain 을 설정하더라도 공유되지 않는다)
  ==> 크롬에서 다른 탭/브라우저를 열면 별도의 공간이 열린다.

- 디바이스마다 다르지만, 대부분 Origin 당 약 5MB 정도를 저장할 수 있다.
  문자열만 저장할 수 있으며, 2바이트 캐릭터(UTF-16)으로 저장된다.
  5메가를 넘어설 경우, QUOTA_EXCEEDED_ERR 오류가 발생한다.
  추가 공간을 요구할 수 없다. 

- Safari아 iOS Safari에서 Private Browsing 옵션을 켜는 경우에는 사용할 수 없다.
  Private Browsing 을 사용하는 경우,
    - getItem()에서는 항상 null을 리턴하고,
    - setItem()에서는 QUOTA_EXCEEDED_ERR 을 발생한다.
    - clear()를 호출할 때에는 아무 동작을 수행하지 않는다. 에러를 발생하지도 않는다.

- 크롬은 localStorage로 SQLite 를 사용하며, Mac OS 에서는 해당 파일을 아래 디렉토리에 저장한다.
    - ~/Library/Application Support/Google/Chrome/Default/Local Storage

- File I/O가 매번 발생을 하여 성능이 좋지 않다.


##추가 확인해보아야 할 부분
 - 로컬캐시
 - 쿠키
 - session 스토리지

---

#막대챠트 그리기

##라이브러리 종류
 - 구글차트 API : https://developers.google.com/chart/. 막대차트 : https://google-developers.appspot.com/chart/interactive/docs/gallery/columnchart
 - 차트 API : http://www.chartjs.org/ http://www.chartjs.org/docs/
 - 캔버스 API : http://canvasjs.com/
 - d3 : SVG, Canvas를 이용한 표준 챠트 작성 라이브러리

###라이브러리 선정 기준
 - 라이선스 이슈 없는 것 
 - 빨리 배울수 있는것 (1.morris / 2.ember / 3.chart / 4.chartist)

 참고사이트 : http://www.fusioncharts.com/javascript-charts-guide/ 
           http://www.fusioncharts.com/javascript-charting-comparison/
   1. 여러종류의 브라우저 지원 
   2. 여러종류의 장비 지원(모바일, 데스크톱)
   3. 데이터양식(XML, JSON ... ) 
   4. 수정의 용이성 
   5. 
   6. 러닝커브(배우는 소요시간)
   8. 성능
   9. 파일화(JPG, PNG, PDF, SVG ...)
   10. 최신 디자인 반영
   11. 커뮤니티 활성화
   12. 접근성
   13. 비용
   14. 
---

