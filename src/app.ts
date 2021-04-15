import express from 'express';
import cors from 'cors';
import fs from 'fs';
import TF from './Tree'
import { infoType } from './types'

const app = express()
const port = 3000;

const fileNames =  fs.readdirSync(__dirname + "/../sliderinfo");
const paths = fileNames.reduce(
    (acc, fileName) => {
        const module: infoType = JSON.parse(
            fs.readFileSync(
                __dirname + "/../sliderinfo/" + fileName, "utf8"
            )
        );
        return acc.concat([module.path]);
    }, 
    [] as string[]
);

const pathTreeHead = TF.createChild(false, "VIVA", []);
const pathTree = paths.reduce(
    (acc, path) => {
        return TF.insertPath(path.split("/"), acc)
    }, 
    pathTreeHead
);

app.use(cors());
 
app.use(express.json());

app.post('/api', (req, res) => {
    console.log(req.body.path);
    if (req.body.path.split(".").length === 2) {
        const sliderjson = fs.readFileSync(__dirname + "/../sliderinfo/" + req.body.path).toString();
        res.send(JSON.parse(sliderjson));
    }
    else
        res.send(TF.narrowTraverse(req.body.path, pathTree));
});

app.get('/test', (req, res) => {
})

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});
