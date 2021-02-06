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
	

	res.sendFile(path.resolve(__dirname,"demo.html"));
	
});

app.get('/day-form', (req, res) => {
	SensorData.find({day:req.query["day-select"]},(error,result)=>{
			 res.render('result',{result});
			 console.log(result);
})});

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
	//res.sendFile(path.resolve(__dirname,"public/new.txt"));
	res.json();
	
});

app.listen(port, () => {
  
  console.log(`Example app listening at http://localhost:${port}`);
  
  // avgHourlyTemp();
  
});


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

	

