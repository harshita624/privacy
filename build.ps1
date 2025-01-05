# Clean install
Remove-Item -Path node_modules -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item package-lock.json -Force -ErrorAction SilentlyContinue

# Install dependencies
npm install

# Ensure expo is installed globally
npm install -g expo

# Run the build
npm run build