import sharp from "sharp";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const logoRoot = path.resolve(__dirname, "../../assets/logo");
const appAssets = path.resolve(__dirname, "../assets");
async function gen() {
  const iconPng = path.join(logoRoot, "kingfisher-icon-1024.png");
  await sharp(iconPng).resize(1024, 1024).png().toFile(path.join(appAssets, "icon.png"));
  console.log("A1 icon.png", fs.statSync(path.join(appAssets, "icon.png")).size);
  const fgSvg = fs.readFileSync(path.join(logoRoot, "kingfisher-foreground-1024.svg"));
  await sharp(fgSvg, { density: 300 }).resize(432, 432).png().toFile(path.join(appAssets, "icon_foreground.png"));
  console.log("A2 icon_foreground.png", fs.statSync(path.join(appAssets, "icon_foreground.png")).size);
  const monoSvg = fs.readFileSync(path.join(logoRoot, "kingfisher-mono-1024.svg"));
  await sharp(monoSvg, { density: 300 }).resize(432, 432).png().toFile(path.join(appAssets, "icon_monochrome.png"));
  console.log("A3 icon_monochrome.png", fs.statSync(path.join(appAssets, "icon_monochrome.png")).size);
  await sharp(fgSvg, { density: 300 }).resize(432, 432).png().toFile(path.join(appAssets, "splash.png"));
  console.log("A4 splash.png", fs.statSync(path.join(appAssets, "splash.png")).size);
  const monoBuf = await sharp(monoSvg, { density: 300 }).resize(96, 96).png().toBuffer();
  const { data, info } = await sharp(monoBuf).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const whiteData = Buffer.alloc(data.length);
  for (let i = 0; i < data.length; i += 4) {
    const a = data[i + 3];
    whiteData[i] = 255; whiteData[i + 1] = 255; whiteData[i + 2] = 255; whiteData[i + 3] = a;
  }
  await sharp(whiteData, { raw: { width: info.width, height: info.height, channels: 4 } }).png().toFile(path.join(appAssets, "notification.png"));
  console.log("A5 notification.png", fs.statSync(path.join(appAssets, "notification.png")).size);
}
gen().catch((e) => { console.error(e); process.exit(1); });
