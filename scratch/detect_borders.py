import os
from PIL import Image

images = ['accessories.png', 'cat.png', 'dog.png', 'food.png']
base_dir = 'public/images/categories'

for name in images:
    p = os.path.join(base_dir, name)
    if os.path.exists(p):
        im = Image.open(p)
        w, h = im.size
        # Find where color changes significantly along the diagonal (x, x)
        prev_pixel = im.getpixel((0,0))
        transitions = []
        for x in range(0, w//2, 2):
            pix = im.getpixel((x, x))
            diff = sum(abs(a-b) for a, b in zip(pix[:3], prev_pixel[:3]))
            if diff > 15:
                transitions.append((x, pix[:3], diff))
            prev_pixel = pix
        print(f'{name} transitions in first half:', transitions[:10])
