import random
from collections import deque


# Удаляет старые 2 и генерирует новые змейки из 2
def set_random_blocks_matrix(matrix, forbidden=None):
    if forbidden is None:
        forbidden = set()

    for ry in range(len(matrix)):
        for rx in range(len(matrix[0])):
            if matrix[ry][rx] == 2:
                matrix[ry][rx] = 0

    rows = len(matrix)
    cols = len(matrix[0])

    for f in range(random.randint(5, 8)):
        attempts = 0
        while True:
            x = random.randint(0, cols - 1)
            y = random.randint(0, rows - 1)
            attempts += 1
            if (y, x) not in forbidden and matrix[y][x] != 2:
                break
            if attempts > 100:
                break

        if attempts > 100:
            continue

        matrix[y][x] = 2

        block_length = random.randint(3, 7)
        for _ in range(block_length - 1):
            directions = []
            if x < cols - 1:
                directions.append((1, 0))
            if x > 0:
                directions.append((-1, 0))
            if y < rows - 1:
                directions.append((0, 1))
            if y > 0:
                directions.append((0, -1))

            if not directions:
                break

            dx, dy = random.choice(directions)
            nx, ny = x + dx, y + dy

            # не перекрываем forbidden
            if (ny, nx) in forbidden:
                break

            x, y = nx, ny
            matrix[y][x] = 2

# BFS: если путь найден - помечаем путь значением 1 и возвращаем True.
# Если не найден - возвращаем False (без изменений 1)
def dev_alg(matrix, start_y, start_x, target_x, target_y):
    rows = len(matrix)
    cols = len(matrix[0])
    queue = deque([(start_x, start_y, [])])
    visited = set()

    while queue:
        x, y, path = queue.popleft()

        if (x, y) in visited or matrix[y][x] == 2:
            continue

        if x == target_x and y == target_y:
            for px, py in path + [(x, y)]:
                matrix[py][px] = 1
            return True

        visited.add((x, y))

        for dx, dy in [(0, 1), (1, 0), (0, -1), (-1, 0)]:
            nx, ny = x + dx, y + dy
            if 0 <= nx < cols and 0 <= ny < rows and (nx, ny) not in visited and matrix[ny][nx] != 2:
                queue.append((nx, ny, path + [(x, y)]))

    # путь не найден
    return False

def _clear_marks(matrix):
    """Убираем старые метки пути (1) и старт (3) перед новой попыткой"""
    for ry in range(len(matrix)):
        for rx in range(len(matrix[0])):
            if matrix[ry][rx] in (1, 3):
                matrix[ry][rx] = 0


# Основная функция по логике:
# генерирует препятствия,
# если старт/цель == 2 - генерирует заново,
# если путь не найден - генерирует заново,
# возвращает матрицу с помеченным путем (1) и стартом (3) либо текущее состояние после max_attempts
def set_way(matrix, el1, el2, max_attempts=100):
    rows = len(matrix)
    cols = len(matrix[0])

    start_y, start_x = divmod(el1, cols)
    target_y, target_x = divmod(el2, cols)
    forbidden = {(start_y, start_x), (target_y, target_x)}

    for attempt in range(1, max_attempts + 1):
        _clear_marks(matrix)

        set_random_blocks_matrix(matrix, forbidden=forbidden)

        if matrix[start_y][start_x] == 2 or matrix[target_y][target_x] == 2:
            print(f"Попытка {attempt}: старт или цель оказались заблокированы — генерируем заново")
            continue

        matrix[start_y][start_x] = 3

        found = dev_alg(matrix, start_y, start_x, target_x, target_y)
        if found:
            return matrix
        else:
            print(f"Попытка {attempt}: путь не найден — генерируем заново")
            continue

    print("Не удалось найти путь за максимальное количество попыток.")
    return matrix
