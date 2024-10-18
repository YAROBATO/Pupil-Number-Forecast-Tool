//this file was manly used for test purposes (2nd approach las NN)
let trainingData = [];  
let testData = [];
let correctData = [];
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
                    row['Jahr bevor']/100, 
                    //row['Zuzüge']/1000,
                    //row['Wegzüge']/1000,
                    //row['neue Zimmer 1']/1000,
                    //row['neue Zimmer 2']/1000,
                    //row['Leerwohnungen']/1000
                ],
                output: [
                    row['Jahr jetzt']/100, 
                ] 
            };
        });

        // Output the data for verification
        console.log("Formatted Training Data:", trainingData);        
        // Enable the training button
        document.getElementById('trainButton').disabled = false;
    };
    
    reader.readAsArrayBuffer(file);  // Read the file as an ArrayBuffer
}

function processExcelFileTest(file) {
    const reader = new FileReader();
    
    reader.onload = function(e) {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const secondSheet = workbook.SheetNames[1];  
        const sheet2 = workbook.Sheets[secondSheet];
        
        // Convert the sheet to JSON
        const jsonData = XLSX.utils.sheet_to_json(sheet2);

        testData = jsonData.map(row => [
            row['Jahr bevor']/100, 
            //row['Zuzüge']/1000,
            //row['Wegzüge']/1000,
            //row['neue Zimmer 1']/1000,
            //row['neue Zimmer 2']/1000,
            //row['Leerwohnungen']/1000
        ]);
        correctData = jsonData.map(row => [
            row['Jahr jetzt']
        ]);

        // Output the data for verification
        console.log("Formatted Test Data:", testData);
        console.log("Correct Solution:", correctData);
        // Enable the test button
        document.getElementById('testButton').disabled = false;
    };
    
    reader.readAsArrayBuffer(file);  
}

document.getElementById('trainButton').addEventListener('click', function() {
    if (trainingData.length > 0) {
        net.train(trainingData,  
            {
                iterations: 300000,    // Number of training iterations
                errorThresh: 0.00001,    // Error threshold for stopping training
                log: true,             // Log training results
                logPeriod: 1000        // Logging interval
            });
            const json = net.toJSON();
            console.log(JSON.stringify(json, null, 2));
    } else {
        console.error("Training data is not defined.");
    }
});

document.getElementById('testButton').addEventListener('click', function() {
    let deviation = 0;
    for(let i = 0; i < testData.length; i++){
        let q = net.run(testData[i])*100;
        console.log(Math.round(q))
        deviation += Math.round(Math.abs(correctData[i]-q))
        
    }
    console.log("Average deviation: " + deviation/35);
});