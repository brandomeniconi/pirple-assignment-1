
let environments = {};

environments.staging = {
    http: {
        port: 3000
    },
    https: {
        port: 3001,
        keyFile: './https/key.pem',
        certFile: './https/cert.pem'
    }
};

environments.production = {
    http: {
        port: 80
    },
    https: {
        port: 443,
        keyFile: '/etc/letsencrypt/live/example.com/privkey.pem',
        certFile: '/etc/letsencrypt/live/example.com/fullchain.pem'
    }
};

let selectedEnv = typeof process.env.NODE_ENV == 'string' ? process.env.NODE_ENV.toLowerCase() : 'staging';
let selectedConfig = typeof environments[selectedEnv] == 'object' ? environments[selectedEnv] : environments.staging;

module.exports = selectedConfig;