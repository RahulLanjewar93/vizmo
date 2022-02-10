const databaseUri = process.env.MONGOURL

const config = {
    databaseURI: 'mongodb://localhost:27017/dev',
    cloud: process.env.CLOUD_CODE_MAIN || __dirname + '/cloud/main.js',
    appId: process.env.APP_ID || 'myAppId',
    masterKey: process.env.MASTER_KEY || 'myAppId', //Add your master key here. Keep it secret!
    serverURL: process.env.SERVER_URL || 'http://localhost:1337/parse', // Don't forget to change to https if needed
    liveQuery: {
      classNames: ['Posts', 'Comments'], // List of classes to support for query subscriptions
    },
};

  module.exports = config