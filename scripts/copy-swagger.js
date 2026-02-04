import fs from 'fs/promises';
import path from 'path';

const root = path.join(path.resolve(), '..');
// When running from project root, __dirname equivalent
const projectRoot = path.resolve();

const srcDist = path.join(projectRoot, 'node_modules', 'swagger-ui-dist');
const targetDir = path.join(projectRoot, 'public', 'api-docs');

async function copy() {
  try {
    await fs.mkdir(targetDir, { recursive: true });

    const files = [
      'swagger-ui.css',
      'swagger-ui-bundle.js',
      'swagger-ui-standalone-preset.js',
      'favicon-32x32.png',
      'favicon-16x16.png',
    ];

    for (const file of files) {
      const src = path.join(srcDist, file);
      const dest = path.join(targetDir, file);
      try {
        await fs.copyFile(src, dest);
        console.log(`Copied ${file}`);
      } catch (err) {
        console.warn(`Failed to copy ${file}: ${err.message}`);
      }
    }

    // Copy swagger.yaml from docs
    const swaggerSrc = path.join(projectRoot, 'docs', 'swagger.yaml');
    const swaggerDest = path.join(targetDir, 'swagger.yaml');
    try {
      await fs.copyFile(swaggerSrc, swaggerDest);
      console.log('Copied swagger.yaml');
    } catch (err) {
      console.warn('Failed to copy swagger.yaml:', err.message);
    }

    // Create a simple index.html that initializes Swagger UI from the static files
    const indexHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Swagger UI</title>
  <link rel="stylesheet" href="./swagger-ui.css">
</head>
<body>
  <div id="swagger-ui"></div>
  <script src="./swagger-ui-bundle.js"></script>
  <script src="./swagger-ui-standalone-preset.js"></script>
  <script>
    window.onload = function() {
      const ui = SwaggerUIBundle({
        url: './swagger.yaml',
        dom_id: '#swagger-ui',
        presets: [
          SwaggerUIBundle.presets.apis,
          SwaggerUIStandalonePreset
        ],
        layout: 'StandaloneLayout'
      });
      window.ui = ui;
    };
  </script>
</body>
</html>`;

    await fs.writeFile(path.join(targetDir, 'index.html'), indexHtml, 'utf8');
    console.log('Created index.html');

    console.log('Swagger static assets prepared in public/api-docs');
  } catch (err) {
    console.error('Error preparing swagger static assets:', err);
    process.exit(1);
  }
}

copy();
