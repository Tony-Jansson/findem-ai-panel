#!/bin/bash

cd /home/findemgroup/panel
source venv/bin/activate
uvicorn backend.main:app --host 0.0.0.0 --port 8000
