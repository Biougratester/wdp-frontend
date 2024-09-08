

var BackEndServer = "https://watertestingapi.pythonanywhere.com";
var donutChart;

async function prediction(){
    let elements = document.getElementsByTagName("input");
    predictionData = {};
    for(let i = 0; i< 10;i++){
        if(elements[i].value){
            predictionData[elements[i].name] = elements[i].value;
        }else{
            predictionData[elements[i].name] = 0;
        }
    }
    
    var resp = await fetch(BackEndServer+"/predict" ,{
        method:"POST",
        headers:{
            "Access-Control-Allow-Origin":"*" ,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(predictionData),
    })
    var resptxt = await resp.json()
    console.log(resptxt)
    let pclass,conf;
    if(parseFloat(resptxt.confidence_1)>0.5){
        pclass = resptxt.class_1
        conf = parseFloat(resptxt.confidence_1)
    }else{
        conf = parseFloat(resptxt.confidence_2)
        pclass = resptxt.class_2
    }
    document.getElementById("drinkability").innerHTML = pclass;
    document.getElementById("confidence").innerHTML = conf;
    document.getElementById("ndrinable-conf").innerHTML = parseFloat(resptxt.confidence_2)*100;
    document.getElementById("drinkable-conf").innerHTML = parseFloat(resptxt.confidence_1)*100;
    if(document.getElementById("predictionPlacement").style.display == "block"){
        donutChart.data.datasets[0].data = [ parseFloat(resptxt.confidence_1)*100, parseFloat(resptxt.confidence_2)*100];
        donutChart.update();
    }else{
        document.getElementById("predictionPlacement").style.display = "block";
        donutChart = new Chart(document.getElementById("predictionChart"), {
            type: "doughnut",
            data: {
            labels: [resptxt.class_1, resptxt.class_2],
            datasets: [{
                data: [ parseFloat(resptxt.confidence_1)*100, parseFloat(resptxt.confidence_2)*100],
                backgroundColor: [
                "#253efa",
                "#ff0055"
                ],
                borderColor: "transparent"
            }]
            },
            options: {
            maintainAspectRatio: false,
            cutoutPercentage: 65,
            }
        });
    }
   
    
}
