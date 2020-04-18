const slackBot = require('slackbots');
const axios = require('axios');
const moment = require('moment');

const bot = new slackBot({
    token: '<your-API-token>',
    name: 'NodeBot'
});

const users = [];

bot.on('start', () => {
    const params = {
        icon_emoji:'robot_face:'
    }
    bot.postMessageToUser(
    'amaliacaldare20',
    `*Hello!* ` + bot.name +  ` is here to make your work easier. Type *@nodebot* with *help* to check my *super-powers* !`,
    params
    );
});


bot.on('message', (data) => {

    if (data.type != 'message' || data.subtype == 'bot_message' || !data.text) return;

    args = data.text.split(" ");
    command = args.splice(1, 1)[0];
    user_id = args.splice(0, 1)[0];
    //date = args.splice(0,1)[0];
   // params = args.join(' ');
    
    handleMessage(command, args);
});

function handleMessage(command, params) {
    switch(command) {
        case 'todo': 
            addToList(params.splice(0,1)[0],params.join(' '));
           break;
        case 'list':
            getList();
            break;
        case 'reminder':
            sendReminder();
            break;
        case 'weather':
            getWeather(params.join(' '));
            break;
        case 'help':
            getHelp();
            break;
        default:
            return;
    }
};

function addToList(date, element) {
    const params = {
        icon_emoji: 'pushpin:'
    }

    const user = {
        toDoList: element,
        date: moment(date, "DD-MM-YYYY").utcOffset(date,"DD-MM-YYYY")
    }

    users.push(user);
    bot.postMessageToUser('amaliacaldare20', "Task added to list!", params);
};

function getList() {
    const params = {
        icon_emoji: 'memo:'
    }

    for(var i = 0; i < users.length; i++)
    { 
         bot.postMessageToUser('amaliacaldare20', ' :black_medium_small_square: ' + users[i].date.format('DD-MM-YYY')+ ': ' + users[i].toDoList, params);
    }
};

function sendReminder() {

    const params = {

        icon_emoji: "exclamation:"
    }

    var currentDate = moment().add(1,'days');
    var count = 0;
    //moment(currentDate,"DD-MM-YYYY");
    for(var i = 0; i < users.length; i++)
    {
        moment(users[i].date, "DD-MM-YYYY");
        var dif = currentDate.diff(users[i].date);
        var duration = parseInt(moment.duration(dif).asHours(),10);
       //ar duration = parseInt(dur.asHours(),10);

        if(duration > 0 && duration <= 24 ) {

          bot.postMessageToUser('amaliacaldare20', users[i].toDoList, params);
          count = 1;
          
        }
    }

    if(count == 0) {

        bot.postMessageToUser('amaliacaldare20','You have no tasks for tomorrow!', params);
        return count;
    }
};


async function getWeather(city)  {

    try{
        params = {
            icon_emoji: 'robot_face:'
        }

        var apiKey = '<your-API-key';
        var url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
        
        var weather =  await axios.get(url);
        var message = `It's ${weather.data.main.temp} degress in ${weather.data.name}.`;
    
        bot.postMessageToUser('amaliacaldare20', message, params);

    } catch(error) {
        console.log("error")
    }

  }

function getHelp() {
      params = {
          icon_emoji: 'question:'
      }
      bot.postMessageToUser(
           'amaliacaldare20',
           ` Type *@nodebot* and:
            - *todo* *date* *task*, to add task to your To Do List (date format: DD-MM-YYYY),
            - *list*, to see your To Do List,
            - *reminder*, to check the list of task for the following day,
            - *weather* *city*, to check the weather in any city,
            - *help*, to see the instructions.
           `,
           params
      )
  };