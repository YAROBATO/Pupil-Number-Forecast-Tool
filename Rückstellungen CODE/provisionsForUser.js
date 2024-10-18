//this file was manly used for testing purposes

let Data = [];
const savedNetwork = {
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
  
  document.getElementById('fileInputTest').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
        processExcelFile(file);
    }
});
//initialisation of the NN
  const net = new brain.NeuralNetwork();
  net.fromJSON(savedNetwork);
  
  function processExcelFile(file) {
    const reader = new FileReader();
    
    reader.onload = function(e) {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheet = workbook.SheetNames[0];
        const sheet = workbook.Sheets[firstSheet];
        
        const jsonData = XLSX.utils.sheet_to_json(sheet);

        Data = jsonData.map(row => [
            row['Birth']/1000,
            row['Gender'] === 'm' ? 1 : 0   // Gender: male = 1, female = 0
        ]);

        console.log("Formatted Data:", Data);
        document.getElementById('runButton').disabled = false;
    };
    
    reader.readAsArrayBuffer(file); 
}

document.getElementById('runButton').addEventListener('click', function() {
    let provisions = 0
    let provisionsSet = []
    let allQValues = [];
    for(let i = 0; i < Data.length; i++){
        let q = net.run(Data[i]);
        allQValues.push(q);
        if (Math.round(q) === 1){
            provisions++
            provisionsSet.push(q)
        }
    }
    console.log(allQValues)
    let allProvisions = 0;
    for (let l = 0; l < provisionsSet.length; l++) {
        allProvisions += provisionsSet[l][0];
    }
    document.getElementById('result').innerHTML = "There will be "+ provisions +" provisions, with an average probability of "+ 
        (allProvisions/provisionsSet.length)*100 + "%" + "<br>" +
        "All Q values:<br>" +
        allQValues.map(function(num) {
            return Math.round(num).toString(); 
        }).join('<br>');
});

