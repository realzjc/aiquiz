# aiquiz

## backend

Start the Python FastAPI backend locally
``` bash
cd backend
uvicorn app.main:app --host 127.0.0.1 --port 8000
```

http://localhost:8000/

## frontend

Start React using npm
``` bash
cd frontend
npm run dev
```

http://localhost:5173/

## docker 
remove old dependencies and volume(database) and build new one
``` bash
docker compose down -v
docker compose build --no-cache
docker compose up

docker compose up --build --remove-orphans
```
docker system prune -a --volumes 删除不需要的

className="bg-white text-black shadow-lg border border-gray-200"