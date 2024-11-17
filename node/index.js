const express = require("express");
const axios = require("axios");
const app = express();

// cors allow froma any origin
const cors = require("cors");
app.use(cors());



app
  .get("/search", (req, res) => {
    const query = req.query.q;
    const medium = req.query.medium;
    const geoLocation = req.query.geoLocation;
    // res.send(`Search results for: ${query}`);
    let url =
      "https://collectionapi.metmuseum.org/public/collection/v1/search?hasImages=true";

      if(medium){
        url = url + "&medium=" + medium;
        }
        if(geoLocation){
            url = url + "&geoLocation=" + geoLocation;
        }

    url = url + "&q=" + query;

    axios
      .get(url)
      .then(function (response) {
        const data = response.data;
        const results = data.objectIDs;
        if (results === null) {
          res.send([]);
          return;
        }
        const firstTen = results.slice(0, 15);
        const promises = firstTen.map(function (objectID) {
          return axios.get(
            "https://collectionapi.metmuseum.org/public/collection/v1/objects/" +
              objectID
          );
        });
        return Promise.all(promises);
      })
      .then(function (response) {
        if (response === undefined) {
          return;
        }
        const results = response.map(function (response) {
          return response.data;
        });
        res.send(results);
      })
      .catch(function (error) {
        console.log(error);
        res.status(500).send("Error");
      }
      );
  })

app.listen(5000, () => console.log("Server ready"));
