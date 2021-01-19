FROM ubuntu:18.04
MAINTAINER mazhar_live@hotmail.com

WORKDIR /app
COPY package.json .


RUN apt update 
RUN apt install -y mongodb
RUN apt install -y nodejs
RUN apt install -y npm
RUN apt install -y python3-pip
RUN pip3 install Faker
RUN pip3 install pymongo
RUN npm install


COPY . .
EXPOSE 3000
EXPOSE 27017

CMD [ "python3", "/sensor-sim/rgen.py" ]
CMD [ "node", "app.js" ]




