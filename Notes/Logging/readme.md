## What is logger?

Logger is used to log information about different events in the system.
A logger has 5 different levels of logging in a specific order:
'fatal', 'error', 'warn', 'info', 'debug'
Each of these log levels has its own method on the logging instance. You can set the maximum log level on a logger at runtime.

## Packages for logger

There are various packages available which can be used for logging messages.
Winston
Morgan
Bunyan
Pino
Loglevel
Npmlog
tracer
cabin
awesome-log
log4js etc.

## Winston

Winston is a simple & most used logging library for logging messages in multiple transports(transport is a storage device).
We can set logs for multiple transports at different levels like info,warn,error,fatal,debug.
We can log messages in console, file or either in database simultaneusly at the same time.

## Flex logge

This npm package is used to save logs inside the Database. It can be used to store logs in mysql or mongodb database.

There are five levels of logs
FATAL: 0
ERROR: 10
WARN: 20
INFO: 30
DEBUG: 40
