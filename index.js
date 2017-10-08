var express = require('express');
var app = express();
var mongoose = require('mongoose');
var Model = require('./model/model');
var Schema = mongoose.Schema;
mongoose.connect('mongodb://andrey484:qwerty1234567@ds137464.mlab.com:37464/sunny_project');
//mongoose.connect('mongodb://localhost/test');
var server = require('http').createServer(app);
var ws = require('ws').Server;
var wss = new ws({app});
var bodyParser = require('body-parser')

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());


var getAllGames = require('./route/getAllGames');
var getTeam = require('./route/getTeam');
var getUserById = require('./route/getUserById');


app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/public'));
app.use('/getAllGames', getAllGames);
app.use('/getTeam', getTeam);
app.use('/getUserById', getUserById);

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    // we're connected!
});
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');


server.listen(app.get('port'), function (err) {
    if (err)
        console.log(err);
    console.log('Node app is running on port', app.get('port'));
});


wss.on('connection', function (ws) {
    ws.on('message', function (data) {
        switch (JSON.parse(data).cmd) {
            case 10: {
                var currentProgress = 0;
                Model.TeamModel.find({id: JSON.parse(data).teamId}, function (err, docs) {
                    if(err) console.log(err);
                    currentProgress = docs[0].progress;
                    currentProgress++;
                    Model.TeamModel.update({id: JSON.parse(data).teamId}, {progress: currentProgress}, function (err) {
                        if(err) console.log(err);
                        ws.send('{"cmd":10}');
                    });
                });
                break;
            }
            case 20:{

                break;
            }
            case 30:{

                break;
            }
            case 40:{

                break;
            }
            default:{
                socket.send({error: 'undefined command'})
            }
        }
    })
});

module.exports = server;