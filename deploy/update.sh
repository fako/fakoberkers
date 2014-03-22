#!/bin/bash

PROJECT_DIR=/srv/django1.6/fakoberkers/

find $PROJECT_DIR -name "*.pyc" | xargs rm;
sudo service uwsgi restart;
sudo /etc/init.d/celeryd restart;
