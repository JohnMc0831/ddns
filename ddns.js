var colors = require('colors');
var request = require('request');
fs = require('fs')

console.log('Dynamic DNS Client for FreeDNS\nAdapted from code developed by João Amaral\n(https://github.com/joaoamaral)'.gray);

// see https://freedns.afraid.org for instructions on how to get this value from the Direct Link URL.
var secretKey = '<*** REMOVED ***>'; 

var url = "http://freedns.afraid.org/dynamic/update.php?" + secretKey;

 

// Text file with IPv4 Address (0.0.0.0)
var filename = "cachedip.txt"

// Reads local file for latest external IP address
fs.readFile(filename, 'utf8', function (err, oldip) {
  if (err) {
    return console.log(err);
  }
  
  request('http://myexternalip.com/raw', function (err, resp, newip) {
    console.log("Current External IP Address registered with freeDNS at : " + newip.brightRed);
    var getMyDynamicDnsUrl = 'http://freedns.afraid.org/api/?action=getdyndns&v=2&sha=c4406b02f1df3c64e401d3cba4058480171f9e11';
    request(getMyDynamicDnsUrl, function(error, response, body) {
      if (!error && response.statusCode == 200) {
        console.log(`Retrieval of dns information successful: ${response.statusCode}`.brightGreen);
        var dnsText = body.split('\n');
        dnsText.forEach(element => {
          var parsedEl = element.split('|');
          console.log(`Host:  `.brightBlue + `${parsedEl[0]} @ ${parsedEl[1]}`.bold.brightCyan);
        });
      } else {
        console.log(`An error occurred: ${response.statusCode}\n${response.statusMessage}`);
        console.log(error.brightRed);
      }
    });

    if(oldip === newip){
      console.log("No update.".bold.brightGreen)
      return
    } else {
    console.log("Update needed.".bold.brightRed);
    }

    console.log("Cached External IP Address:  " + oldip.bold.brightBlue);
    request(url, function (error, response, body) {
      if (!error && response.statusCode == 200) {

        console.log('Update successful...'+response.statusCode);
        fs.writeFile(filename, newip, function(err) {

          if(err) {
              return console.log(err.brightRed);
          }

          console.log(`New IP Address ${newip.bold.brightBlue} stored in cache file.`);
        });

      } else {
        console.log(`An error occurred: ${response.statusCode}\n${response.statusMessage}`);
        console.log(error.brightRed);
      }
    });
  });
});






