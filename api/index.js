// DATABASE CONNECTIONS

const MongoClient = require('mongodb').MongoClient;
let _db;

const connectMongoDB = async () => {
    if (_db){
        console.log("Warning: Reconnecting to database");
        try {
            const uri = "mongodb+srv://visualnick:FcWeaD5YXLcXml1A@twitchhighlights-sslwa.gcp.mongodb.net/test?retryWrites=true&w=majority";
            let client = new MongoClient(uri, { useNewUrlParser: true });
            await client.connect();
            _db = client.db("TwitchHighlightsDB");
            console.log("Successfully reconnected to database");
        } catch (err) {
            console.log("While trying to reconnect to database:");
            console.log(err);
        }
    } else {
        try {
            const uri = "mongodb+srv://visualnick:FcWeaD5YXLcXml1A@twitchhighlights-sslwa.gcp.mongodb.net/test?retryWrites=true&w=majority";
            let client = new MongoClient(uri, { useNewUrlParser: true });
            await client.connect();
            _db = client.db("TwitchHighlightsDB");
            console.log("Successfully connected to database");
        } catch (err) {
            console.log("While trying to connect to database:");
            console.log(err);
        }
    }
}

const getMongoDB = async () => {
    if (_db) return _db; 
    else {
        await connectMongoDB();
        return _db;
    }
}

const appendReport = async (clientID, videoURL, email, message) => {
    try{
        url = videoURL;

        // Writing to MongoDB
        let db = await getMongoDB();
        db.collection("ReportLog").insertOne({
            ClientID: clientID, 
            VideoURL: url, 
            Email: email, 
            Message: message, 
            ReportDate: new Date()
        });
        db.collection("Client").updateOne({
            ClientID: clientID
        }, {
            $inc: {ReportCount: 1},
            $currentDate: {LastReportDate: true}
        });

    }catch(err){
        console.log("While appending report: ");
        console.error(err);
    }
}

const getIPAddress = async () => {
    let ip = "35.225.126.232";
    try{
        let db = await getMongoDB();
    
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
        console.log("While getting IP address: ");
        console.error(err);
        ip = "35.225.126.232"; 
    }
    return ip;
}

// END DATABASE CONNECTIONS

const axios = require('axios');

module.exports = async (req, res) => {
  let ip = getIPAddress(); 
 
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
    // Intermediate server now append report directly to the database

    appendReport(body.clientID, body.url, body.email, body.message);
    console.log("Received a report from " + body.clientID);

    res.sendStatus(200);

    // axios.post('http://' + ip + '/api/report', {
    //   clientID: body.clientID, 
    //   email: body.email,
    //   url: body.url,
    //   message: body.message
    // })
    // .then((response) => {
    //   res.status(200).send(response.data);
    // })
    // .catch((error) => {
    //   res.status(200).send(error);
    // });
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