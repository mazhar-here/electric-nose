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

	
		SensorData.findOne({}, {}, { sort: { 'dateCreated' : -1 } }, function(err, post1) {
	
			SensorData.aggregate([
			{	
				'$group':
					{
						'_id': { $dateToString: { format: "%Y-%m-%d", date: "$dateCreated" } },
						'avgTemp': {$avg: '$temperature'}
					}

				},
				
				{ $sort : { _id: -1 } },
				{$limit:7},
				{
					'$project':
					{
						't':'$_id',
						'_id':0,
						'avgTemp':1
					}
				}
				],
				
				function(err,post2){
					result={
							liveData:post1,
							avgTempData:post2
						}
					console.log(result);
					res.json(result);
					
				})		
					
				});
			
		
});

app.get("/ajax-info2",(req,res)=>{
	//res.sendFile(path.resolve(__dirname,"public/new.txt"));
	res.json();
	
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
  avgWeeklyTemp();
  // avgTemp(new Date("2020-08-10"),new Date("2020-08-09"));
  // for(index=1;index<7;index++){
	  
  // }
});


function avgWeeklyTemp(){
	
	SensorData.aggregate([
		{
		'$group':
			{
				'_id': { $dateToString: { format: "%Y-%m-%d", date: "$dateCreated" } },
				'avgTemp': {$avg: '$temperature'}
			}

		},
		
		{ $sort : { _id: -1 } },
		{$limit:7},
		{
			'$project':
			{
				't':Date.parse('$_id'),
				'_id':0,
				'avgTemp':1
			}
		}
		],
		
		function(err,post){
			console.log(post);
		})			
	
	}


	

