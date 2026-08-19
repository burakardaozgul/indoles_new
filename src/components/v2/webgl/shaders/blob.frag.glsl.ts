/**
 * Blob fragment shader — iridesan, cam benzeri yüzey.
 *
 * Referanstaki his üç şeyden geliyor: (1) yüzeyin içinde yavaşça gezinen
 * bulanık renk lekeleri, (2) iki lobelı güçlü specular — geniş bir yayılım
 * artı sıkı bir parlama, (3) kenarlarda her zaman beyaza yakın fresnel.
 * Hiçbir bölge saf siyaha inmez.
 */
export const BLOB_FRAG = /* glsl */ `
uniform float uTime;
uniform vec3  uC1;
uniform vec3  uC2;
uniform vec3  uC3;
uniform vec3  uC4;
uniform vec3  uC5;
uniform float uOpacity;
uniform float uLift;
uniform float uMouseRadius;

varying vec3 vNormalW;
varying vec3 vViewDir;
varying vec3 vPosLocal;
varying float vDent;
varying float vBlotch;

/** 5 duraklı gradyan — smoothstep'li geçişler. */
vec3 rampColor(float t) {
  vec3 c = uC1;
  c = mix(c, uC2, smoothstep(0.00, 0.26, t));
  c = mix(c, uC3, smoothstep(0.20, 0.52, t));
  c = mix(c, uC4, smoothstep(0.46, 0.76, t));
  c = mix(c, uC5, smoothstep(0.72, 1.00, t));
  return c;
}

void main() {
  vec3 N = normalize(vNormalW);
  vec3 V = normalize(vViewDir);

  float fres = pow(1.0 - clamp(dot(N, V), 0.0, 1.0), 2.2);

  // Sedefli renk lekeleri vertex'ten interpolasyonla geliyor (bkz. vert shader)
  float t = N.y * 0.42 + 0.5;
  t += vBlotch * 0.20;
  t += fres * 0.18;
  t += sin(uTime * 0.04 + vPosLocal.x * 2.0) * 0.06; // iridesan kayma
  t = clamp(t, 0.0, 1.0);
  // Eğri açık uca kaydırılır: düz dağılımda koyu teal gövdenin alt yarısını
  // kaplıyor ve sedefli his kayboluyordu.
  t = pow(t, 0.78);

  vec3 color = rampColor(t);

  // Pastel lift
  color = mix(color, vec3(1.0), uLift);

  // Fresnel rim: kenarlar her zaman aydınlık
  color = mix(color, uC5, fres * 0.55);

  // İki lobelı specular — cam/sabun köpüğü parlaklığı
  vec3 L1 = normalize(vec3(0.35, 0.80, 0.55));
  vec3 L2 = normalize(vec3(-0.45, 0.35, 0.80));
  float broad = pow(max(dot(N, L1), 0.0), 5.0) * 0.26;
  float tight = pow(max(dot(N, L1), 0.0), 42.0) * 0.55;
  float fill  = pow(max(dot(N, L2), 0.0), 12.0) * 0.16;
  color += vec3(broad + tight + fill);

  // Cursor izi: çukurun içi hafif serinler, kenarında ıslak bir parlama olur
  color = mix(color, uC3, vDent * 0.22);
  color += vec3(smoothstep(0.35, 0.85, vDent) * 0.18);

  // Taban aydınlık: en koyu bölge bile renkli kalır
  color = max(color, uC1 * 0.62);

  gl_FragColor = vec4(color, uOpacity);
}
`;
