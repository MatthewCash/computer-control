import express from 'express';
import { SmartApp } from '@smartthings/smartapp';
import ping from 'ping';
import { exec } from 'child_process';
import mongoose from 'mongoose';
import { ContextStore } from './store';

let state = false;
let fails = 0;

const server = express();
server.use(express.json());

const smartapp = new SmartApp()
    .contextStore(new ContextStore())
    .publicKey('@keys/smartthings_rsa.pub')
    .configureI18n()
    .clientId('9e7392dd-8125-4922-a605-9a366e2a5b32')
    .clientSecret('9ae9f51f-c84e-4e81-85b2-c68e7bd8543a')
    .page('mainPage', (context, page) => {
        page.section('switch', section => {
            section
                .deviceSetting('switch')
                .capabilities(['switch'])
                .multiple(false)
                .permissions('rWx');
        });
    })
    .updated(async context => {
        await context.api.subscriptions.delete();
        context.api.subscriptions.subscribeToDevices(
            context.config.switch,
            'switch',
            'switch',
            'switchHandler'
        );
    })
    .subscribedEventHandler('switchHandler', async (context, { value }) => {
        if (value == 'on') {
            if (state)
                return console.log('Ignoring Internal Request for ' + value);
            console.log('Turning Computer On... ' + state);
            exec('bash /opt/computer/actions/on.sh');
        } else if (value == 'off') {
            if (!state)
                return console.log('Ignoring Internal Request for ' + value);
            console.log('Turning Computer Off... ' + state);
            exec('bash /opt/computer/actions/off.sh');
        }
    });

const connectDatabase = async () => {
    console.log('Connecting to database');
    await mongoose.connect('mongodb://127.0.0.1/computer', {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
    console.log('Database Connected!');
};

connectDatabase();

server.post('/', (req, res) => {
    smartapp.handleHttpCallback(req, res);
});

server.get('/', (req, res) => {
    res.status(400).send(
        'This is an API endpoint. No usable web interface lives here.'
    );
});

const startPolling = async () => {
    while (true) await pollComputer();
};

const pollComputer = async () => {
    const context = await smartapp.withContext(
        '39be7037-0d02-40f5-9441-7d938086bd59'
    );

    const { alive } = await ping.promise.probe(process.env.HOSTNAME);

    const device = await context.api.devices
        .getStatus('cf3c2ecd-2c62-4a74-8078-fb0a01540354')
        .catch(() => null);
    if (!device) return;

    const switchState =
        device?.components?.main?.switch?.switch?.value === 'on';

    if (alive) {
        fails = 0;
    } else if (fails < 5) {
        fails++;
    }

    if (fails === 0) state = true;

    if (fails === 0 && !switchState) {
        await context.api.devices.sendCommands(
            context.config.switch,
            'switch',
            'on'
        );
        state = true;
    }
    if (fails > 4 && switchState) {
        await context.api.devices.sendCommands(
            context.config.switch,
            'switch',
            'off'
        );
        state = false;
    }
    await new Promise(r => setTimeout(r, 250));
};

startPolling();

const port = process.env.PORT ?? 3000;

server.listen(port);
console.log(`API Server running on port ${port}`);
