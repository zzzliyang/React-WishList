var express = require('express');
var fs = require('fs');
var path = require('path');
var app = express();

var WISHES = path.join(__dirname, 'wishes.json');

app.set('port', 8080);
app.use('/', express.static(__dirname));

app.get('/api/wishes', function(req, res) {
  fs.readFile(WISHES, function(err, data) {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    res.json(JSON.parse(data));
  });
});

app.post('/api/wishes', function(req, res) {
  fs.readFile(WISHES, function(err, data) {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    var wishes = JSON.parse(data);
    wishes.forEach(function(wish) {
      if (wish.id === req.body.wish.id) {
        wish.archived = true;
      }
    });
  });
});

app.listen(app.get('port'), function(){
  console.log('Server started: http://localhost:8080/');
})
