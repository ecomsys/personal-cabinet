// backend/ecosystem.config.cjs
module.exports = {
    apps: [
        {
            name: "personal-cabinet-back",
            script: "./index.js",         // потому что index.js в корне backend
            cwd: "./back",             // рабочая директория
            instances: 1,
            autorestart: true,
            watch: false,
            env: {
                NODE_ENV: "development",
                PORT: 3000
            },
            env_production: {
                NODE_ENV: "production",
                PORT: 3000
            }
        }
    ]
};