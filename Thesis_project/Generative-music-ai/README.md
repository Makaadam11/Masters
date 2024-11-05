# Project Name

## Description

Provide a brief description of your project here.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- Node.js and npm (for the client)
- Python 3 (for the server)

### Installing

#### Client

Navigate to the `client` directory e.g. ./client :

```bash
cd client

# Install the dependencies:

npm install

# Start the development client:

npm start
```

##### Server

Navigate to the server directory:

```bash
cd server

# Create a new virtual environment:

python3 -m venv env

or

py -m venv env

# Activate the virtual environment:

unix:
source env/bin/activate

or

source env/Scripts/activate

windows:
Set-ExecutionPolicy RemoteSigned -Scope CurrentUser (set it up only once)
env\Scripts\activate

# Install the dependencies:

pip install -r requirements.txt
```

### Install ffmpeg

https://github.com/BtbN/FFmpeg-Builds/releases

and add to the path

than link ffmpeg to your virtual environment:

mklink ffmpeg.exe C:\path\to\ffmpeg\bin\ffmpeg.exe
mklink ffprobe.exe C:\path\to\ffmpeg\bin\ffprobe.exe

### Running the Application

#### Run Client

npm run start

#### Run Server

python app.py

### License

This project is licensed under the MIT License - see the LICENSE.md file for details.
