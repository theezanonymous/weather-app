//https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/[location]/[date1]/[date2]?key=YOUR_API_KEY
//EL34NM8XBE8PNVXKF274QDPJG
//rOHJFjBkBjVzp0vZR9uKhrzF8igXaF31
//npx eslint
//npx prettier . --write
const date = new Date()
const currHour = date.getHours()

let currentCityData = null;
// async function setGif(s){
//     try{
//         if(s.includes(",")){
//             let idx = s.indexOf(",")
//             s = s.substring(0, idx)
//         }
//         const response = await fetch('https://api.giphy.com/v1/gifs/translate?api_key=rOHJFjBkBjVzp0vZR9uKhrzF8igXaF31&s=' + s, {mode: 'cors'});
//         const data = await response.json();
//         document.querySelector(".background").src = data.data.images.original.url;
//     }
//     catch(e){
//         console.log("gifnotfound")
//     }
// }
function convert(str){
    let x = parseFloat(str)
    let unit = document.querySelector(".unit").id;
    if(unit=="celsius"){
        x= (x-32)*5/9;
    }
    x = x.toString()
    return x.includes(".")?x.substring(0, x.indexOf(".")+2):x
}
function getInput(){
    let s = prompt("Enter a location: ")
    return s
}
function toggleLoading(){
    let e = document.querySelector(".loading")

    if(e.style.display =="block"){
        e.style.display = "none"
    }
    else{
        e.style.display = "block"
    }

}
async function fetchData(city){
    toggleLoading();
    try{
    let link = "https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/"+city+"?unitGroup=us&key=EL34NM8XBE8PNVXKF274QDPJG&contentType=json"
    //console.log(link)
    let data = await fetch(link,{mode: 'cors'})
    let json = await data.json()
    displayData(json)
}
    catch(e){
        displayError()
        console.log(e)
    }
    toggleLoading();

}
function displayData(json){

    document.querySelector(".city").innerText = json["resolvedAddress"];
    let today = json.days[0]
    document.querySelector(".deg").innerText = convert(today.temp) + "°"
    document.querySelector(".desc").innerText = today.conditions
    //setGif(today.conditions)
    document.querySelector(".lohi").innerText = "H: " +convert(today.tempmax) + "°  L: " + convert(today.tempmin);
    document.querySelector(".listDescription").innerText = today.description
    document.querySelector(".precip").innerText = today.precip
    document.querySelector(".wind").innerText = today.windspeed + "MPH"
    document.querySelector(".uv").innerText = today.uvindex;
    document.querySelector(".humid").innerText = today.humidity + "%"
    displayHourList(json);
}
function displayHourList(json){
    deleteChildren(document.querySelector(".hourList"))
    try{
    let idx = currHour;
    let days = json.days;
    for(let i = idx; i <idx+24; i++){
        let h = i %24; let d = Math.floor(i/24); 
        let curr = days[d].hours[h]
        let icon = curr.icon=="fog"?"cloudy":curr.icon;
        let t = curr.temp
        let e = document.createElement("div"); e.className = "hourContainer"
        let hour = document.createElement("div"); hour.className = "hour"
        let ext = ""
        if(h-12>=0){
            ext="PM"
        }
        else{
            ext="AM"
        }
        if(h!=12){
            h%=12;
        }
        if(h==0){
            h = 12;
        }
        hour.innerText = i==idx? "Now":h+ext;
        let img = document.createElement("img"); img.className = "icon"
        img.src = "./img/" + icon + ".png"
        let temp = document.createElement("div"); temp.className = "temp"
        temp.innerText = convert(t) + "°"
        e.appendChild(hour); e.appendChild(img); e.appendChild(temp);
        document.querySelector(".hourList").appendChild(e)
        document.querySelector("body").id = icon

    }
}
catch(e){
    console.log(e)
}

}
function deleteChildren(element){
    while (element.firstChild) { 
        element.removeChild(element.firstChild); 

    }
}
function displayError(){
    alert("Please enter a valid location.")
}
function changeUnit(){
    let e = document.querySelector(".unit")
    if(e.id=="fahrenheit"){
        e.id = "celsius"
    }
    else{
        e.id = "fahrenheit"
    }
}
let s = "cupertino"
fetchData(s)
document.querySelector(".submit").addEventListener("click", ()=>{
    let e = document.querySelector("#location")
    s = e.value; e.value = "";

    fetchData(s)

    
})
document.querySelector(".unit").addEventListener("click", ()=>{
    changeUnit(); fetchData(s)
})