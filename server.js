import express from 'express';
import path from 'path';

const app = express();


const publicPath = path.join(path.resolve(), 'public');
const modulesPath = path.join(path.resolve(), 'Modules');
const dataPath = path.join(path.resolve(), 'Data');
const imagePath = path.join(path.resolve(), 'Images');

app.use(express.json());
app.use(express.static(publicPath));
app.use('/Modules', express.static(modulesPath));
app.use('/Data', express.static(dataPath));
app.use('/Images', express.static(imagePath));

app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});