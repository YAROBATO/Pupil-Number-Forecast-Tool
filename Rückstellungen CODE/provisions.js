let trainingData = [];  
let testData = [];
let correctData = [];
//implementing brain.js NN
const net = new brain.NeuralNetwork({
    hiddenLayers: [1], 
    activation: 'sigmoid' 
});
//triggering the process training data
document.getElementById('fileInput').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
        processExcelFile(file);
    }
});
//triggering the process test data
document.getElementById('fileInputTest').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
        processExcelFile2(file);
    }
});
//preparing training data
function processExcelFile(file) {
    const reader = new FileReader();
    
    reader.onload = function(e) {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheet = workbook.SheetNames[0];
        const sheet = workbook.Sheets[firstSheet];
        const jsonData = XLSX.utils.sheet_to_json(sheet);

        // Preparing the training data
        trainingData = jsonData.map(row => {
            return {
                input: [
                    row['Birth']/1000,
                    row['Gender'] === 'm' ? 1 : 0   // Gender: male = 1, female = 0
                ],
                output: [row['Provisions'] === 'yes' ? 1 : 0] // Provisions: yes = 1, no = 0
            };
        });


        console.log("Formatted Training Data:", trainingData);        

        document.getElementById('trainButton').disabled = false;
    };
    
    reader.readAsArrayBuffer(file);  
}
//preparing test data
function processExcelFile2(file) {
    const reader = new FileReader();
    
    reader.onload = function(e) {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheet = workbook.SheetNames[0];
        const sheet = workbook.Sheets[firstSheet];
        
        const jsonData = XLSX.utils.sheet_to_json(sheet);

        testData = jsonData.map(row => [
            row['Birth'] / 1000,  
            row['Gender'] === 'm' ? 1 : 0   // Gender: male = 1, female = 0
        ]);
        correctData = jsonData.map(row => [
            row['Provisions']
        ]);


        console.log("Formatted Test Data:", testData);
        console.log("Correct Solution:", correctData);

        document.getElementById('testButton').disabled = false;
    };
    
    reader.readAsArrayBuffer(file);  
}

//setting the parameters of the NN and training it
document.getElementById('trainButton').addEventListener('click', function() {
    if (trainingData.length > 0) {
        net.train(trainingData,  
            {
                iterations: 1000000,    // Number of training iterations
                errorThresh: 0.005,    // Error threshold for stopping training
                log: true,             // Log training results
                logPeriod: 1000         // Logging interval
            });
            const json = net.toJSON();
            console.log(JSON.stringify(json, null, 2));
    } else {
        console.error("Training data is not defined.");
    }
});
//testing the NN using the test data
document.getElementById('testButton').addEventListener('click', function() {
    let correct = 0;
    let wrong = 0;
    for(let i = 0; i < testData.length; i++){
        let q = net.run(testData[i]);
        console.log(q);
        Math.round(q) == correctData[[i]] ? correct++ : wrong++;
    }
    console.log("correct guesses: " + correct)
    console.log("wrong guesses: " + wrong);
});


