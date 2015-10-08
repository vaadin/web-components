#!/bin/bash

# Get the source files.
git clone https://github.com/vaadin/vaadin-icons-files.git

# Header.
cat > vaadin-icons.html <<'ENDL'
<link rel="import" href="../iron-icon/iron-icon.html">
<link rel="import" href="../iron-iconset-svg/iron-iconset-svg.html">
<iron-iconset-svg name="vaadin-icons" size="64">
<svg><defs>
ENDL

# Combine the SVGs.
find vaadin-icons-files/svg/* | xargs -I {} node read-svg.js {} >> vaadin-icons.html

# Footer.
cat >> vaadin-icons.html <<'ENDL'
</defs></svg>
</iron-iconset-svg>
ENDL
