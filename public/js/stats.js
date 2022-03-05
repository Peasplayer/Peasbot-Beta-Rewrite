var servers = document.getElementById('stats.servers');
var users = document.getElementById('stats.users');
var channels = document.getElementById('stats.channels');

function readTextFile(file, callback) {
  var rawFile = new XMLHttpRequest();
  rawFile.overrideMimeType("application/json");
  rawFile.open("GET", file, true);
  rawFile.onreadystatechange = function() {
    if (rawFile.readyState === 4 && rawFile.status == "200") {
      callback(rawFile.responseText);
    }
  }
  rawFile.send(null);
}

readTextFile("js/stats.json", function(text){
  var data = JSON.parse(text);
  if(data.servers < 10) {
    servers.innerHTML = "00"+data.servers
  } else if(data.servers < 100) {
    servers.innerHTML = "0"+data.servers
  } else {
    servers.innerHTML = data.servers
  }
  if(data.users < 10) {
    users.innerHTML = "00"+data.users
  } else if(data.users < 100) {
    users.innerHTML = "0"+data.users
  } else {
    users.innerHTML = data.users
  }
  if(data.channels < 10) {
    channels.innerHTML = "00"+data.channels
  } else if(data.channels < 100) {
    channels.innerHTML = "0"+data.channels
  } else {
    channels.innerHTML = data.channels
  }
});