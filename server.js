import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const publicPath = path.join(__dirname, 'public');
const hunterPath = path.join(__dirname, 'masterhunter');
const dataPath = path.join(__dirname, 'data');
const imagePath = path.join(__dirname, 'images');

app.use(express.json());
app.use(express.static(publicPath));
app.use('/data', express.static(dataPath));
app.use('/images', express.static(imagePath));
app.use('/masterhunter', express.static(hunterPath));
  
app.get(['/masterhunter'], (req, res) => {
    res.sendFile(path.join(hunterPath, 'masterhunter.html'));
});

app.get('/', (req, res) => {
    res.sendFile(path.join(publicPath, 'index.html'));
});

app.get('/statistics', (req, res) => {
    res.sendFile(path.join(publicPath, 'statistics/statistics.html'));
});

app.get('/about', (req, res) => {
    res.sendFile(path.join(publicPath, 'about/about.html'));
});


app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});
