Before following the instructions below, please ensure you have a local .env file. How to set up dev environment:

```
git clone https://github.com/app-academy-exercises-jb/code-dueler.git
cd client 
  && npm install 
  && cd ../server
  && npm install && cd ..
docker-compose up
```

The Dockerfile in the root of the project builds the production image currently hosted at https://hub.docker.com/r/jorgebarreto/code-dueler