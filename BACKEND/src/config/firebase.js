const admin = require("firebase-admin");
const path = require("path");

const serviceAccount = require(
  path.join(__dirname, "../../serviceAccountKey.json")
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// const { applicationDefault } = require('firebase-admin/app');
// admin.initializeApp({
//   credential: applicationDefault() 
// });

module.exports = admin;
