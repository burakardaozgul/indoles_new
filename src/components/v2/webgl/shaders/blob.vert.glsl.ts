import { NOISE_GLSL } from "./noise.glsl";

/**
 * Blob vertex shader — yüzey gerilimi salınımı + organik FBM + mouse çukuru.
 *
 * "Ağır kütle" yerine "sıfır yerçekiminde su damlası" hissi üç şeyden gelir:
 *   1. Düşük mod harmonik salınım (l=2/l=3): gövde bir eksende yassılırken
 *      diğerinde uzar. Gerçek damlaların yüzey gerilimi modları budur ve
 *      silüeti bütün olarak esnetir — yüzeye yumru eklemez.
 *   2. Düşük frekanslı FBM: birkaç büyük lob, çakıl dokusu değil.
 *   3. Sürekli ve fark edilir hızda zaman ilerlemesi. Çok yavaş bir noise
 *      donmuş bir cisim gibi okunur.
 *
 * Normaller displacement sonrası yeniden hesaplanır (spec §3.2.4); teğet ve
 * bit-teğet komşuları aynı deformasyondan geçirilip çapraz çarpım alınır.
 */
export const BLOB_VERT = /* glsl */ `
uniform float uTime;
uniform float uNoiseAmp;
uniform float uNoiseFreq;
uniform float uWobbleAmp;
uniform vec3  uMouse;
uniform float uMouseStrength;
uniform float uMouseRadius;
uniform float uDentDepth;
uniform float uRippleAmp;

varying vec3 vNormalW;
varying vec3 vViewDir;
varying vec3 vPosLocal;
varying float vDent;
varying float vBlotch;

${NOISE_GLSL}

/**
 * Yüzey gerilimi salınımı — düşük dereceli küresel harmonikler.
 * Üç mod farklı ve birbirine oransız hızlarda döner, böylece hareket
 * hiç tekrar etmiyormuş gibi hisseder.
 */
float wobbleAt(vec3 d) {
  // l=2 modları
  float m2a = d.x * d.x - d.y * d.y;
  float m2b = d.x * d.y;
  float m2c = d.y * d.z;
  // l=3 modu — asimetriyi kırar
  float m3  = d.z * (d.x * d.x - d.y * d.y);

  return m2a * sin(uTime * 0.9)
       + m2b * sin(uTime * 1.27 + 1.7)
       + m2c * sin(uTime * 0.71 + 3.1)
       + m3  * sin(uTime * 1.53 + 0.6) * 0.7;
}

/** Yüzeyin birim küre üzerindeki bir noktadaki toplam yer değiştirmesi. */
float displacementAt(vec3 dir) {
  // 1) Bütün gövdeyi esneten salınım
  float base = wobbleAt(dir) * uWobbleAmp;

  // 2) Yavaşça sürüklenen organik detay
  base += fbm2(dir * uNoiseFreq + uTime * 0.35) * uNoiseAmp;

  // 3) Mouse çukuru + etrafında halka dalgası
  float d = distance(dir, uMouse);
  float dent = exp(-pow(d / uMouseRadius, 2.0));
  float ripple = sin(d * 7.0 - uTime * 5.0) * uRippleAmp * dent;
  base += (-dent * uDentDepth + ripple) * uMouseStrength;

  return base;
}

/** Birim küre üzerindeki yönü deforme edilmiş dünya-öncesi konuma çevirir. */
vec3 displaced(vec3 dir) {
  return dir * (1.0 + displacementAt(dir));
}

void main() {
  vec3 dir = normalize(position);

  // Teğet uzayı: normal ile hizalı olmayan bir referans vektörden türetilir
  vec3 ref = abs(dir.y) < 0.99 ? vec3(0.0, 1.0, 0.0) : vec3(1.0, 0.0, 0.0);
  vec3 tangent = normalize(cross(ref, dir));
  vec3 bitangent = cross(dir, tangent);

  // 0.02'de komşu örnekler çok yakın kalıp yüzeyi "buruşuk kağıt" gösteriyordu.
  const float EPS = 0.05;
  vec3 p  = displaced(dir);
  vec3 pt = displaced(normalize(dir + tangent * EPS));
  vec3 pb = displaced(normalize(dir + bitangent * EPS));

  vec3 newNormal = normalize(cross(pt - p, pb - p));
  // Çapraz çarpımın yönü teğet seçimine göre ters dönebilir; dışa bakmaya zorla
  if (dot(newNormal, dir) < 0.0) newNormal = -newNormal;

  // Cam benzeri gövde için normali küresel normale doğru yumuşat: yüzey
  // detayı kalır ama ışık yumruların üstünde kırılmaz.
  newNormal = normalize(mix(newNormal, dir, 0.30));

  vec4 mvPosition = modelViewMatrix * vec4(p, 1.0);

  vNormalW  = normalize(normalMatrix * newNormal);
  vViewDir  = normalize(-mvPosition.xyz);
  vPosLocal = p;
  vDent     = exp(-pow(distance(dir, uMouse) / uMouseRadius, 2.0)) * uMouseStrength;
  // Sedefli renk lekeleri: fragment'te hesaplanınca DPR 2'de milyonlarca
  // ekstra noise çağrısı oluyordu. Alan düşük frekanslı, vertex'te örneklenip
  // interpolasyona bırakılması görsel olarak ayırt edilemiyor.
  vBlotch   = snoise(p * 1.1 + vec3(0.0, uTime * 0.18, uTime * 0.1));

  gl_Position = projectionMatrix * mvPosition;
}
`;
