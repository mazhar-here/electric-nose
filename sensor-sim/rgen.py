from pymongo import MongoClient
from faker import Faker
import time
from datetime import datetime
from datetime import timedelta
from random import random

myclient = MongoClient('localhost',27017)
mydb = myclient.my_database
mycol = mydb.sensordatas

def create_sensor_data(fake):
    #datentime=datetime(2020,8,1)
    # datentime=datetime.now()
    
    # for i in range(15):
        # for j in range(48):   
    while True:        
            # datentime += timedelta(days=1)
            # datentime-=timedelta(hours=0.5)
        datentime=datetime.now()
        sootData=random()*1000
        sootData=float("{0:.2f}".format(sootData))
        tempData = fake.random_int(-40,85)
        humidityData = fake.random_int(0,100)
        pressureData = fake.random_int(300,1250)
        print(sootData)
        
        result = mycol.insert_one( 
            {
                
                'soot': sootData,
                'temperature': tempData,
                'humidity': humidityData,
                'pressure': pressureData,
                'dateCreated': datentime
                }
            )
        
        time.sleep(3)
        
           
        
if __name__ == '__main__':
    fake = Faker()
    create_sensor_data(fake)