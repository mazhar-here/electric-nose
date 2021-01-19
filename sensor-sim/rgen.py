from pymongo import MongoClient
from faker import Faker
import time
from datetime import datetime
from datetime import timedelta
from decimal import Decimal
from bson.decimal128 import Decimal128

myclient = MongoClient('localhost',27017)
mydb = myclient.my_database
mycol = mydb.sensordatas

def create_sensor_data(fake):
    datentime=datetime(2020,8,1)
    for i in [0,1,2,3]:
        datentime += timedelta(days=1)
        sootData = Decimal128( str(fake.pyfloat(left_digits=3, right_digits=3, positive=False, min_value=0, max_value=999)))
        sootData= Decimal128(str(sootData))
        tempData = fake.random_int(-40,85)
        humidityData = fake.random_int(0,100)
        pressureData = fake.random_int(300,1250)

        result = mycol.insert_one( 
            {
                
                'soot': sootData,
                'temperature': tempData,
                'humidity': humidityData,
                'pressure': pressureData,
                'dateCreated': datentime
                }
            )

        print ('soot:' + str(sootData) + ' temperature:' + str(tempData))
        time.sleep(5)

if __name__ == '__main__':
    fake = Faker()
    create_sensor_data(fake)