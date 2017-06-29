d3.csv("data/data.csv", function (data) {
  d3.json("data/gates.json", function(gates) {
    var filterdata = _.filter(data, (item) => {
      var date1 = new Date(item["Timestamp"]);
      date1.setHours(0,0,0,0);
      var date2 = new Date();
      return date1.getTime() == date2.getTime();
    });
    if (filterdata.length) {
      startTime = new Date(filterdata[0]["Timestamp"]).getTime();
    }

    function sketchProc(processing) {

      function drawCar (car, opacity) {
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
        processing.fill(red, green, blue, opacity);
        processing.stroke(red, green, blue, opacity);

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

      processing.setup = function () {

        processing.size(982, 982);

        bg = processing.loadImage("assets/map.jpg");
        time = 1;

        // refresh window in seconds
        refreshWindow = 0.5;

        // time window in minutes
        timeWindow = 5;

        colors = {};
        insidepark = {};
      };

      processing.draw = function() {
        if(time < (60 * refreshWindow)) {
          time++;
          return;
        }
        if (!bg) return;

        processing.background(bg);
        if (!filterdata.length) {
          return;
        }


       for (var i = 0; i < filterdata.length; i++) {
         var item = filterdata[i];
         var date = new Date(item["Timestamp"]);

         if (date.getTime() > startTime + timeWindow * 60 * 1000) continue;

         if (date.getTime() >= startTime) {
           if (item["gate-name"].includes("entrance")) {
             if (insidepark[item["car-id"]] && insidepark[item["car-id"]] != item["Timestamp"]) {
                 delete insidepark[item["car-id"]];
             } else {
               insidepark[item["car-id"]] = item["Timestamp"];
             }
           }
           drawCar(item, 255);
           continue;
         }

         if (!insidepark[item["car-id"]]) continue;

         if (date.getTime() >= startTime - timeWindow * 60 * 1000 ) {
           drawCar(item, 240);
           continue;
         }
         if (date.getTime() >= startTime - 2 * (timeWindow * 60 * 1000) ) {
           drawCar(item, 220);
           continue;
         }
         if (date.getTime() >= startTime - 3 * (timeWindow * 60 * 1000) ) {
           drawCar(item, 210);
           continue;
         }
         drawCar(item, 200);
       }
       time = 0;
       startTime = startTime + timeWindow * 60 * 1000;
       processing.textSize(40);
       processing.fill(255);
       var showDate = new Date(startTime);
       var hours = "00" + showDate.getHours();
       var minutes = "00" + showDate.getMinutes();
       processing.text(hours.substr(-2) + ":" + minutes.substr(-2), 800, 50);
       processing.textSize(30);
       processing.text("Cars " + Object.values(insidepark).length, 800, 90);
     };
    }

    var canvas = document.getElementById("canvas1");
    var processingInstance = new Processing(canvas, sketchProc);


    document.getElementById("filterButton").onclick = function() {
      var dateString = document.getElementById("date").value;
      var carString = document.getElementById("cartype").value;
      var carIdString = document.getElementById("carId").value;
      filterdata = _.filter(data, (item) => {
        var date1 = new Date(item["Timestamp"]);
        date1.setHours(0,0,0,0);
        var date2 = new Date(Date.parse(dateString));
        if (carString && item["car-type"] != carString) return false;
        if (carId && item["car-id"] != carId) return false;
        if (dateString && date1.getTime() != date2.getTime()) return false;
        return true;
      });
      if (filterdata.length) {
        time = 0
        startTime = new Date(filterdata[0]["Timestamp"]).getTime();
      }
    }
  });
});
