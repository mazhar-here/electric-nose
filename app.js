const express = require('express');
const mongoose=require('mongoose');
const path=require('path');
const ejs=require('ejs');

mongoose.connect('mongodb://localhost/my_database', {useNewUrlParser: true});
const app = express();
const port = 3000;
const Schema=mongoose.Schema;
const SensorDataSchema=new Schema({
	
	dateCreated:Date,
	temperature:Number,
	pressure:Number,
	soot:Number,
	humidity:Number
	});
const SensorData=mongoose.model('SensorData',SensorDataSchema);


app.set('view engine','ejs');
app.use(express.static('public'));

app.get('/', (req, res) => {
	
	// res.render('index');
	res.sendFile(path.resolve(__dirname,"demo.html"));
	
});

app.get('/day-form', (req, res) => {
	SensorData.find({day:req.query["day-select"]},(error,result)=>{
			 res.render('result',{result});
			 console.log(result);
})});

app.get("/ajax-info",(req,res)=>{	

	// res.json({
			// temp:Math.floor(Math.random()*(15-10) + 10),
			// press:Math.random()*(1.2-0.9) + 0.9,
			// soot: Math.floor(Math.random()*(16-9) + 9),
			// hum: Math.floor(Math.random()*(98-70) + 70),
			
		// });		
	
		SensorData.findOne({}, {}, { sort: { 'dateCreated' : -1 } }, function(err, post) {
			console.log( post );
			res.json(post);
		});
		
		 
		//console.log("Connected...");
});

app.get("/ajax-info2",(req,res)=>{
	//res.sendFile(path.resolve(__dirname,"public/new.txt"));
	res.json();
	
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
  avgTemp2();
  // avgTemp(new Date("2020-08-10"),new Date("2020-08-09"));
  // for(index=1;index<7;index++){
	  
  // }
});

function avgTemp(startDate,endDate){
	
	return SensorData.find({ "dateCreated":{
		$lt:startDate,
		$gte:endDate
		}},function(err,post){
				avgTemperature=0;
				counter=0;
				post.forEach((item)=>{
					counter+=(item["temperature"]);
				});
				avgTemperature=counter/post.length;
				console.log(avgTemperature);
				
		});		
}

function avgTemp2(){
	
	SensorData.aggregate([
		// {
			// '$match': {
			// // 'dateCreated': {$lt:new Date(),$gte:new Date("2020-08-15")}
		// }},
		{
		'$group':
			{
				'_id': { $dateToString: { format: "%Y-%m-%d", date: "$dateCreated" } },
				'avgTemp': {$avg: '$temperature'}
			}

		},
		
		{ $sort : { _id: -1 } },
		{$limit:7}
		],
		
		function(err,post){
			// post.sort(function(a,b){
				// return new Date(a["_id"])-new Date(b["_id"]);
			// });
			console.log(post);
		})			
	
	}


	

