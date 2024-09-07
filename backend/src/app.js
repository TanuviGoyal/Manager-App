const express = require('express');
const Docker = require('dockerode');
var cors = require('cors')



const app = express();
app.use(cors());
// console.log(app);

const docker = new Docker({ socketPath: '/var/run/docker.sock' });

app.use(express.json());

const PORT_TO_CONTAINER = {};
const CONTAINER_TO_PORT = {};

app.get('/containers', async (req, res) => {
    
    try {
        const containers = await docker.listContainers({ all: true });
        return res.json({
            containers: containers.map(e => ({
                id: e.Id,
                name: e.Names,
                image: e.Image,
                port: CONTAINER_TO_PORT[e.Id]
            }))
        });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});


app.post('/containers', async (req, res) => {
    
    const { image, cmd } = req.body; 
    // console.log("Image: ", image);
    try {
        // Pull the image if it doesn't exist locally
        await new Promise((resolve, reject) => {
            docker.pull(image, (err, stream) => {
                if (err) return reject(err);
                docker.modem.followProgress(stream, (err, res) => err ? reject(err) : resolve(res));
            });
        });
        
        const availablePort = (() => {
            for (let i = 6000; i < 7000; i++) {
                if (PORT_TO_CONTAINER[i]) continue;
                return `${i}`;
            }
            return null;
        })();

        if (!availablePort) {
            return res.status(500).json({ error: "No available port" });
        }

        const container = await docker.createContainer({
            Image: image,
            // Cmd: ['sh'],
            // Cmd: ['nginx', '-g', 'daemon off;'],
            Cmd: cmd,
            AttachStdout: true,
            Tty: true,
            HostConfig: {
                PortBindings: {
                    '80/tcp': [{ HostPort: availablePort }]
                }
            }
        });
        const containerInfo = await container.inspect();
        // console.log('Container created:', containerInfo);
        // console.log('container started:', container);
        // console.log('Container created:', container);

        PORT_TO_CONTAINER[availablePort] = container.id;
        CONTAINER_TO_PORT[container.id] = availablePort;

        await container.start();
        return res.json({ container: container.id, port: availablePort });
    } catch (err) {
        console.error('Error:', err);
        return res.status(500).json({ error: err.message });
    }
});

app.post('/containers/:id/stop', async (req, res) => {
    const containerId = req.params.id;

    try {
        // Get a specific container
        const container = docker.getContainer(containerId);

        // Check if the container is running
        const containerInfo = await container.inspect();
        if (containerInfo.State.Running) {
            // Stop the container if it's running
            await container.stop();
            console.log('Container stopped successfully:', containerId);

            res.json({ message: 'Container stopped successfully' });
        } else {
            res.json({ message: 'Container is already stopped' });
        }
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ error: 'Failed to stop container' });
    }
});

app.delete('/containers/:id', async (req, res) => {
    const containerId = req.params.id;

    try {
        // Get a specific container
        const container = docker.getContainer(containerId);

        // Check if the container is running
        const containerInfo = await container.inspect();
        if (containerInfo.State.Running) {
            // Stop the container if it's running before deletion (optional)
            await container.stop();
            // console.log('Container stopped successfully before deletion:', containerId);
        }

        // Remove the container
        await container.remove({ force: true });
        // console.log('Container deleted successfully:', containerId);

        res.json({ message: 'Container deleted successfully' });
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ error: 'Failed to delete container' });
    }
});

app.listen(5000, () => {
    console.log("Server is running on PORT:5000");
});
