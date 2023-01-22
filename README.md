<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  # DEV

  1. Renombrar el .envtemplate a .env
  2. npm install
  3. levantar la imagen de docker
  ```
    docker-compose up -d
  ```
  4. Levantar servidor
  ```
  npm run start:dev
  ```

  5. visitar la url
  ```
  http://localhost:3000/graphql
  
  ```

  6. Ejecutar la _"@Mutation"_ executeSeed para llenar la base de datos