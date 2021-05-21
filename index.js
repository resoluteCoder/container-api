const express = require('express')
const cors = require('cors');
const util = require('util');
const exec= util.promisify(require('child_process').exec);
const bodyParser = require('body-parser');


const app = express()


app.use(bodyParser.json());
app.use(cors());
const port = 3000

const runCommand = async (command) => {
        const { stdout, stderr } = await exec(command);
        console.log(stdout);
        console.log(stderr);
    return stdout;
}

app.get('/containers', async (req, res) => {
    const data = await runCommand('podman ps -a --format json');
    res.json(data);
})

app.post('/container', async (req, res) => {
    const data = await runCommand('podman run -d ' + req.body.name);
    res.json(data);
});

app.get('/data', async (req, res) => {
    const args = req.query.containers.join(' ');
    const data = await runCommand(`podman inspect ${args} --format json`);
    res.json(JSON.parse(data));
})

app.put('/containers', async (req,res) => {
    const {name, status} = req.body;
    const subCommand = status === 'running' ? 'stop' : 'start';
    const data = await runCommand(`podman ${subCommand} ${name}`);
    res.json(data);
});

app.delete('/containers', async (req, res) => {
    const args = req.body.join(' ');
    await runCommand('podman stop ' + args);
    const data = await runCommand('podman rm ' + args);
    res.json(data);
});

app.listen(port, () => {
      console.log(`Example app listening at http://localhost:${port}`)
})
