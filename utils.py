import random

def set_random_blocks_matrix(matrix):
    for f in range(random.randint(5, 8)):
        x = random.randint(0, 9)
        y = random.randint(0, 9)

        print('blocks', f)

        matrix[y][x] = 2
        
        block_length = random.randint(3, 7)
        print('block_length', block_length)
        for _ in range(block_length-1):
            directions = []
            
            if x < 9:
                directions.append((1, 0))
            if x > 0:
                directions.append((-1, 0))
            if y < 9:
                directions.append((0, 1))
            if y > 0:
                directions.append((0, -1))

            if directions:
                dx, dy = random.choice(directions)
                x += dx
                y += dy
                matrix[y][x] = 2
            else:
                break

def set_way(matrix, el1, el2):
    set_random_blocks_matrix(matrix)
    print(matrix)

    y, x = divmod(el1, 10)
    target_y, target_x = divmod(el2, 10)

    check = 0

    while True:
        if (matrix[y][x] == 2):
            return matrix
        elif check == 0:
            matrix[y][x] = 1
            check += 1
            continue
        
        print('check while', matrix)

        left = False
        down = False

        if x > target_x:
            left = True
        
        if y > target_y:
            down = True
        
        if x != target_x:
            x += -1 if left else 1

            if matrix[y][x] == 2:
                return matrix

            matrix[y][x] = 1

        if y != target_y:
            y += -1 if down else 1

            if matrix[y][x] == 2:
                return matrix

            matrix[y][x] = 1

        if y == target_y and x == target_x:
            return matrix