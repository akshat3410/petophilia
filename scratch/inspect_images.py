import os
from PIL import Image

images = ['accessories.png', 'cat.png', 'dog.png', 'food.png']
base_dir = 'public/images/categories'

for name in images:
    p = os.path.join(base_dir, name)
    if os.path.exists(p):
        im = Image.open(p)
        print(f'=== {name} ===')
        print('Size:', im.size)
        # Check corner pixel vs center pixel
        w, h = im.size
        print('Corners: TL:', im.getpixel((5, 5)), 'TR:', im.getpixel((w-5, 5)), 'BL:', im.getpixel((5, h-5)), 'BR:', im.getpixel((w-5, h-5)))
        # Check center pixel
        print('Center:', im.getpixel((w//2, h//2)))
        
        # Let's find columns/rows that are uniform (background borders)
        # Let's scan along x = w//2 for vertical boundaries
        vert_scan = [im.getpixel((w//2, y))[:3] for y in range(0, h, h//40)]
        print('Vertical scan (10 points):', vert_scan[:15])
