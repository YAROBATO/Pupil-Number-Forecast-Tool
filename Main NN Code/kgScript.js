let trainingData = [];  
let testData = [];
let correctData = [];
//implementation of brain.js NN
const net = new brain.NeuralNetwork({
    hiddenLayers: [4], // hidden layers
    activation: 'sigmoid' // Aktivierungsfunktion
});
document.getElementById('fileInput').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
        processExcelFileTrain(file);
    }
});

document.getElementById('fileInput').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
        processExcelFileTest(file);
    }
});
//training data input
function processExcelFileTrain(file) {
    const reader = new FileReader();
    
    reader.onload = function(e) {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheet = workbook.SheetNames[0];
        const sheet = workbook.Sheets[firstSheet];
        

        const jsonData = XLSX.utils.sheet_to_json(sheet);

        trainingData = jsonData.map(row => {
            return {
                input: [
                    row['Geburte 1']/100, 
                    row['Geburte 2']/100,   
                    row['Zurückgestellt']/100,
                    row['Zurückgestellt letztes Jahr']/100,
                    //row['Zuzüge']/100,
                    //row['neue Zimmer 1']/100,
                    //row['neue Zimmer 2']/100
                ],
                output: [
                    row['Anzahl KG 1']/100, 
                ] 
            };
        });

        console.log("Formatted Training Data:", trainingData);        

        document.getElementById('trainButton').disabled = false;
    };
    
    reader.readAsArrayBuffer(file);  
}
//test data input
function processExcelFileTest(file) {
    const reader = new FileReader();
    
    reader.onload = function(e) {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const secondSheet = workbook.SheetNames[1];  
        const sheet2 = workbook.Sheets[secondSheet];
        const jsonData = XLSX.utils.sheet_to_json(sheet2);

        testData = jsonData.map(row => [
            row['Geburte 1']/100, 
            row['Geburte 2']/100,   
            row['Zurückgestellt']/100,
            row['Zurückgestellt letztes Jahr']/100,
            //row['Zuzüge']/100,
            //row['neue Zimmer 1']/100,
            //row['neue Zimmer 2']/100
        ]);
        correctData = jsonData.map(row => [
            row['Anzahl KG 1']
        ]);


        console.log("Formatted Test Data:", testData);
        console.log("Correct Solution:", correctData);
   
        document.getElementById('testButton').disabled = false;
    };
    
    reader.readAsArrayBuffer(file);
}
//training of the NN
document.getElementById('trainButton').addEventListener('click', function() {
    if (trainingData.length > 0) {
        net.train(trainingData,  // Use trainingData directly
            {
                iterations: 1500000,    // Number of training iterations
                errorThresh: 0.00005,    // Error threshold for stopping training
                log: true,             // Log training results
                logPeriod: 1000        // Logging interval
            });
            const json = net.toJSON();
            console.log(JSON.stringify(json, null, 2));
    } else {
        console.error("Training data is not defined.");
    }
});

//testing the trained NN
document.getElementById('testButton').addEventListener('click', function() {
    let deviation = 0;
    for(let i = 0; i < testData.length; i++){
        let q = net.run(testData[i])*100;
        console.log(q)
        deviation +=Math.abs(correctData[i]-q)
        
    }

    console.log("Average deviation: " + deviation/4);
});