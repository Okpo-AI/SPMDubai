import re

with open('styles.css', 'r') as f:
    css = f.read()

start_marker = "/* ========================================\n   Collections IQ Features"
end_marker = "/* ========================================\n   Recovery Lifecycle"

start_idx = css.find(start_marker)
end_idx = css.find(end_marker)

if start_idx != -1 and end_idx != -1:
    with open('new_ciq_css2.txt', 'r') as f2:
        new_css = f2.read()
    
    css = css[:start_idx] + new_css + "\n\n" + css[end_idx:]
    
    with open('styles.css', 'w') as f:
        f.write(css)
    print("Replaced successfully")
else:
    print(f"Markers not found: start={start_idx}, end={end_idx}")
