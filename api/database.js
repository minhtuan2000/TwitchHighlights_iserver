// DATABASE CONNECTIONS

const MongoClient = require('mongodb').MongoClient;
let _db;

const connectMongoDB = async () => {
    if (_db) {
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
    try {
        // Default
        if (videoURL === undefined) videoURL = "";
        if (email === undefined) email = "";
        if (message === undefined) message = "";

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
            $inc: { ReportCount: 1 },
            $currentDate: { LastReportDate: true }
        });

    } catch (err) {
        console.log("While appending report: ");
        console.error(err);
    }
}

const getIPAddress = async () => {
    let ip = "35.225.126.232";
    try {
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
            $currentDate: { lastReadDate: true }
        });

    } catch (err) {
        console.log("While getting IP address: ");
        console.error(err);
        ip = "35.225.126.232";
    }
    return ip;
}

module.exports = { appendReport, getIPAddress };