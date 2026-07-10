@echo off
cd /d "%~dp0backend"
mvn.cmd spring-boot:run -Dspring-boot.run.profiles=local
