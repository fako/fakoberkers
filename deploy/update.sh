#!/bin/bash

find ../ -name "*.pyc" | xargs rm;
sudo service uwsgi restart;
sudo /etc/init.d/celeryd restart;
