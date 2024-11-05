Local:
curl -X POST -H "Content-Type: application/json" -d "{\"description\":\"melodic upbeat song\"}" http://localhost:8080/generate

docker build -t musicgen-gcp .

docker run -v C:/5.ComputionalEnt/generative-music-ai-v2/local:/app --gpus all -it -p 8080:8080 musicgen

docker run -v C:/5.ComputionalEnt/generative-music-ai-v2:/app/songs --gpus all -it -p 8080:8080 musicgen

GCP:
docker build -t musicgen-gcp .

docker tag musicgen-gcp europe-west2-docker.pkg.dev/musicgenproj/generative-music-ai/musicgen-gcp

docker push europe-west2-docker.pkg.dev/musicgenproj/generative-music-ai/musicgen-gcp

gcloud run deploy --image europe-west2-docker.pkg.dev/musicgenproj/generative-music-ai/musicgen-gcp --platform managed --memory=1Gi