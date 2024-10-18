let DataP1 = [];
let DataP2 = [];
let DataP3 = [];
let DataP4 = [];
let DataO = [];
let lastYear = [];
let lastProvisions= 0;
let actualX = [];
let actualY = [];
let predictedX = [];
let predictedY = [];
let run = 0;
let layout = {
  title: "Anzahl Schüler/innen Total",
  xaxis: {
    title: "Jahre"
  },
  yaxis: {
    title: "Anzahl Schüler/innen"
  },
};
//initialisation of first NN
const NNProvisions = {
  "type": "NeuralNetwork",
  "sizes": [
    2,
    3,
    1
  ],
  "layers": [
    {
      "weights": [],
      "biases": []
    },
    {
      "weights": [
        [
          -67.16876983642578,
          -1.9622807502746582
        ],
        [
          -237.4607696533203,
          18.286945343017578
        ],
        [
          -340.6522216796875,
          -16.18168830871582
        ]
      ],
      "biases": [
        20.04331398010254,
        81.36259460449219,
        70.14830017089844
      ]
    },
    {
      "weights": [
        [
          -1.6398837566375732,
          -35.22098159790039,
          -2.4251744747161865
        ]
      ],
      "biases": [
        35.8411979675293
      ]
    }
  ],
  "inputLookup": null,
  "inputLookupLength": 0,
  "outputLookup": null,
  "outputLookupLength": 0,
  "options": {
    "inputSize": 0,
    "outputSize": 0,
    "binaryThresh": 0.5,
    "hiddenLayers": [
      3
    ],
    "activation": "sigmoid"
  },
  "trainOpts": {
    "activation": "sigmoid",
    "iterations": 2000000,
    "errorThresh": 0.005,
    "log": true,
    "logPeriod": 1000,
    "leakyReluAlpha": 0.01,
    "learningRate": 0.3,
    "momentum": 0.1,
    "callbackPeriod": 10,
    "timeout": "Infinity",
    "beta1": 0.9,
    "beta2": 0.999,
    "epsilon": 1e-8
  }
};
const netP = new brain.NeuralNetwork();
netP.fromJSON(NNProvisions);
//initialisation of second NN
const NNOther = {
    "type": "NeuralNetwork",
    "sizes": [
      4,
      4,
      1
    ],
    "layers": [
      {
        "weights": [],
        "biases": []
      },
      {
        "weights": [
          [
            -0.04702765494585037,
            0.5731619596481323,
            0.8568711280822754,
            -1.5305781364440918
          ],
          [
            0.15117421746253967,
            0.7996319532394409,
            0.8258014917373657,
            -2.8698813915252686
          ],
          [
            0.7988486289978027,
            0.6337463855743408,
            1.1843862533569336,
            -5.4886298179626465
          ],
          [
            1.5158520936965942,
            0.7943856716156006,
            0.9304742813110352,
            -7.895562171936035
          ]
        ],
        "biases": [
          -0.8047791123390198,
          -0.7974799871444702,
          -0.2561436891555786,
          -0.007420191541314125
        ]
      },
      {
        "weights": [
          [
            -0.590339720249176,
            -1.9038047790527344,
            -4.386959552764893,
            -6.765768527984619
          ]
        ],
        "biases": [
          3.9432859420776367
        ]
      }
    ],
    "inputLookup": null,
    "inputLookupLength": 0,
    "outputLookup": null,
    "outputLookupLength": 0,
    "options": {
      "inputSize": 0,
      "outputSize": 0,
      "binaryThresh": 0.5,
      "hiddenLayers": [
        4
      ],
      "activation": "sigmoid"
    },
    "trainOpts": {
      "activation": "sigmoid",
      "iterations": 1500000,
      "errorThresh": 0.00005,
      "log": true,
      "logPeriod": 1000,
      "leakyReluAlpha": 0.01,
      "learningRate": 0.3,
      "momentum": 0.1,
      "callbackPeriod": 10,
      "timeout": "Infinity",
      "beta1": 0.9,
      "beta2": 0.999,
      "epsilon": 1e-8
    }
  
};
const netO = new brain.NeuralNetwork();
netO.fromJSON(NNOther);

const tableBody = document.querySelector("#Table tbody");
const outputCont = document.getElementById("goal")
//process of first Excel file
function processExcelFileP(file) {
    const reader = new FileReader();

    reader.onload = function(e) {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetNames = workbook.SheetNames;

        if (sheetNames.length == 4) {  
            DataP1 = processSheet(workbook.Sheets[sheetNames[0]]);
            DataP2 = processSheet(workbook.Sheets[sheetNames[1]]);
            DataP3 = processSheet(workbook.Sheets[sheetNames[2]]);
            DataP4 = processSheet(workbook.Sheets[sheetNames[3]]);

        } else {
            console.error("The Excel file must contain 4 sheets.");
        }
        run++;
    };

    reader.readAsArrayBuffer(file); 
}
function processSheet(sheet) {
    const jsonData = XLSX.utils.sheet_to_json(sheet);
    return jsonData.map(row => [
        row['Birth']/1000,
        row['Gender'] === 'm' ? 1 : 0             // Gender: male = 1, female = 0
    ]);
}
//process of second Excel file
function processExcelFileO(file) {
    const reader = new FileReader();
    
    reader.onload = function(e) {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheet = workbook.SheetNames[0];  
        const sheet1 = workbook.Sheets[firstSheet];
        const secondSheet = workbook.SheetNames[1];  
        const sheet2 = workbook.Sheets[secondSheet];
        
        const jsonData1 = XLSX.utils.sheet_to_json(sheet1);

        DataO = jsonData1.map(row => [
            row['Geburte 1']/100, 
            row['Geburte 2']/100,   

        ]);
         
        const jsonData2 = XLSX.utils.sheet_to_json(sheet2);
        const lastRowIndex = jsonData2.length - 1;
        lastYear = [
            jsonData2[lastRowIndex]['KG 1'],
            jsonData2[lastRowIndex]['KG 2'],
            jsonData2[lastRowIndex]['1'],
            jsonData2[lastRowIndex]['2'],
            jsonData2[lastRowIndex]['3'],
            jsonData2[lastRowIndex]['4'],
            jsonData2[lastRowIndex]['5'],
            jsonData2[lastRowIndex]['6'],
        ];
        lastProvisions = jsonData2[0]['Zurückgestellt']; 
        // Output the data for verification
        console.log("Formatted DataO:", DataO);
        // Enable the test button
        run++;
    };
    
    reader.readAsArrayBuffer(file);  // Read the file as an ArrayBuffer
}
//process of third Excel file
function processExcelFileS(file){
    const reader = new FileReader();
    
    reader.onload = function(e) {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheet = workbook.SheetNames[0];  
        const sheet1 = workbook.Sheets[firstSheet];        
        // Convert the sheet to JSON
        const jsonData1 = XLSX.utils.sheet_to_json(sheet1);

        actualY = jsonData1.map(row => [
            row['Total']
          ]);
        actualX = jsonData1.map(row => [
            row['Jahr']
        ]);
        console.log(actualY);
        if(run ==2){
          document.getElementById('runButton').disabled = false;
        }
    };
    
    reader.readAsArrayBuffer(file);  // Read the file as an ArrayBuffer
}
//function for adding values to the table
function populateTable(data){
  tableBody.innerHTML = '';
  data.forEach(rowData => {
    const row = document.createElement("tr");
    const yearCell = document.createElement("td");
    yearCell.textContent = rowData[0];
    row.appendChild(yearCell);
    const KG1Cell = document.createElement("td");
    KG1Cell.textContent = rowData[1];
    row.appendChild(KG1Cell);
    const KG2Cell = document.createElement("td");
    KG2Cell.textContent = rowData[2];
    row.appendChild(KG2Cell);
    const firstCell = document.createElement("td");
    firstCell.textContent = rowData[3];
    row.appendChild(firstCell);
    const secondCell = document.createElement("td");
    secondCell.textContent = rowData[4];
    row.appendChild(secondCell);
    const thirdCell = document.createElement("td");
    thirdCell.textContent = rowData[5];
    row.appendChild(thirdCell);
    const forthCell = document.createElement("td");
    forthCell.textContent = rowData[6];
    row.appendChild(forthCell);
    const fifthCell = document.createElement("td");
    fifthCell.textContent = rowData[7];
    row.appendChild(fifthCell);
    const sixthCell = document.createElement("td");
    sixthCell.textContent = rowData[8];
    row.appendChild(sixthCell);
    const totalCell = document.createElement("td");
    totalCell.textContent = rowData[9];
    row.appendChild(totalCell);

    tableBody.appendChild(row);
  });
}
//scrolling animation, when button pressed
function scrollToPoint() {
  document.getElementById('goal').scrollIntoView({
    behavior: 'smooth' 
  });
} 
//trend line calculation for the chart
function calculateTrendline(x, y) {
  let n = x.length;
  console.log("x for trend: " + x + " y for trend: "+ y)
  let sumX = 0, sumY = 0, sumXY = 0, sumXX = 0;
  
  for (let i = 0; i < n; i++) {
    sumX += x[i];
    sumY += y[i];
    sumXY += x[i] * y[i];
    sumXX += x[i] * x[i];
  }
  let slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
  let intercept = (sumY - slope * sumX) / n;

  let trendY = x.map(function(val) {
    return slope * val + intercept;
  });

  return trendY;
}
//trigger for the processing of the first file
document.getElementById('fileP').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
        processExcelFileP(file);
    }
});
//trigger for the processing of the second file
document.getElementById('fileO').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
        processExcelFileO(file);
    }
});
//trigger for the processing of the second file
document.getElementById('fileS').addEventListener('change', function(event) {
  const file = event.target.files[0];
  if (file) {
      processExcelFileS(file);
  }
});
//when button pressed
document.getElementById('runButton').addEventListener('click', function(){
  outputCont.style.opacity = "1";
  document.getElementById('runButton').disabled = true;
  actualX = actualX.flat();
  actualY = actualY.flat();
  let overall = [];
    let p1 = 0;
    let p2 = 0;
    let p3 = 0;
    let p4 = 0;
    let pArray = [lastProvisions, p1, p2, p3, p4]; 
    let DataPArray = [DataP1, DataP2, DataP3, DataP4]; 
    for (let l = 0; l < 4; l++) {
        let data = DataPArray[l]; 
        //calculating the number of deferrals using the first NN
        for (let i = 0; i < data.length; i++) {
            let q = netP.run(data[i]); 
            console.log(q)
            if (Math.round(q) === 1) {
              pArray[l+1]++;
            } 
            console.log("pArray"+(l+1)+": "+ pArray[l+1]) 
        }
    }
    let pArray100 = pArray.map(value => value / 100);
    //combining the data, as a preparation for the second NN
    let combinedData = DataO.map((innerArray, index) => {
      return [...innerArray, pArray100[index+1]];
  });
  let combinedData2 = combinedData.map((innerArray, index) => {
    return [...innerArray, pArray100[index]];
});
//calculating the number of KG 1 students and shifting the students of the old classes to the new ones
for (let i = 0; i < 4; i++) {
    output = netO.run(combinedData2[i]) * 100; 
    lastYear.unshift(Math.round(output)); 
    if (lastYear.length > 8) { 
      lastYear.pop(); 
  }
    let total = 0;
    lastYear.forEach((students)=> total += students)
    console.log("In " + (i + 1) + " year: " + lastYear);
    console.log("There will be a total of: " + total + " Students");
    //preparing data for the chart
    let copyLastYear = lastYear.slice();
    copyLastYear.push(total);
    copyLastYear.unshift(i+1);
    predictedY.push(total);
    predictedX.push(actualX[actualX.length-1] +i +1);
    overall.push(copyLastYear);
}
combinedX = actualX.concat(predictedX);
combinedY = actualY.concat(predictedY);
predictedX.unshift(actualX[actualX.length-1])
predictedY.unshift(actualY[actualY.length-1])
let trendY = calculateTrendline(combinedX, combinedY);
//setting the parameters of the chart (for the API)
populateTable(overall);
let actual = {
  x: actualX,
  y: actualY,
  mode: "lines",
  name: "vergangene Zahlen",
  line: {
    color: "blue",
    width: 2
  }
};
let prediction = {
  x: predictedX,
  y: predictedY,
  mode: "lines",
  name: "vorhergesagte Zahlen",
  line: {
    color: "red",
    width: 2,
    dash: "dash"  
  }
};
let trend = {
  x: combinedX,
  y: trendY,
  mode: "lines",
  name: "Trendlinie",
  line: {
    color: "green",
    width: 2,
    dash: "dot" 
  }
};
//initialisation of the line chart
let data = [actual, prediction, trend];
Plotly.newPlot('line-chart', data, layout);

});