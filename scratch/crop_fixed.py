import os
from PIL import Image

images = ['accessories.png', 'cat.png', 'dog.png', 'food.png']
base_dir = 'public/images/categories'

for name in images:
    p = os.path.join(base_dir, name)
    if os.path.exists(p):
        im = Image.open(p)
        w, h = im.size
        # Crop 18% from each side
        border_pct = 0.18
        left = int(w * border_pct)
        top = int(h * border_pct)
        right = int(w * (1 - border_pct))
        bottom = int(h * (1 - border_pct))
        
        cropped_im = im.crop((left, top, right, bottom))
        cropped_im.save(p)
        print(f'Cropped fixed {name} to {right-left}x{bottom-top}')
