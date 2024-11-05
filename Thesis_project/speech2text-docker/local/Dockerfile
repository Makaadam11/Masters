FROM python:3.8-slim

WORKDIR /api

COPY requirements.txt /api/

# Install ffmpeg
RUN apt-get update && \
    apt-get install -y ffmpeg && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*
    
RUN pip install --no-cache-dir -r requirements.txt

COPY . /api/

# Make port 8080 available to the world outside this container
EXPOSE 8082

CMD ["python", "api.py"]