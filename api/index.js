const database = require('./database');
const axios = require('axios');

module.exports = async (req, res) => {
    let ip = await database.getIPAddress();

    const { body } = req;

    // Request
    if (body.type === "Request") {
        // Check if request is valid
        if (body.clientID === undefined || body.url === undefined)
            res.status(400).send("Bad request");

        axios.post('http://' + ip + '/api/link', {
            clientID: body.clientID,
            url: body.url,
            isBasic: body.isBasic,
            n: body.n,
            l: (body.automode == 0) ? body.l : -1,
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
    } else
        // Report
        if (body.type === "Report") {
            // Check if report is valid
            if (body.clientID === undefined)
                res.status(400).send("Bad request");

            // Intermediate server now append report directly to the database
            database.appendReport(body.clientID, body.url, body.email, body.message);
            console.log("Received a report from " + body.clientID);

            res.status(200).send("OK");

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
        } else
            // PurchaseID
            if (body.type === "PurchaseID") {
                // Check if purchaseID is valid
                if (body.clientID === undefined)
                    res.status(400).send("Bad request");

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
            } else
                // UpdatedStatus
                if (body.type === "UpdatedStatus") {
                    // Check if updatedStatus is valid
                    if (body.clientID === undefined)
                        res.status(400).send("Bad request");

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
                } else
                    // CheckConnection
                    if (body.type === "CheckConnection") {
                        axios.get('http://' + ip + '/api/link')
                            .then(function (response) {
                                res.status(200).send("OK");
                            })
                            .catch(function (error) {
                                res.status(200).send("Not Found!");
                            });
                    } else
                        // Otherwise return 404 error
                        res.status(404).send("Not found");
}