app := ft-email-analytics

deploy:
    # Clean+install dependencies
    git clean -fxd
    npm install

    # Build steps:
    # None for now

    # Package+deploy
    @haikro build deploy \
        --app $(app) \
        --heroku-token $(HEROKU_AUTH_TOKEN) \
        --commit `git rev-parse HEAD`