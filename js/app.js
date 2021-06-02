// framework7
var $$ = Dom7;
app = new Framework7({
  root: "#app",
  theme: "md",
  routes,
});
var navsound = new sound("./soundlibrary/systemsounds/navsound.mp3");
var bgsound = new sound("./soundlibrary/backgroundsounds/ps5example.mp3");
var bgRequest = new XMLHttpRequest();
var appWrapper = document.getElementById('appWrapper')
var bgWrapper = document.getElementById("bgWrapper")
var bgMute = false;
var isActive = false;
var actTime;
var weatherOn = false
var weatherCond = [
  {
    1000: 0,
    1003: 1,
    1006: 2,
    1009: 3,
    1030: 4,
    1063: 5,
    1072: 6,
    1087: 7,
    1135: 8,
    1147: 5,
    1150: 5,
    1153: 5,
    1168: 6,
    1171: 6,
    1180: 6,
    1183: 6,
    1186: 9,
    1189: 9,
    1192: 9,
    1195: 9,
    1198: 6,
    1201: 9,
    1240: 6,
    1243: 6,
    1646: 9,
    1273: 9,
    1276: 9,
  },
  [
    {
      //1
      d: 'sunny.png',
      n: 'clear.png',
    },
    {
      //2
      d: 'partlycloudy.png',
      n: 'cloudynight.png',
    },
    {
      //3
      d: 'cloudyday.png',
      n: 'cloudyday.png',
    },
    {
      //4
      d: 'mistsunny.png',
      n: 'mistnight.png',
    },
    {
      //5
      d: 'mist.png',
      n: 'mist.png',
    },
    {
      //6
      d: 'partlydrizzle.png',
      n: 'chanceofrainnight.png',
    },
    {
      //7
      d: 'rainy.png',
      n: 'rainy.png',
    },
    {
      //8
      d: 'chanceofthunder.png',
      n: 'chanceofthundernight.png',
    },
    {
      //9
      d: 'mistsunny.png',
      n: 'mist.png',
    },
    {
      //10
      d: 'thunderstorm.png',
      n: 'thunderstorm.png',
    },
  ],
];
function showTime() {
  var date = new Date();
  var h = date.getHours(); // 0 - 23
  var m = date.getMinutes(); // 0 - 59
  var session = "AM";

  if (h == 0) {
    h = 12;
  }

  if (h > 12) {
    h = h - 12;
    session = "PM";
  }

  h = (h < 10) ? "0" + h : h;
  m = (m < 10) ? "0" + m : m;
  var time = h + ":" + m + " " + session;
  document.getElementById("clockDisplay").innerText = time;
  document.getElementById("clockDisplay").textContent = time;

  setTimeout(showTime, 1000);

}
function insertWeather(wData) {

  if (wData.current.is_day) {
    var wCond = weatherCond[1][weatherCond[0][wData.current.condition.code]]["d"];
  } else {
    var wCond = weatherCond[1][weatherCond[0][wData.current.condition.code]]["n"];
  }
  if (weatherOn === false) {
    weatherOn = true
    $("#weatherDisplay").before("<img id='wDImg' class='wDImg margin-bottom margin-top' src=../img/weathericons/" + wCond + ">");
  } else {
    document.getElementById('wDImg').src = '../img/weathericons/' + wCond
  }
  document.getElementById("weatherDisplay").innerText = ' ' + wData.current.feelslike_c.toString().split(".")[0] + '° C〡'
}
function getWeather() {
  $.getJSON("https://api.ipify.org?format=json",
    function (data) {
      var geoip = data.ip
      weatherRequest.open("GET", "https://api.weatherapi.com/v1/current.json?key=1d88cb9bf5894e7a97b175605212805&q=" + geoip + "&aqi=no", true);
      weatherRequest.send();
      setTimeout(getWeather, 100000)
    })
}
var weatherRequest = new XMLHttpRequest();
weatherRequest.onreadystatechange = function () {
  if (this.readyState == 4 && this.status == 200) {
    var weatherData = JSON.parse(this.response)
    insertWeather(weatherData)
  }
};
function sound(src) {
  this.sound = document.createElement("audio");
  this.sound.src = src;
  this.sound.setAttribute("preload", "auto");
  this.sound.setAttribute("controls", "none");
  this.sound.style.display = "none";
  document.body.appendChild(this.sound);
  this.play = function () {
    this.sound.play();
  }
  this.stop = function () {
    this.sound.pause();
  }
  this.loop = function () {
    this.sound.setAttribute("loop", "");
  }
}
bgRequest.onreadystatechange = function () {
  if (this.readyState == 4 && this.status == 200) {
    bgLibrary = JSON.parse(this.response)
    insertBg(bgLibrary)
  }
};
//endpoint
function insertBg(bData) {
  globalThis.bgData = bData.bg
  var bEl = `<div id="bgDynaCont" class="swiper-slide appBgCont"><iframe data-ix="0" id="bgDynamic" class="appBgImg bgDynamic"src="/userassets/backgroundlibrary/${bgData[0].folder}/${bgData[0].page}"></iframe><div class="bgDynamicP"></div></div>`
  bgWrapper.innerHTML += bEl
  for (i in appsData) {
    var aEl = `<div class="swiper-slide"><img onclick="switchApps(${Number(i) + 4})" id="a${Number(i) + 1}" data-name="${appsData[i].name}" class="appCont" src="./userassets/appslibrary/${appsData[i].folder}/${appsData[i].icon}"></div>`
    bEl = ` <div class="swiper-slide appBgCont"><img class="appBgImg"src="./userassets/appslibrary/${appsData[i].folder}/${appsData[i].bg}"></div>`
    appWrapper.innerHTML += aEl
    bgWrapper.innerHTML += bEl
  }
  var aElT;
  for (aElT = 0; aElT < 5; aElT++) {
    appWrapper.innerHTML += `<div class="swiper-slide"></div>`
  }
  globalThis.appNum = appsData.length + 3
  globalThis.backgroundSlide = new Swiper('.background-slide', {
    effect: 'fade',
    allowTouchMove: false
  });
  globalThis.appsSlide = new Swiper('.apps-slide', {
    allowTouchMove: false,
    slidesPerView: 6
  });
  appsSlide.slideTo(3)
}
function getBg() {
  bgRequest.open("GET", "./userassets/backgroundlibrary/bgassets.json", true);
  bgRequest.send();
}
var appsRequest = new XMLHttpRequest();
appsRequest.onreadystatechange = function () {
  if (this.readyState == 4 && this.status == 200) {
    var appsLibrary = JSON.parse(this.response)
    insertApps(appsLibrary)
  }
};
function insertApps(aData) {
  globalThis.appsData = aData.apps
  getBg()
}
function getApps() {
  appsRequest.open("GET", "./userassets/appslibrary/appslibrary.json", true);
  appsRequest.send();
}
function switchApps(ix) {
  navsound.play()
  var acX = appsSlide.activeIndex
  backgroundSlide.slideTo(ix - 3)
  appsSlide.slideTo(ix)
  document.getElementById(`a${acX - 3}`).classList.remove("appActive")
  document.getElementById(`a${ix - 3}`).classList.add("appActive")
  document.getElementById("appName").innerText = document.getElementById(`a${ix - 3}`).getAttribute("data-name")
  document.getElementById('playB').style.display = "initial";
}
function getControls() {
  document.addEventListener('keydown', function (event) {
    var acX = appsSlide.activeIndex
    if (isActive == false) {
      isActive = true
      backgroundSlide.slideTo(acX - 3)
      $(".uiHeadCont").fadeIn()
      $(".apps-slide").fadeIn()
      if (acX > 3) {
        $(".appStart").fadeIn()
      }
    }
    actTime = new Date().getTime()
    if (event.key === 'a' || event.key === 'A' || event.key === "ArrowLeft") {
      navsound.play()
      if (acX > 3) {
        backgroundSlide.slidePrev()
        appsSlide.slidePrev()
        document.getElementById(`a${acX - 3}`).classList.remove("appActive")
        document.getElementById(`a${acX - 4}`).classList.add("appActive")
        document.getElementById("appName").innerText = document.getElementById(`a${acX - 4}`).getAttribute("data-name")
      }
      if (appsSlide.activeIndex == 3) {
        document.getElementById('playB').style.display = "none";
      }
    }
    if (event.key === 'd' || event.key === 'D' || event.key === "ArrowRight") {
      navsound.play()
      if (acX < appNum) {
        backgroundSlide.slideNext()
        appsSlide.slideNext()
        document.getElementById(`a${acX - 3}`).classList.remove("appActive")
        document.getElementById(`a${acX - 2}`).classList.add("appActive")
        document.getElementById("appName").innerText = document.getElementById(`a${acX - 2}`).getAttribute("data-name")
      }
      if (appsSlide.activeIndex == 4) {
        document.getElementById('playB').style.display = "initial";
      }
    }
    if (event.key === ",") {
      navsound.play()
      var bgDynamic = Number(document.getElementById("bgDynamic").getAttribute("data-ix"))
      if (bgDynamic > 0) {
        $("#bgDynamic").fadeOut()
        setTimeout(function () {
          document.getElementById("bgDynamic").remove
          document.getElementById("bgDynaCont").innerHTML = `<iframe data-ix="${bgDynamic - 1}" id="bgDynamic" class="appBgImg bgDynamic"src="/userassets/backgroundlibrary/${bgData[bgDynamic - 1].folder}/${bgData[bgDynamic - 1].page}"></iframe>`
        }, 2000)
      }
    }
    if (event.key === ".") {
      navsound.play()
      var bgDynamic = Number(document.getElementById("bgDynamic").getAttribute("data-ix"))
      if (bgDynamic < bgData.length - 1) {
        $("#bgDynamic").fadeOut()
        setTimeout(function () {
          document.getElementById("bgDynamic").remove
          document.getElementById("bgDynaCont").innerHTML = `<iframe data-ix="${bgDynamic + 1}" id="bgDynamic" class="appBgImg bgDynamic"src="/userassets/backgroundlibrary/${bgData[bgDynamic + 1].folder}/${bgData[bgDynamic + 1].page}"></iframe>`
        }, 2000)
      }
    }
    if (event.key === "h" || event.key === 'H') {
      if (acX > 3) {
        backgroundSlide.slideTo(0)
        appsSlide.slideTo(3)
        document.getElementById(`a${acX - 3}`).classList.remove("appActive")
        document.getElementById(`a0`).classList.add("appActive")
        document.getElementById("appName").innerText = "Home"
      }
      if (appsSlide.activeIndex == 3) {
        document.getElementById('playB').style.display = "none";
      }
    }
    if (event.key === "m" || event.key === 'M') {
      if (bgMute == false) {
        bgsound.stop();
        bgMute = true;
      } else {
        bgsound.play()
        bgMute = false;
      }
    }
    if (event.key === "q" || event.key === 'Q') {
      isActive = false;
      backgroundSlide.slideTo(0)
      $(".uiHeadCont").fadeOut()
      $(".apps-slide").fadeOut()
      $(".appStart").fadeOut()
    }
  });
}
function startApp() {
  var acX = appsSlide.activeIndex - 4
  ws.send(appsData[acX].folder)
};
function initiateUI() {
  showTime();
  setTimeout(function () {
    getApps();
    $(".background-slide").fadeIn()
    $("#uiHead").fadeIn()
    setInterval(function () {
      if (isActive == true) {
        if (new Date().getTime() - actTime > 50000) {
          isActive = false;
          backgroundSlide.slideTo(0)
          $(".uiHeadCont").fadeOut()
          $(".apps-slide").fadeOut()
          $(".appStart").fadeOut()
        }
      }
    }, 10000);
    actTime = new Date().getTime()
    isActive = true
  }, 3000)
  getControls();
  try {
    getWeather();
  } catch { ; }
}
bgsound.play();
bgsound.loop()
initiateUI();
var ws = new WebSocket("ws://127.0.0.1:20216/");
ws.onmessage = function (event) {
  isActive = false;
  $(".uiHeadCont").fadeOut()
  $(".apps-slide").fadeOut()
  $(".appStart").fadeOut()
  bgsound.stop()
}
ws.onclose = function (event) {
  $(".appStart").remove()
  document.getElementById("appName").innerText = "Error :( Bluebird server is not running. Restart server and click here to refresh!"
  document.getElementById("appName").setAttribute("onclick", "window.location.reload()")
  document.getElementById("appName").id = "errormsg"
};
