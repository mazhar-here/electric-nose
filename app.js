//Loads all the required libraries
const express = require('express');
const mongoose=require('mongoose');
const path=require('path');
const ejs=require('ejs');


mongoose.connect('mongodb://localhost/my_database', {useNewUrlParser: true});
const app = express();
const port = 3000;

//Defines a Schema. Schema is required by mongoose to set up the format of the data in the database
const Schema=mongoose.Schema;
const SensorDataSchema=new Schema({
	
	dateCreated:Date,
	temperature:Number,
	pressure:Number,
	soot:Number,
	humidity:Number
	});
const SensorData=mongoose.model('SensorData',SensorDataSchema);

//We tell Express to use EJS as our templating engine
app.set('view engine','ejs');
// Sets the the static file directory as "public"
app.use(express.static('public'));

//Sets the main file to serve when we go to the homepage
app.get('/', (req, res) => {
	

	res.sendFile(path.resolve(__dirname,"index.html"));
	
});

//Sets end point for weekly pressure data
app.get('/week-pressure', (req, res) => {
	
	
	avgWeeklyData('pressure').then((weeklyResult)=>{
		console.log(weeklyResult);
		res.json({
		
			avgWeeklyData:weeklyResult});
		
	});
	
	});
	
	
//Sets end point for weekly temperature data	
app.get('/week-temperature', (req, res) => {
	
	avgWeeklyData('temperature').then((weeklyResult)=>{
		console.log(weeklyResult);
		res.json({
		
			avgWeeklyData:weeklyResult});
		
	});
	
	});

//Sets end point for weekly soot data
app.get('/week-soot', (req, res) => {
	
	avgWeeklyData('soot').then((weeklyResult)=>{
		console.log(weeklyResult);
		res.json({
		
			avgWeeklyData:weeklyResult});
		
	});
	
	});

//Sets end point for weekly humidity data
app.get('/week-humidity', (req, res) => {
	
	avgWeeklyData('humidity').then((weeklyResult)=>{
		console.log(weeklyResult);
		res.json({
		
			avgWeeklyData:weeklyResult});
		
	});
	
	});	
	
//Sets end point for hourly pressure data	
app.get('/hour-pressure', (req, res) => {
	
	avgHourlyData('pressure').then((hourlyResult)=>{
		console.log(hourlyResult);
		res.json({
		
			avgHourlyData:hourlyResult});
		
	});
	
	});

//Sets end point for hourly temperature data
app.get('/hour-temperature', (req, res) => {
	
	avgHourlyData('temperature').then((hourlyResult)=>{
		console.log(hourlyResult);
		res.json({
		
			avgHourlyData:hourlyResult});
		
	});
	
	});
	
	
//Sets end point for hourly soot data
app.get('/hour-soot', (req, res) => {
	
	avgHourlyData('soot').then((hourlyResult)=>{
		console.log(hourlyResult);
		res.json({
		
			avgHourlyData:hourlyResult});
		
	});
	
	});
	
	
//Sets end point for hourly humidity data	
app.get('/hour-humidity', (req, res) => {
	
	avgHourlyData('humidity').then((hourlyResult)=>{
		console.log(hourlyResult);
		res.json({
		
			avgHourlyData:hourlyResult});
		
	});
	
	});


app.get("/ajax-info",(req,res)=>{	

	liveData().then((liveResult)=>{
		avgHourlyData('temperature').then((hourlyResult)=>{
			avgWeeklyData('temperature').then((weeklyResult)=>{
				result={
							liveData:liveResult,
							avgWeeklyData:weeklyResult,
							avgHourlyData:hourlyResult
						}
							console.log(result);
							res.json(result);
			});
		});
	});
													
});

app.get("/ajax-info2",(req,res)=>{
	
	res.json();
	
});

app.listen(port, () => {
  
  console.log(`Server listening at http://localhost:${port}`);
  
  
  
});

//Aggregates the average hourly data from the database
function avgHourlyData(sensor){
		
	
	return SensorData.aggregate([
			{	
				
				'$match':{
					"dateCreated" : { 
						$lt: new Date(), 
						$gte: new Date(new Date().setDate(new Date().getDate()-1))
					
				}}
			},
				
				
			{
				'$group':
					{
						
						_id: {$dateToString: { format: "%Y-%m-%dT%H", date: "$dateCreated" } },
						'avgResult': {$avg: '$'+sensor},
					
						
					
					}
			}
			,			
				{ '$sort' : { _id: -1 } },
				
		
				]).exec();
		
		// return post;
	}

function liveData(){
		
	
	return SensorData.findOne({}, {}, { sort: { 'dateCreated' : -1 } }).exec();
	
	
}

//Aggregates the average weekly data from the database
function avgWeeklyData(sensor){
		
	
	return SensorData.aggregate([
			{	
				'$group':
					{
						'_id': { $dateToString: { format: "%Y-%m-%d", date: "$dateCreated" } },
						'avgResult': {$avg: '$'+sensor}
					}

				},
				
				{ $sort : { _id: -1 } },
				{$limit:7},
				{
					'$project':
					{
						't':'$_id',
						'_id':0,
						'avgResult':1
					}
				}
				]).exec();
	}

	

