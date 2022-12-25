module.exports = {
  apps: [
    {
      name: 'bigscreen',
      script: './dist/main.js',
      watch: true,
    },
  ],

  deploy: {
    production: {
      user: 'root',
      host: 'chtoma.com',
      ref: 'origin/master',
      repo: 'git@github.com:chtocode/bigscreen.git',
      path: '/bigscreen',
      ssh_options: 'StrictHostKeyChecking=no',
      env: {
        NODE_ENV: 'production',
      },
      'post-deploy':
        'cd packages/backend && npm install && pm2 reload ecosystem.config.js --env production',
    },
  },
};
