const express = require('express')
const cors = require('cors');
const util = require('util');
const exec= util.promisify(require('child_process').exec);


const app = express()


app.use(cors());
const port = 3000

const runCommand = async (command) => {
        const { stdout, stderr } = await exec(command);
        console.log(stdout);
        console.log(stderr);
    return stdout;
}

app.post('/container', async (req, res) => {
    const data = await runCommand('podman run -d --name test rhscl/httpd-24-rhel7');
    res.json(data);
});

app.get('/data', async (req, res) => {
    const data = await runCommand('podman inspect test');
    res.json(JSON.parse(data));
})

app.delete('/container', async (req, res) => {
    await runCommand('podman stop test');
    const data = await runCommand('podman rm test');
    res.json(data);
});

app.listen(port, () => {
      console.log(`Example app listening at http://localhost:${port}`)
})
