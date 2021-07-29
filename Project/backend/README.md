# How to use this project?

## Firstly Creating backend in our pc
Clone this repo.
Install npm modules aws-sdk,fs,express,cors,path,body-parser,mysql,nodemailer,nodemon

download aws-cli and in terminal write aws-configure and provide secret key and access key credentials so that you can manage your aws services from your terminal.

create s3 bucket
provide it's name in the environment variable
make public access to this bucket
create new role which will be used by your code to access s3 bucket provide its access key and secret key in environment variables.
create new policy to access s3 bucket and associate it with new s3 role.
also go to your bucket in permissions create policy to access s3 and provide new role arn so that new user can access thhat bucket.

create rds mysql database and provide it public access also modify security group and set all traffic source anywhere. 
provide rds endpoint,username,password,datbase name in environment variable

create standard queue for sending it to lambda function for further processing.
Enter queue url in environment variables.

Enter e-mail service,emailid and password from where we need to noify user.

create lambda function, create new role for lambda function and create new policy for accessing queue and sns and attach it with that specific lambda role.
associate sqs as source with lambda function and sns as destination with lambda function.

In lambda function write code provided in lambda folder.

access your rds through mysql workbench and run following commands
use testdb;
create table Users (
	id int not null auto_increment, 
	name varchar(255) not null,
    email varchar(255) not null,
    mobile varchar(255) not null,
    age varchar(255) not null,
    country varchar(255) not null,
    primary key (id)
);
now run your backend node index.js or nodemon index.js
Boom your backend is up and running on localhost.

Whole of the above process was configuring backend on your desktop on localhost.
Now lets see the process to deploy it on aws ec2 instance

## Configuring backend on ec2 instance
Now in order to host this backend create ubuntu 18.04 ec2 instance
Now ssh into your instance using puttygen(to generate private key ppk) and putty or else open gitbash in the directory where you downloaded your instance .pem key

commands for configuring backend
ssh -i "new-ec2-key.pem" ubuntu@publicip
sudo su -
sudo apt update
sudo apt install npm
npm i n -g
n lts
npm -v
node -v
mkdir nodeapi
cd nodeapi
clone your backend code from github

OR say

touch index.js
npm init
npm install aws-sdk fs express cors path body-parser mysql nodemailer
nano index.js and paste your code there and to save press ctrl+x y enter

now we need to allow our code to access aws services on our behalf by proving access key and secret key credentials(aws-cli is present by default in ubuntu).
aws configure and write access key and secret key.

starting server using
node index.js
OR
nodemon index.js

Boom your backend api is running on EC2 public ip and can serve to the requests on the internet

## Database configuration
Now ssh into your ubuntu instance in another window.

sudo su -
(for using mysql-server on instance)
sudo apt-get install mysql-server
mysql -h paste_your_rds_endpoint_here -u admin -p testdb
then press enter and insert password.

Boom you are looged into mysql rds instance
(using database that was creating while making rds and running few commands for demonstration purpose)
use testdb;
create table Users (
	id int not null auto_increment, 
	name varchar(255) not null,
    email varchar(255) not null,
    mobile varchar(255) not null,
    age varchar(255) not null,
    country varchar(255) not null,
    primary key (id)
);
select * from Users;
drop table Users;

Now your can now manage your database from here.
