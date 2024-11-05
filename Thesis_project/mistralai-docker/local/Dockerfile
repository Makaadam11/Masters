# Use an official Python runtime as a parent image
FROM python:3.9-slim-buster

# Set the working directory in the container to /app
WORKDIR /api

# Copy the current directory contents into the container at /app
COPY . /api

# Upgrade pip
RUN pip -q install --upgrade pip

RUN pip -q install langchain-community --trusted-host mirrors.cloud.tencent.com

# Install any needed packages specified in requirements.txt
RUN pip -q install langchain flask huggingface_hub transformers sentence_transformers accelerate bitsandbytes

# Make port 80 available to the world outside this container
EXPOSE 8081

# Run api.py when the container launches
CMD ["python", "api.py"]