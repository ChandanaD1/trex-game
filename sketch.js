var trex, trex_running, trex_collide;
var ground, ground_image, ground_invisible;
var cloud, cloud_image, CloudsGroup;
var obstacle, ob1,ob2,ob3,ob4,ob5,ob6, ObstaclesGroup;
var count = 0;
var highScore = 0;
var PLAY = 1;
var END = 0;
var gameState = PLAY;
var gameOver,gameOverImage,restart,restartImage;
var jump,die,checkPoint;

function preload() {
  trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_collide = loadAnimation("trex_collided.png");
  ground_image = loadImage("ground2.png");
  cloud_image = loadImage("cloud.png");
  ob1 = loadImage("obstacle1.png");
  ob2 = loadImage("obstacle2.png");
  ob3 = loadImage("obstacle3.png");
  ob4 = loadImage("obstacle4.png");
  ob5 = loadImage("obstacle5.png");
  ob6 = loadImage("obstacle6.png");
  gameOverImage = loadImage("gameOver.png");
  restartImage = loadImage("restart.png");
  jump = loadSound("jump.mp3");
  die = loadSound("die.mp3");
  checkPoint = loadSound("checkPoint.mp3");
}

function setup() {
  createCanvas(600, 200);
  
  trex = createSprite(60,180,20,50);
  trex.addAnimation("running",trex_running);
  trex.scale = 0.5;
  
  trex.addAnimation("collided",trex_collide);
  
  ground = createSprite(300,180,600,20);
  ground.addImage("image", ground_image);
  ground.velocityX = -6;
  
  ground_invisible = createSprite(300,195,600,10);
  ground_invisible.visible = false;
  
  CloudsGroup = new Group();
  ObstaclesGroup = new Group();
  
  gameOver = createSprite(300,80,30,20);
  gameOver.addImage("gameOver",gameOverImage);
  gameOver.scale = 0.5;
  gameOver.visible = false;

  restart = createSprite(300,120,20,20);
  restart.addImage("restart",restartImage);
  restart.scale = 0.5;
  restart.visible = false;
}

function draw() {
  background(150);
  fill(255);
  
  trex.collide(ground_invisible);
  
  text("Score: "+ count, 450, 70);
    if (highScore > 0) {
      text("High Score: " + highScore, 450, 50);
    }
  
  if (gameState == PLAY) {

    if (World.frameCount % 5 == 0) {
        count = count + 1;
        if (count % 100 == 0 && count > 0) {
          ground.velocityX = ground.velocityX - 2;
          checkPoint.play();
        }
    }

    if (ground.x < 0) {
      ground.x = 700;
    }

    trex.velocityY = trex.velocityY + 0.7 ;

    if(keyDown("space") && trex.y > 140) {
      trex.velocityY = -10;
      jump.play();
    }

    spawnClouds();
    spawnObstacles();
    
    if (trex.isTouching(ObstaclesGroup)) {
      die.play();
      gameState = END; 
  
    }
    
  } 
  
  else if (gameState == END) {
    trex.velocityY = 0;
    ground.velocityX = 0;
    ObstaclesGroup.setVelocityXEach(0);
    CloudsGroup.setVelocityXEach(0);
    ObstaclesGroup.setLifetimeEach(-1);
    CloudsGroup.setLifetimeEach(-1);
    trex.changeAnimation("collided", trex_collide);
    gameOver.visible = true;
    restart.visible = true;
  }
  
  if (mousePressedOver(restart)) {
    reset();
  }
  
  drawSprites();
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
    cloud = createSprite(600,120,10,10);
    cloud.y = Math.round(random(80,120));
    cloud.addImage("cloud",cloud_image);
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime = 210;
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //add each cloud to the group
    CloudsGroup.add(cloud);
  }
  
}

function spawnObstacles() {
  if(frameCount % 60 === 0) {
    obstacle = createSprite(600,165,10,40);
    obstacle.velocityX = ground.velocityX;
    
    //generate random obstacles
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage("obstacle",ob1);
        break;
      case 2: obstacle.addImage("obstacle",ob2);
        break;
      case 3: obstacle.addImage("obstacle",ob3);
        break;
      case 4: obstacle.addImage("obstacle",ob4);
        break;
      case 5: obstacle.addImage("obstacle",ob5);
        break;
      case 6: obstacle.addImage("obstacle",ob6);
        break;
    }
    
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.5;
    obstacle.lifetime = 110;
    //add each obstacle to the group
    ObstaclesGroup.add(obstacle);
  }
}

function reset() {
  if (count > highScore) {
    highScore = count;
  }
  trex.changeAnimation("running", trex_running);
  ObstaclesGroup.destroyEach();
  CloudsGroup.destroyEach();
  ground.velocityX = -6;
  count = 0;
  gameOver.visible = false;
  restart.visible = false;
  gameState = PLAY;
}
