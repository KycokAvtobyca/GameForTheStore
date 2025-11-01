from fastapi import FastAPI, Response, HTTPException, Request
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse
from fastapi.middleware.cors import CORSMiddleware
from utils import set_random_blocks_matrix, set_way
import uuid

sessions = {}

app = FastAPI()
app.mount("/static", StaticFiles(directory="static"), name="static")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5500"], # Разрешает запросы с любых доменов
    allow_methods=["GET"], # Разрешает любые HTTP-методы (GET, POST, PUT...)
    allow_headers=["*"], # Разрешает любые заголовки (например Content-Type, Authorization)
    allow_credentials=True
)

ROWS = 10
COLUMNS = 10
matrix_null = [[0 for _ in range(COLUMNS)] for _ in range(ROWS)]
matrix = None

@app.get("/")
async def root() -> HTMLResponse:
    with open("closest_way.html", "r", encoding="utf-8") as f:
        html = f.read()
    
    session_id = str(uuid.uuid4())
    sessions[session_id] = {}

    response = HTMLResponse(content=html)
    response.set_cookie(
        key="sessionid",
        value=session_id,
        httponly=True,
        max_age=3600,
        samesite="lax"
    )

    return response

@app.get("/api/check")
async def route_matrix(request: Request, el1: int, el2: int) -> dict:
    session_id = request.cookies.get('sessionid')
    print(session_id, el1, el2)

    if session_id not in sessions:
        raise HTTPException(status_code=401, detail="Сессия не найдена")

    if 99 >= el1 >= 0 and 99 >= el2 >= 0:
        # if 'matrix' in sessions[session_id]:
        #     del sessions[session_id]['matrix']

        # matrix[column_el1][row_el1] = 1
        # matrix[column_el2][row_el2] = 1
        try:
            sessions[session_id]['matrix'] = set_way([row[:] for row in matrix_null], el1, el2)
            print('session matrix')
            for i in sessions[session_id]['matrix']:
                print(i)
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Произошла ошибка на сервере при обработке запроса. {e}")
    else:
        raise HTTPException(status_code=400, detail="Индексы el1 и el2 должны быть от 0 до 99 включительно")

    return {"matrix": sessions[session_id]['matrix']}

@app.get("/apples")
async def random_apples():
    return {"apples": {}}

