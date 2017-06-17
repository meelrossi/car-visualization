d3.csv("data/data.csv", function (data) {
  d3.json("data/gates.json", function(gates) {
    function sketchProc(processing) {
      processing.setup = function () {
        processing.size(982, 982);
        bg = processing.loadImage("assets/map.jpg");
        time = 1;
        // refresh window in seconds
        refreshWindow = 1;
        // time window in minutes
        timeWindow = 5;

        colors = {};
      };
      function star(x, y, radius1, radius2, npoints) {
        var angle = processing.TWO_PI / npoints;
        var halfAngle = angle/2.0;
        processing.beginShape();
        for (var a = 0; a < processing.TWO_PI; a += angle) {
          var sx = x + processing.cos(a) * radius2;
          var sy = y + processing.sin(a) * radius2;
          processing.vertex(sx, sy);
          sx = x + processing.cos(a+halfAngle) * radius1;
          sy = y + processing.sin(a+halfAngle) * radius1;
          processing.vertex(sx, sy);
        }
        processing.endShape(processing.CLOSE);
      }
      var filterdata = _.filter(data, (item) => {
        var date1 = new Date(item["Timestamp"]);
        date1.setHours(0,0,0,0);
        var date2 = new Date(Date.parse("05-01-2015"))
        return date1.getTime() == date2.getTime();
      });
      startTime = new Date(filterdata[0]["Timestamp"]).getTime();
      processing.draw = function() {
        if(time < (60 * refreshWindow)) {
          time++;
          return;
        }
       processing.background(bg);
       var framedata = _.filter(filterdata, (item) => {
         var date = new Date(item["Timestamp"]);
         return date.getTime() < (startTime + timeWindow * 60 * 1000) && date.getTime() >= startTime
       });
       for (var i = 0; i < framedata.length; i++) {
         processing.fill(255, 0, 0);
         processing.stroke(255, 0, 0);
         var car = framedata[i];
         var gate = gates[car["gate-name"]];
         if (!colors[car["car-id"]]) {
           colors[car["car-id"]] = {
             red: Math.random() * 255,
             blue: Math.random() * 255,
             green: Math.random() * 255
           }
         }
         var red = colors[car["car-id"]].red;
         var green = colors[car["car-id"]].green;
         var blue = colors[car["car-id"]].blue;
         processing.fill(red, green, blue);
         processing.stroke(red, green, blue);

         switch(car["car-type"]) {
          case "1":
                  processing.ellipse(gate.x, gate.y, 30, 30);
                  break;
          case "2":
                  processing.triangle(gate.x - 20, gate.y + 20, gate.x, gate.y, gate.x + 20, gate.y + 20);
                  break;
          case "3":
                  processing.rect(gate.x, gate.y, 20, 20);
                  break;
          case "4":
                  star(gate.x, gate.y, 10, 20, 5);
                  break;
          case "5":
                  star(gate.x, gate.y, 10, 20, 2);
                  break;
          case "6":
                  star(gate.x, gate.y, 10, 20, 4);
                  break;
          case "2P":
                  star(gate.x, gate.y, 10, 20, 8);
                  break;
         }
       }
       time = 0;
       startTime = startTime + timeWindow * 60 * 1000;
     };
    }
  var canvas = document.getElementById("canvas1");
  var processingInstance = new Processing(canvas, sketchProc);
  });
});
