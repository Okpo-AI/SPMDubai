import re

html = open("index.html").read()

# Pattern grabs the address block and the photos block
# Since we know the wrapper ends with "</div>\n            </div>", we can just match it precisely.
# We'll use a very robust regex.

def replacer(match):
    address_block = match.group(1)
    photos_block = match.group(2)
    return photos_block + '\n' + address_block

# Try matching `<div class="office-address" ...>...</div>` and `<div class="office-photos">...</div>`
pattern = r'(<div class="office-address"[^>]*>.*?</div>)\s*(<div class="office-photos">.*?</div>\n\s*</div>)'

# Wait, the inner div for slideshow also has a closing div...
# Let's match line by line.
