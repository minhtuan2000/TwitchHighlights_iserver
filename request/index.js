var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

module.exports = async (req, res) => {
    const { body } = req;
    //Send a POST request to the server to analyse the video
    let xhr = new XMLHttpRequest();
    xhr.open("POST", "http://35.225.126.232/api/link", true);
    xhr.setRequestHeader('Content-type', 'application/json');
    //console.log(JSON.stringify({url: tabUrl}));
    xhr.send(JSON.stringify({clientID: body.clientID, 
                              url: body.url, 
                              isBasic: body.isBasic, 
                              n: body.n, 
                              l: (body.automode == 0)? body.l: -1, 
                              offset: body.offset, 
                              from: body.from,
                              to: body.to}));
    xhr.onreadystatechange = function() {
      //console.log(xhr.readyState);
      //console.log(xhr.status);
      if (xhr.readyState == 4 && xhr.status == 200) {
          res.status(200).send(xhr.responseText);
      }
    }
  }