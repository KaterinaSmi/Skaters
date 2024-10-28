var express = require('express');
var app = express();
var fs = require('fs');

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.json()); 
app.use(express.static(__dirname + '/public'))

app.get('/', (req, res)=>{
    res.sendFile(__dirname + '/index.html');
});

app.get('/guestbook', (req, res)=>{
    let data = require(__dirname + '/public/data.json')
    let result = `<style> 
    table{
    width:100%;
    border-collapse:collapse;
    }
    thead {
    background: linear-gradient(135deg, #85ffbd, #fffb7d);
    color:black;
    }
    th, td{
    padding: 10px;
    text-align: left;
    border: 1px solid #ddd;
    }
    tbody tr:nth-child(even){
    background-color:#F0F0F0;
    }
    tbody tr:hover{
     background: linear-gradient(135deg, #A3C9E0, #A8E4C3);
    }
    </style>
    
    <table>
    <thead>
        <tr>
            <th>#</th>
            <th>Name</th>
            <th>Country</th>
            <th>Message</th>
        </tr>
    </thead>
    <tbody>
    `
    result += data.map(item => {
        return `
        <tr><td>${item.id}</td> <td>${item.username}</td><td>${item.country}</td><td>${item.message}</td> </tr>
        `
    }).join('');

    result +=`
    </tbody>
    </table>`;

    res.send(result)
});

app.get('/newmessage', (req,res)=>{
    res.sendFile(__dirname + '/public/form.html')
});

app.post('/newmessage', (req, res) => {
    fs.readFile(__dirname + '/public/data.json', 'utf8', (err, data) => {
        if (err) {
            res.status(500).send('Failed to read data file');
            return;
        }

        let jsonData = JSON.parse(data);

        jsonData.push({
            id: jsonData.length + 1, // Generate the next ID
            username: req.body.name,
            country: req.body.country,
            date: new Date(),
            message: req.body.message,
        });

        fs.writeFile(__dirname + '/public/data.json', JSON.stringify(jsonData, null, 2), (err) => {
            if (err) {
                res.status(500).send('Failed to save data');
                return;
            }
            console.log("It's saved");
            res.send("Saved the data to a file");
        });
    });
});


app.get('/ajaxmessage', (req, res)=>{
    res.sendFile(__dirname + '/public/ajax_form.html');
});

app.post('/ajaxmessage', (req, res) => {
    const { name, country, message } = req.body;

    console.log("name: " + name);
    console.log("country: " + country);
    console.log("message: " + message);

    
    res.json([{ name, country, message }]); // Return the message as a JSON array
});


app.listen(3001, ()=>{
    console.log('App is running on port 3001!')
});
