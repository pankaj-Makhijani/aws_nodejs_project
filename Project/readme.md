## Current Requirements of the Project

Logging - MySQL Database (not file, or NoSQL)
Authentication and Authorization - JWT Token basedUser Management - Roles (many to many)
CRUD - Complete CRUD operations, from frontend app (UI/UX is not important at this moment, use a separate page for each operation)
Swagger - Open API Spec (complete working)
Private S3 - Access private docs using Presigned URLs, check other approaches.
UI/UX: Use ready made template based on bootstrap
Create separate screen/page
Make code reusable as discussed (S3 Service example)
follow same for S3, SQS, SES, SendGrid, for any 3rd part service
Actitvity Log and App log both
use nice pluging fro frontend
Auditing


## Future Learning list of the items you need to focus on to learn.

### General Skills
Backend (Node.js)
Database (MySQL)
Cloud (AWS)
Frontend (Angular) – Low priority
 

### Build REST API using Node.js and complete the below tasks:
User Management (user can have multiple roles)
Roles and Permissions
Authentication and Authorization (e.g. JWT) – Passport, jsonwebtoken (check these npm packages this might be useful), and find others
General User functionalities (e.g. Change password, Reset Password, and more.)
Logging in a database (MySQL) – Winston
Open API Spec (Swagger)
Exception handling (application level)
Consume third-party REST APIs – Request, Restify, etc.
File upload Secure files for authenticated users (Amazon S3 - private) – official AWS S3 SDK
Message Queuing (Amazon SQS) – official AWS S3 SDK
Sending Notifications (Email, SMS, Mobile Push Notifications) – Nodemailer, and find others
Deployment – PM2, find others (low priority)
Payment Integration (Stripe – use sandbox) – very low priority
 

### REST API Development using below items:
Express Framework
ORM (for MySQL) - Sequelize
Dependency Injection (Inversion of Control)
Object Mapping (Database entity to DTO, vice versa)
Model Validation and Business rule validations - validator
Caching Mechanism (Memory and Distributed - Redis)
Linting tools/libraries – eslint, and find other alternatives if required
Other Utility libraries – uuid, async, rxjs, bcrypt, debug, nodemon, and find other alternatives if required.
Clean Code Architecture and proper project structure
Develop POC and store it in RSPL’s git repository
Maintain the notes of your findings and save them in the same repository.
 

### Long-terms learning (~ 4-6 months)
Nest.js Framework
Typescript
AWS DynamoDB – official AWS S3 SDK
MongoDB - mongoose
Real-Time Communication (one-to-one chat, group chat, audio call, video call) – socket.io + WebRTC
AWS Cloud Practitioner Certification (skill/knowledge is important, not only badge)
Unit testing frameworks – Jest, Mocha, and find others