# Customer Data Manipulation

Spring Boot REST API with a React dashboard for customer, order, and payment management.

## Stack

- **Backend:** Spring Boot (port `8082`), JWT auth, in-memory customer storage
- **Frontend:** React, Vite, Redux Toolkit, Axios, Yup, react-hot-toast
- **Default login:** `admin@test.com` / `password123`

## Run locally

### Backend
```bash
cd "E:\Spring Boot\BootProjREST5"
./mvnw spring-boot:run
```

### Frontend (development)
```bash
cd frontend
npm install
npm run dev
```

### Frontend (production build into Spring static)
```bash
cd frontend
npm install
npm run build
```

Then open: http://localhost:8082

## GitHub deployment

- **Repository:** https://github.com/Prajwalmaxx/customer-mangement
- **CI:** runs on every push (Maven + frontend build)
- **GitHub Pages (frontend UI):** https://prajwalmaxx.github.io/customer-mangement/

### Enable GitHub Pages (one time)

1. Open **Settings → Pages** in the repo
2. Under **Build and deployment**, set **Source** to **Deploy from a branch**
3. Choose **Branch:** `gh-pages` and **Folder:** `/ (root)`
4. Click **Save**
5. Wait 1–2 minutes, then open https://prajwalmaxx.github.io/customer-mangement/

> GitHub Pages hosts the React UI only. Login and API features need the Spring Boot backend running locally or on a cloud server.

## API endpoints

| Endpoint | Auth | Description |
|----------|------|-------------|
| `POST /api/auth/login` | Public | Login |
| `POST /api/auth/register` | Public | Register |
| `GET /api/auth/check-email` | Public | Email availability |
| `GET /report1` | JWT | Sample customer |
| `GET /customers` | JWT | List customers |
| `POST /register` | JWT | Create customer |
| `PUT /customers/{cno}` | JWT | Update customer |
| `DELETE /customers/{cno}` | JWT | Delete customer |

## Project structure

```
src/main/java/          Spring Boot backend
src/main/resources/static/   Built frontend assets
frontend/src/           React source code
```
