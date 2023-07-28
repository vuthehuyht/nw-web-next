module.exports = {
  apps: [
    {
      name: 'nw-web-next',
      script: 'npm',
      args: 'start',
      cwd: '/home/ec2-user/nw-web-next/source',
      env: {
        'NODE_ENV': 'development'
      },
      env_production: {
        'NODE_ENV': 'production'
      }
    }
  ],
  deploy: {
    development: {
      user: 'ec2-user',
      host: '18.177.28.143',
      key: '~/.ssh/config',
      ref: 'origin/develop',
      repo: 'git@bitbucket.org:hidesignsJP/nw-web-next.git',
      path: '/home/ec2-user/nw-web-next',
      'pre-setup': 'chmod -R 777 ~/nw-web-next/source && rm -rf ~/nw-web-next/source',
      'post-setup': 'cp ~/ENV/env ~/nw-web-next/source/.env && mkdir ./public/.well-known && cp ~/ENV/apple-app-site-association ~/nw-web-next/source/public/.well-known/apple-app-site-association && cp ~/ENV/assetlinks.json ~/nw-web-next/source/public/.well-known/assetlinks.json',
      'post-deploy': 'npm install && npm run build && pm2 startOrRestart ecosystem.config.js --env development'
    },
    'dev3.0': {
      user: 'ec2-user',
      host: '18.177.28.143',
      key: '~/.ssh/config',
      ref: 'origin/dev3.0',
      repo: 'git@bitbucket.org:hidesignsJP/nw-web-next.git',
      path: '/home/ec2-user/nw-web-next',
      'pre-setup': 'chmod -R 777 ~/nw-web-next/source && rm -rf ~/nw-web-next/source',
      'post-setup': 'cp ~/ENV/env ~/nw-web-next/source/.env && mkdir ./public/.well-known && cp ~/ENV/apple-app-site-association ~/nw-web-next/source/public/.well-known/apple-app-site-association && cp ~/ENV/assetlinks.json ~/nw-web-next/source/public/.well-known/assetlinks.json',
      'post-deploy': 'npm ci && npm run build && pm2 startOrRestart ecosystem.config.js --env dev3.0'
    },
    nwa: {
      user: 'ec2-user',
      host: '35.77.152.176',
      key: '~/.ssh/config',
      ref: 'origin/nwa',
      repo: 'git@bitbucket.org:hidesignsJP/nw-web-next.git',
      path: '/home/ec2-user/nw-web-next',
      'pre-setup': 'chmod -R 777 ~/nw-web-next/source && rm -rf ~/nw-web-next/source',
      'post-setup': 'cp ~/ENV/env ~/nw-web-next/source/.env && mkdir ./public/.well-known && cp ~/ENV/apple-app-site-association ~/nw-web-next/source/public/.well-known/apple-app-site-association && cp ~/ENV/assetlinks.json ~/nw-web-next/source/public/.well-known/assetlinks.json',
      'post-deploy': 'npm install && npm run build && pm2 startOrRestart ecosystem.config.js --env nwa'
    },
    production: {
      user: 'ec2-user',
      host: '3.112.169.145',
      key: '~/.ssh/config',
      ref: 'origin/master',
      repo: 'git@bitbucket.org:hidesignsJP/nw-web-next.git',
      path: '/home/ec2-user/nw-web-next',
      'pre-setup': 'chmod -R 777 ~/nw-web-next/source && rm -rf ~/nw-web-next/source',
      'post-setup': 'cp ~/ENV/env ~/nw-web-next/source/.env && mkdir ./public/.well-known && cp ~/ENV/apple-app-site-association ~/nw-web-next/source/public/.well-known/apple-app-site-association && cp ~/ENV/assetlinks.json ~/nw-web-next/source/public/.well-known/assetlinks.json',
      'post-deploy': 'npm install && npm run build && pm2 startOrRestart ecosystem.config.js --env production'
    },
    main: {
      user: 'ec2-user',
      host: '3.115.142.126',
      key: '~/.ssh/config',
      ref: 'origin/main',
      repo: 'git@bitbucket.org:hidesignsJP/nw-web-next.git',
      path: '/home/ec2-user/nw-web-next',
      'pre-setup': 'chmod -R 777 ~/nw-web-next/source && rm -rf ~/nw-web-next/source',
      'post-setup': 'cp ~/ENV/env ~/nw-web-next/source/.env && mkdir ./public/.well-known && cp ~/ENV/apple-app-site-association ~/nw-web-next/source/public/.well-known/apple-app-site-association && cp ~/ENV/assetlinks.json ~/nw-web-next/source/public/.well-known/assetlinks.json',
      'post-deploy': 'npm install && npm run build && pm2 startOrRestart ecosystem.config.js --env main'
    },
    mainB: {
      user: 'ec2-user',
      host: '52.68.245.67',
      key: '~/.ssh/config',
      ref: 'origin/main',
      repo: 'git@bitbucket.org:hidesignsJP/nw-web-next.git',
      path: '/home/ec2-user/nw-web-next',
      'pre-setup': 'chmod -R 777 ~/nw-web-next/source && rm -rf ~/nw-web-next/source',
      'post-setup': 'cp ~/ENV/env ~/nw-web-next/source/.env && mkdir ./public/.well-known && cp ~/ENV/apple-app-site-association ~/nw-web-next/source/public/.well-known/apple-app-site-association && cp ~/ENV/assetlinks.json ~/nw-web-next/source/public/.well-known/assetlinks.json',
      'post-deploy': 'npm install && npm run build && pm2 startOrRestart ecosystem.config.js --env main'
    }
  }
}