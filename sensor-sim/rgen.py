from pymongo import MongoClient
from faker import Faker
import time
from datetime import datetime
from datetime import timedelta
from random import random

#connects to the local database at port 27017
myclient = MongoClient('localhost',27017)

#assigns the stored database and sensordatas collection to mydb and mycol variables  
mydb = myclient.my_database
mycol = mydb.sensordatas

def create_sensor_data(fake):
    
    while True:        
        
        #gets the current time
        datentime=datetime.now()
       
        #generates random sensor data
        sootData=random()*1000
        sootData=float("{0:.2f}".format(sootData))
        tempData = fake.random_int(-40,85)
        humidityData = fake.random_int(0,100)
        pressureData = fake.random_int(300,1250)
        
        
        print(sootData)
        
        #puts the random data into the database
        result = mycol.insert_one( 
            {
                
                'soot': sootData,
                'temperature': tempData,
                'humidity': humidityData,
                'pressure': pressureData,
                'dateCreated': datentime
                }
            )
        
        #sleeps for 5 seconds before restarting the loop
        time.sleep(5)
        
           
        
if __name__ == '__main__':
    fake = Faker()
    create_sensor_data(fake)