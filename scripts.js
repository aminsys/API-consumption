// Notice that APIs can have CORS on, and those requests will not be 
// accepted if the server doesn't allow for CORS 
// (Cross-Origin Resource Sharing).

var elChart = null;
var xValues = [];
var yValues = [];

var downloadableData = null;

var FifaCountries2023 = {
    "BRA": 1882881,
    "SWE": 1882883,
    "ARG": 1884881,
    "AUS": 1882891,
    "CAN": 1883718,
    "CHN": 1882892,
    "COL": 1885035,
    "CRC": 1884880,
    "DEN": 1883719,
    "ENG": 1883720,
    "FRA": 1884761,
    "GER": 1882879,
    "HAI": 1885012,
    "ITA": 1883722,
    "JAM": 1885011,
    "JPN": 1883723,
    "KOR": 1885010,
    "MAR": 1884821,
    "NED": 1884883,
    "NZL": 1883725,
    "NGA": 1882893,
    "NOR": 1882882,
    "PAN": 1889512,
    "PHI": 1885027,
    "POR": 1884822,
    "IRL": 1884884,
    "RSA": 1885031,
    "ESP": 1884823,
    "SUI": 1884203,
    "USA": 1882884,
    "VIE": 1886308,
    "ZAM": 1885017
}

function load() {
    elChart = new Chart("elChart", {
        type: "line",
        data: {
            labels: xValues,
            datasets: [
                {
                    label: "Elpriser i Malmö",
                    backgroundColor: "rgba(0,0,255,1.0)",
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
}

async function getData() {
    var req = new XMLHttpRequest();
    var date = new Date();
    var elpriser = null;
    var year = date.toISOString().substring(0, 4)
    date = date.toISOString().substring(5, 10);

    req.open("GET", "https://www.elprisetjustnu.se/api/v1/prices/" + year + "/" + date + "_SE4.json");

    req.onload = function () {

        elpriser = JSON.parse(req.response);
        var data = document.getElementById("elTable");

        for (i = 0; i < elpriser.length; i++) {
            xValues.push(new Date(elpriser[i].time_start).toLocaleString().substring(10));
            yValues.push(elpriser[i].SEK_per_kWh);

            data.innerHTML +=
                "<tr>"
                + "<td scope=\"row\">" + new Date(elpriser[i].time_start).toLocaleString() + "</td>"
                + "<td>" + elpriser[i].SEK_per_kWh + "</td>"
                + "</tr>"

        }
        elChart.update();
    }

    req.send();
    elChart.render();

}

// ===================================================== //

function chooseRandomCountry() {
    let length = Object.keys(FifaCountries2023).length;
    let keyArray = Object.keys(FifaCountries2023);
    return keyArray[Math.floor(Math.random() * length)];
}

// Another way to consume REST API with JQuery - Statistics from FIFA API.
function getStatsSwedenFifa2023(country) {
    // FIFA Women’s World Cup Australia & New Zealand 2023™
    var randomCountry = chooseRandomCountry();
    
    var url = "https://fdh-api.fifa.com/v1/stats/season/285026/team/" + FifaCountries2023[randomCountry] + ".json";

    $("#DamVMStats").empty();

    $("#flag").attr("src", "https://api.fifa.com/api/v3/picture/flags-sq-4/" + randomCountry);

    $.ajax({
        type: "GET",
        url: url,
        dataType: 'json',
        cache: false,
        success: function (data) {
            for (i = 0; i < data.length; i++) {
                $("#DamVMStats").append("<div class=\"card p-2 m-2\"><div class=\"card-body\"><h5 class=\"card-title\">" + data[i][0].replace(/([A-Z])/g, ' $1').trim() + "</h5>" + "<span class=\"player-stats-card_number\">" + data[i][1] + "</span>" + "</div></div>");
            }
            downloadableData = data;
        }
    });
}


function saveJSONDataToFile(content = downloadableData, fileName = "statistics_WWC2023.json", contentType = "text/json") {
    var a = document.createElement("a");
    var file = new Blob([content], {type: contentType});
    a.href = URL.createObjectURL(file);
    a.download = fileName;
    a.click();
}