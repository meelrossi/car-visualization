void setup () {
  size(400, 982)
}

void star(float x, float y, float radius1, float radius2, int npoints) {
  float angle = TWO_PI / npoints;
  float halfAngle = angle/2.0;
  beginShape();
  for (float a = 0; a < TWO_PI; a += angle) {
    float sx = x + cos(a) * radius2;
    float sy = y + sin(a) * radius2;
    vertex(sx, sy);
    sx = x + cos(a+halfAngle) * radius1;
    sy = y + sin(a+halfAngle) * radius1;
    vertex(sx, sy);
  }
  endShape(CLOSE);
}

void draw () {
  fill(0);
  stroke(0);
  background(240);
  textSize(28);

  ellipse(40, 40, 30, 30);
  text("TIPO 1", 90, 50);

  triangle(20, 95, 40, 70, 60, 95);
  text("TIPO 2", 90, 95);

  rect(25, 115, 30, 30);
  text("TIPO 3", 90, 140);

  star(40, 180, 10, 20, 5);
  text("TIPO 4", 90, 190);

  star(40, 230, 10, 20, 2);
  text("TIPO 5", 90, 240);

  star(40, 280, 10, 20, 4);
  text("TIPO 6", 90, 290);

  star(40, 330, 10, 20, 8);
  text("TIPO 2P", 90, 340);


  textSize(24);
  text("Color indicates car id", 40, 400);
}
