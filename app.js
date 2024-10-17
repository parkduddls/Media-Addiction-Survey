const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(express.static('public'));

const dataFilePath = path.join(__dirname, 'surveyData.json');
if (!fs.existsSync(dataFilePath)) {
    fs.writeFileSync(dataFilePath, JSON.stringify([]));
}

app.post('/submit_survey', (req, res) => {
    const surveyData = req.body;
    let totalScore = 0;
    for (let key in surveyData) {
        totalScore += parseInt(surveyData[key]);
    }

    let result = '';
    if (totalScore <= 42) {
        result = '일반 사용자 B군';
    } else if (totalScore <= 53) {
        result = '일반 사용자 A군';
    } else if (totalScore <= 66) {
        result = '잠재적 위험 사용자군';
    } else {
        result = '고위험 사용자군';
    }

    const currentData = JSON.parse(fs.readFileSync(dataFilePath, 'utf-8'));
    surveyData.totalScore = totalScore;
    surveyData.result = result;
    currentData.push(surveyData);
    fs.writeFileSync(dataFilePath, JSON.stringify(currentData));

    res.json({ totalScore, result });
});

app.get('/get_surveys', (req, res) => {
    const currentData = JSON.parse(fs.readFileSync(dataFilePath, 'utf-8'));
    res.json(currentData);
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

