"use strict";
const
  express = require('express'),
  mock = require('./mock.js'),
  server = express();

server.use('/', express.static(__dirname));

server.get('/api/data', (req, res) => {
  var response = [];

  if (typeof req.query.q !== 'undefined') {
    mock.filter(data => {
      if (typeof req.query.type !== 'undefined') {
        if (data.id.toString() === req.query.q
          || data.companyName.includes(req.query.q)
          || data.email.includes(req.query.q))
          req.query.type === data.type.toString()
            ? response.push(data)
            : null;
      }
      else if (data.id.toString() === req.query.q || data.companyName.includes(req.query.q) || data.email.includes(req.query.q)) response.push(data);
    });
  }

  if (Object.keys(req.query).length === 0) response = mock;
  res.json(response);
});

server.listen(3000, () => console.log('Mock data server on port 3000!'));