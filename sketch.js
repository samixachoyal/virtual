var dog,sadDog,happyDog;
var foodObj;
var foods,foodStock;
var fedTime, lastFed, feed, addFood;

function preload(){
  sadDog=loadImage("Images/Dog.png");
  happyDog=loadImage("Images/happy dog.png");
}

function setup() {
  database = firebase.database();
  createCanvas(1000,400);
  
  foodObj = new Food();

  foodStock = database.ref('Food');
  foodStock.on("value",readStock);

  dog=createSprite(800,200,150,150);
  dog.addImage(sadDog);
  dog.scale=0.15;

  feed = createButton("FEED THE DOG");
  feed.position(900,95);
  feed.mousePressed(feedDog);

  addFood = createButton("ADD FOOD");
  addFood.position(800,95);
  addFood.mousePressed(addFood);

}

function draw() {
  background(46,139,87);

  foodObj.display();

  fedTime = database.ref('FeedTime');
  fedTime.on("value",function (data){
    lastFed = data.val();
  })

  fill(255,255,254);
  textSize(15);
  if(lastFed>=12){
    text("LAST FEED: " + lastFed%12 + "PM",350,30);
  }
  else if(lastFed==0){
    text("LAST FEED: " + lastFed + "AM",350,30);
  }

  else{
    text("Last Feed: " + lastFed + "AM", 350,30)
  }
  drawSprites();
}

function readStock(data){
  foods = data.val();
  foodObj.updateFoodStock(foods);
}


function feedDog(){
  dog.addImage(happyDog);

  foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  database.ref('/').update({
    Food: foodObj.getFoodStock(),
    feedTime:hour()
  })
}


function addFoods(){
  foods++;
  database.ref('/').update({
    Food: foods
  })
}
