FROM python:3.12

WORKDIR /app

COPY requirement.txt /app/requirement.txt

RUN pip install --no-cache-dir --upgrade -r /app/requirement.txt

COPY . /app