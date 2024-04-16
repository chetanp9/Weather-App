//tabs fecthing
const userTab=document.querySelector("[data-userWeather]");
const searchTab=document.querySelector("[data-searchWeather]");
const userContainer =document.querySelector(".weather-container");
const grantAcessconrainer=document.querySelector(".grant-location-container");
const serchForm=document.querySelector("[data-searchform]");
const loadingScreen=document.querySelector(".loading-container");
const userInfoContainer=document.querySelector(".user-info-container");


//variables 

let oldTab=userTab;
const API_KEY="7802dd491ef43404d1fa8e8b04fd7a57";
oldTab.classList.add("current-tab");
getfromSessionStorage();


//pending work



function switchTab(newTab){
    if(newTab !=oldTab){
        oldTab.classList.remove("current-tab");
        oldTab=newTab;
        oldTab.classList.add("current-tab");


        if(!serchForm.classList.contains("active")){
            userInfoContainer.classList.remove("active");
            grantAcessconrainer.classList.remove("active");
            serchForm.classList.add("active");
        }
        else{
            //phele search wale tab per tha ab u=your weather tab per hu
            serchForm.classList.remove("active");
            userInfoContainer.classList.remove("active");
            //your weather tab wether display karo
            //for coordinamtes , if we haved saved them there.
            getfromSessionStorage();
        }
    }
}

userTab.addEventListener("click",()=>{

    //pass click tab as input parameter
    switchTab(userTab);

});

searchTab.addEventListener("click",()=>{
    switchTab(searchTab);
});


//check if coordinates are already present in seesion storage
function  getfromSessionStorage(){
    const localCoordinates=sessionStorage.getItem("user-coordinates");
    if(!localCoordinates){
        //locol coordinates not found
        grantAcessconrainer.classList.add("active");
    }
    else{
        const coordinates =JSON.parse(localCoordinates);
        fecthUserWeatherInfo(coordinates);
    }
}

 async function fecthUserWeatherInfo(coordinates){
    const{lat,lon}=coordinates;
    //make grantcontainer invisible
    grantAcessconrainer.classList.remove("active");
    //make loader visible
    loadingScreen.classList.add("active");
    //api call

    try{
        const res= await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);

        const data= await res.json();
        loadingScreen.classList.remove("active");

        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
    }
    catch(err){
        loadingScreen.classList.remove("active");
        //HW 

    }
}

function renderWeatherInfo(weatherinfo){
    //fetch the elements

    const cityName= document.querySelector("[data-cityName]");
    const countryIcon=document.querySelector("[data-countryIcon]");
    const desc =document.querySelector("[data-weatherDesc]");
    const weatherIcon=document.querySelector("[data-weatherIcon]");
    const temp=document.querySelector("[data-temp]");
    const windspeed=document.querySelector("[data-windspeed]");
    const humudity=document.querySelector("[data-humidity]");
    const cloudiness=document.querySelector("[data-cloudiness]");
    

    //fetch value from weather info object and put it UI elements
   cityName.innerText= weatherinfo?.name;
   countryIcon.src=`https://flagcdn.com/144x108/${weatherinfo?.sys?.country.toLowerCase()}.png`;
   desc.innerText=weatherinfo?.weather?.[0]?.description;
   weatherIcon.src=`http://openweathermap.org/img/w/${weatherinfo?.weather?.[0]?.icon}.png`;
   temp.innerText=`${weatherinfo?.main?.temp}°C`;
   windspeed.innerText=`${weatherinfo?.wind?.speed} m/s`;
   humudity.innerText=`${weatherinfo?.main?.humidity}%`;
   cloudiness.innerText=`${weatherinfo?.clouds?.all}%`;
}

function getLoction(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showposition);
    }
    else{
        //HM -alert for no geolocation support available
    }
}

function showposition(position){
    const userCoordinates={
        lat:position.coords.latitude,
        lon:position.coords.longitude,
    }
    sessionStorage.setItem("user-coordinates",JSON.stringify(userCoordinates));

    fecthUserWeatherInfo(userCoordinates);
}
const grantAcessButton=document.querySelector("[data-grantAccess]");
grantAcessButton.addEventListener("click",getLoction);

let searchInput=document.querySelector("[data-searchinput]");
serchForm.addEventListener("submit",(e)=>{
    e.preventDefault();
    if(searchInput.value==="")
     return;

    else
      fetchSearchWeatherInfo(searchInput.value);

});

async function fetchSearchWeatherInfo(city){
    loadingScreen.classList.add("active");
    userInfoContainer.classList.remove("active");
    grantAcessconrainer.classList.remove("active");

    try{
        const response=await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
        const data=await response.json();
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);

    }
    catch(err){

    }
}