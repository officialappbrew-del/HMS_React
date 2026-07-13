const esbuild = require('esbuild');
const fs = require('fs');
const file = 'C:/Users/Ekene-onwon/Desktop/Codes/HosPManagement/HMS/src/pages/PatientManagement.jsx';
esbuild.transformSync(fs.readFileSync(file, 'utf8'), { loader: 'jsx', jsx: 'automatic' });
console.log('PatientManagement.jsx transform OK');
