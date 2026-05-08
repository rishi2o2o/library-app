### First time setup:

1. start mysql server and setup database

```bash
brew services run mysql
mysql -u root < /Users/rishi/Documents/library-system/app/librarydb_setup.sql
```

2. setup virtual environment and install backend dependencies

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r backend/requirements.txt
```

3. Install frontend dependencies

```bash
npm --prefix frontend install
```

4. Configure environment variables

- Copy `backend/.env.example` to `backend/.env` and update values
- Copy `frontend/.env.example` to `frontend/.env` and update values



### Starting the app:

1. start database server

```bash
brew services run mysql
```

2. activate backend virtual environment 

```bash
source .venv/bin/activate
```

3. start backend server

```bash
python -m uvicorn backend.main:app --reload --host 127.0.0.1 --port 8001 --env-file backend/.env
```

4. start frontend server

```bash
npm --prefix frontend run dev -- --host 127.0.0.1 --port 5173
```


