// const fs = require('fs');
// console.log(fs.readFileSync('DATA', 'utf8'));

module.exports = async (req, res) => {
  const axios = require('axios');
  const MongoClient = require('mongodb').MongoClient;

  let ip = "35.225.126.232"; 
 
  try{
    const uri = "mongodb+srv://visualnick:FcWeaD5YXLcXml1A@twitchhighlights-sslwa.gcp.mongodb.net/test?retryWrites=true&w=majority";
    let client = new MongoClient(uri, { useNewUrlParser: true });
    await client.connect();
    let db = client.db("TwitchHighlightsDB");

    // get the ip address
    let res = await db.collection("IPAddress").find({
      key: "Aloha"
    }).toArray();
    ip = res[0].ip;

    // update read date
    db.collection("IPAddress").updateOne({
      key: "Aloha"
    }, {
      $currentDate: {lastReadDate: true}
    });

  } catch (err) {
    //console.log(err);
    ip = "35.225.126.232"; 
  }

  const { body } = req;
  
  // Request
  if (body.type === "Request"){
    axios.post('http://' + ip + '/api/link', {
      clientID: body.clientID, 
      url: body.url, 
      isBasic: body.isBasic, 
      n: body.n, 
      l: (body.automode == 0)? body.l: -1, 
      offset: body.offset, 
      from: body.from,
      to: body.to
    })
    .then((response) => {
      res.status(200).send(response.data);
    })
    .catch((error) => {
      res.status(200).send(error);
    });
  }
  
  // Report
  if (body.type === "Report"){
    axios.post('http://' + ip + '/api/report', {
      clientID: body.clientID, 
      email: body.email,
      url: body.url,
      message: body.message
    })
    .then((response) => {
      res.status(200).send(response.data);
    })
    .catch((error) => {
      res.status(200).send(error);
    });
  }

  // PurchaseID
  if (body.type === "PurchaseID"){
    axios.post('http://' + ip + '/api/purchase', {
      clientID: body.clientID, 
      jwt: body.jwt,
      cartId: body.cartId,
      orderId: body.orderId
    })
    .then((response) => {
      res.status(200).send(response.data);
    })
    .catch((error) => {
      res.status(200).send(error);
    });
  }

  // UpdatedStatus
  if (body.type === "UpdatedStatus"){
    axios.post('http://' + ip + '/api/status', {
      clientID: body.clientID, 
      license: body.license
    })
    .then((response) => {
      res.status(200).send(response.data);
    })
    .catch((error) => {
      res.status(200).send(error);
    });
  }

  // CheckConnection
  if (body.type === "CheckConnection"){
    axios.get('http://' + ip + '/terms')
    .then(function (response) {
      res.status(200).send("OK");
    })
    .catch(function (error) {
      res.status(200).send("Not Found!");
    });
  }
}