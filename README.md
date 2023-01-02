# Warehouse bookings

## Getting started

- Install docker(either vai `brew install docker` or by downloading [Docker desktop](https://www.docker.com/products/docker-desktop/))
- Install ruby `3.0`
  - rbenv - `rbenv install` in the project directory
  - rvm - `rvm install` in the project directory
- Install Node.js and yarn
- Run `bundle install`
- Run `yarn install`
- Start PostgreSQL via `docker-compose up -d`
  - this shouldn't interfere with an already existing PostgreSQL database as it is running on the `5433` port, but to be safe that there is nothing running on that same port, you can run `lsof -i :5433` beforehand to check
- Run `bin/rails db:setup` to create development and testing databases and to seed initial bookings.

### Starting the server

`bin/dev`

### Running tests

`bundle exec rspec spec`
