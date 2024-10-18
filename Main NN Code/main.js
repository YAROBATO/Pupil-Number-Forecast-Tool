//this file was manly used for test purposes (part of the first apporach)
let trainingData = [];  
let testData = [];
let correctData = [];
const net = new brain.NeuralNetwork({
    hiddenLayers: [8,5], // hidden layers
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
                    row['KG 1 I'] /100, 
                    row['KG 2 I']/100,   
                    row['1 I']/100,
                    row['2 I']/100,
                    row['3 I']/100,
                    row['4 I']/100,
                    row['5 I']/100,
                    row['6 I']/100,    
                    row['Geburtsjahr 1']/100,
                    row['Geburtsjahr 2']/100,
                    row['neueZimmer 1']/100,
                    row['neueZimmer 2']/100,
                    row['neueZimmer 3']/100,
                    row['neueZimmer 4']/100
                ],
                output: [
                    row['KG 1 O']/100, 
                    row['KG 2 O']/100,   
                    row['1 O']/100,
                    row['2 O']/100,
                    row['3 O']/100,
                    row['4 O']/100,
                    row['5 O']/100,
                    row['6 O']/100
                ] 
            };
        });


        console.log("Formatted Training Data:", trainingData);        

        document.getElementById('trainButton').disabled = false;
    };
    
    reader.readAsArrayBuffer(file);  
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
            row['KG 1 I']/100, 
            row['KG 2 I']/100,   
            row['1 I']/100,
            row['2 I']/100,
            row['3 I']/100,
            row['4 I']/100,
            row['5 I']/100,
            row['6 I']/100,    
            row['Geburtsjahr 1']/100,
            row['Geburtsjahr 2']/100,
            row['neueZimmer 1']/100,
            row['neueZimmer 2']/100,
            row['neueZimmer 3']/100,
            row['neueZimmer 4']/100
        ]);
        correctData = jsonData.map(row => [
            row['KG 1 O'], 
            row['KG 2 O'],   
            row['1 O'],
            row['2 O'],
            row['3 O'],
            row['4 O'],
            row['5 O'],
            row['6 O']
        ]);


        console.log("Formatted Test Data:", testData);
        console.log("Correct Solution:", correctData);

        document.getElementById('testButton').disabled = false;
    };
    
    reader.readAsArrayBuffer(file);  
}

document.getElementById('trainButton').addEventListener('click', function() {
    if (trainingData.length > 0) {
        net.train(trainingData,  
            {
                iterations: 1600000,    // Number of training iterations
                errorThresh: 0.0001,    // Error threshold for stopping training
                log: true,             // Log training results
                logPeriod: 5000        // Logging interval
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
        let q = net.run(testData[i]);
        let g = q.map(x => x * 100)
        console.log(g);
        for(let h = 0; h < g.length; h++){
            deviation +=Math.abs(correctData[i][h]-g[h])
        }
        
    }
    console.log("Average deviation: " + deviation/48);
});


