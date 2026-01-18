module.exports = {
  apps : [{
    name: "backend-api",
    script: 'server.js',
    env: {
      NODE_ENV: "production"
    }
  }],

  deploy : {
    production : {
      user : 'SSH_USERNAME',
      host : 'SSH_HOSTMACHINE',
<<<<<<< HEAD
      ref  : 'origin/master',
=======
      ref  : 'origin/By devt',
>>>>>>> a640273afc49d8f5c0bacb18c69c24c6002c4baf
      repo : 'GIT_REPOSITORY',
      path : 'DESTINATION_PATH',
      'pre-deploy-local': '',
      'post-deploy' : 'npm install && pm2 reload ecosystem.config.js --env production',
      'pre-setup': ''
    }
  }
};
