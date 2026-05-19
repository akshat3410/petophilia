import os
from PIL import Image

images = ['accessories.png', 'cat.png', 'dog.png', 'food.png']
base_dir = 'public/images/categories'

for name in images:
    p = os.path.join(base_dir, name)
    if os.path.exists(p):
        im = Image.open(p)
        w, h = im.size
        # Let's save a cropped version that removes the outer border and centers on the inner square!
        # In accessories.png and cat.png, let's see where the inner photo is.
        # Let's write a general cropping script that crops to the active content.
        # Actually, let's crop the outer 14% to 26% border.
        # Let's run a test by cropping different amounts and checking.
        pass
