#!/bin/bash

project_directory = /srv/django1.6/fakoberkers/

find $project_directory -name "*.pyc" | xargs rm;
sudo service uwsgi restart;
sudo /etc/init.d/celeryd restart;
