/* eslint-disable */
const fs = require('fs');
const path = require('node:path');

const iconsDir = path.resolve(__dirname, '../assets/img/svg');
const outputSpriteDir = path.resolve(__dirname, '../assets/img/sprite.svg');
const outputTypesDir = path.resolve(__dirname, '../components/types/icon.ts');
const icons = fs.readdirSync(iconsDir);
const iconTypes = [];

const spriteContent = icons.reduce((result, icon) => {
  const iconName = icon.replace('.svg', '');

  // костыль который бы убрать
  if (iconName === '.DS_Store')
    return result

  const iconPath = path.join(iconsDir, icon);

  iconTypes.push(`  ${iconName} = '${iconName}'`);

  result += fs.readFileSync(iconPath, 'utf8')
    .replace('<svg', `<symbol id="${iconName}"`)
    .replace('</svg', '</symbol')
    .replace(/\n/g, '');

  return result;
}, '');

const types = `export enum IconTypes {
${iconTypes.join(',\n')},
}
`;
const sprite = `<svg>${spriteContent}</svg>`

fs.writeFileSync(outputSpriteDir, sprite);
fs.writeFileSync(outputTypesDir, types);
