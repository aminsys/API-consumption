// Notice that APIs can have CORS on, and those requests will not be accepted if the server doesn't allow for CORS 
// (Cross-Origin Resource Sharing).

var elChart = null;
var xValues = [];
var yValues = [];

function load() {
    elChart = new Chart("elChart", {
        type: "line",
        data: {
            labels: xValues,
            datasets: [
                {
                    label: "Elpriser i Malmö",
                    backgroundColor:"rgba(0,0,255,1.0)",
                    borderColor: "rgba(0,0,255,0.1)",
                    data: yValues
                }
            ],
            borderWidth: 2
        },
        options: {
            scales: {
            }
        }
    });

    fetch("https://fdh-api.fifa.com/v1/stats/season/285026/team/1884881.json")
    .then((response) => response.json())
    .then((data) => console.log(data));
}


async function getData(){
    var req = new XMLHttpRequest();
    var date = new Date();
    var elpriser = null;
    var year = date.toISOString().substring(0,4)
    date = date.toISOString().substring(5,10);

    req.open("GET", "https://www.elprisetjustnu.se/api/v1/prices/"+year+"/"+date+"_SE4.json");
    
    req.onload = function() {
        
        elpriser = JSON.parse(req.response);
        var data = document.getElementById("elTable");
        
        for(i = 0; i < elpriser.length; i++){
            xValues.push(new Date(elpriser[i].time_start).toLocaleString().substring(10));
            yValues.push(elpriser[i].SEK_per_kWh);

            data.innerHTML +=
            "<tr>"
            + "<td scope=\"row\">" + new Date(elpriser[i].time_start).toLocaleString()+ "</td>"
            + "<td>" + elpriser[i].SEK_per_kWh + "</td>"
            + "</tr>"
      
        }
        elChart.update();
    }

    req.send();

    // ===================================================== //
    // Another way to consume REST API - Anime quotes

    var animeQuote = document.getElementById("quote");

    try {
        var response = await fetch("https://animechan.xyz/api/random");  
        var quote = await response.json();    
    }
    catch(e){
        console.log("Somethig went wrong...");
    }
    
    animeQuote.innerHTML = "<h2>"+quote.anime+"</h2>" + "<h4>"+quote.character+"</h4>" + quote.quote;
    elChart.render();
}