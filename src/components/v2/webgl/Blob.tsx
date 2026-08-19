"use client";

import * as React from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { BLOB } from "@/lib/v2/anim-config";
import type { BlobState } from "./choreography";
import { BLOB_VERT } from "./shaders/blob.vert.glsl";
import { BLOB_FRAG } from "./shaders/blob.frag.glsl";
import type { MouseState } from "@/lib/v2/use-mouse";

/**
 * Blob paleti — teal + gold'dan türetilmiş, shader içinde beyaza lift'lenir.
 * Ham hex burada duruyor çünkü GPU uniform'u CSS değişkeni okuyamaz;
 * değerler `src/lib/design/tokens.ts` ile birebir aynıdır.
 */
const PALETTE = {
  c1: "#2C5566", // teal-700 — en derin ton, yalnız alt kenarda
  c2: "#4F8294", // teal-500
  c3: "#AEC7D1", // teal-300
  c4: "#C9A881", // gold-400
  c5: "#FFFFFF", // highlight
  /** Pastel lift oranı — sedefli his buradan çıkıyor. */
  lift: 0.5,
} as const;

const _ray = new THREE.Raycaster();
const _sphere = new THREE.Sphere();
const _hit = new THREE.Vector3();
const _local = new THREE.Vector3();
const _pointer = new THREE.Vector2();

export function Blob({
  state,
  mouse,
  reducedMotion,
  isMobile,
}: {
  state: React.RefObject<BlobState>;
  mouse: React.RefObject<MouseState>;
  reducedMotion: boolean;
  isMobile: boolean;
}) {
  const meshRef = React.useRef<THREE.Mesh>(null);
  const { camera, size } = useThree();

  /**
   * Materyal imperatif kurulur ve `<primitive>` ile bağlanır.
   *
   * `<shaderMaterial uniforms={...} />` ile deklaratif verildiğinde R3F
   * uniform objesini KLONLUYOR. Dışarıdaki referansı her frame güncellemek
   * GPU'ya hiçbir şey iletmiyordu: mouse etkileşimi, `noiseAmp` ve `opacity`
   * keyframe'leri sessizce ölüydü (materyalin `uMouseStrength` değeri sabit
   * 0 kalıyordu). Materyali kendimiz kurup `material.uniforms` üzerinden
   * yazınca kimlik garanti altına alınıyor.
   */
  const material = React.useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: BLOB_VERT,
        fragmentShader: BLOB_FRAG,
        transparent: true,
        depthWrite: true,
        side: THREE.FrontSide,
        uniforms: {
          uTime: { value: 0 },
          uNoiseAmp: { value: 0.08 },
          uNoiseFreq: { value: BLOB.noiseFreq },
          uWobbleAmp: { value: BLOB.wobbleAmp },
          uMouse: { value: new THREE.Vector3(0, 0, 1) },
          uMouseStrength: { value: 0 },
          uMouseRadius: { value: BLOB.mouseRadius },
          uDentDepth: { value: BLOB.dentDepth },
          uRippleAmp: { value: BLOB.rippleAmp },
          uC1: { value: new THREE.Color(PALETTE.c1) },
          uC2: { value: new THREE.Color(PALETTE.c2) },
          uC3: { value: new THREE.Color(PALETTE.c3) },
          uC4: { value: new THREE.Color(PALETTE.c4) },
          uC5: { value: new THREE.Color(PALETTE.c5) },
          uOpacity: { value: 1 },
          uLift: { value: PALETTE.lift },
        },
      }),
    [],
  );

  React.useEffect(() => () => material.dispose(), [material]);

  /** Kamera mesafesindeki görünür alan — koreografi oranlarını dünyaya çevirir. */
  const visible = React.useMemo(() => {
    const cam = camera as THREE.PerspectiveCamera;
    const dist = cam.position.z;
    const h = 2 * Math.tan((cam.fov * Math.PI) / 180 / 2) * dist;
    return { h, w: h * (size.width / Math.max(1, size.height)) };
  }, [camera, size.width, size.height]);

  // Hedefe doğru yumuşatılan mouse değerleri (spec §3.2.3)
  const smooth = React.useRef({ strength: 0, point: new THREE.Vector3(0, 0, 1) });
  /** Hız ölçümü için bir önceki FRAME'in pointer konumu. */
  const prevNdc = React.useRef({ x: 0, y: 0, seeded: false });

  // Dev'de doğrulama ve tune için
  React.useEffect(() => {
    if (process.env.NODE_ENV === "production") return;
    const w = window as unknown as Record<string, unknown>;
    w.__blobMouse = smooth.current;
    w.__blobMaterial = material;
  }, [material]);

  useFrame((_, delta) => {
    const mesh = meshRef.current;
    const s = state.current;
    if (!mesh || !s) return;
    const u = material.uniforms;

    // --- Koreografi: oran → dünya koordinatı
    const scale = s.scale * (isMobile ? BLOB.mobileScaleFactor : 1);
    const yRatio = s.y + (isMobile ? BLOB.mobileYOffset : 0);
    const radius = (scale * visible.h) / 2;
    mesh.position.set((s.x * visible.w) / 2, (yRatio * visible.h) / 2, 0);
    mesh.scale.setScalar(radius);

    u.uNoiseAmp!.value = s.noiseAmp;
    u.uOpacity!.value = s.opacity;
    mesh.visible = s.opacity > BLOB.cullOpacity;
    if (!mesh.visible) return;

    // --- Zaman
    const timeScale = reducedMotion ? BLOB.reducedMotionTimeScale : BLOB.timeScale;
    u.uTime!.value += delta * timeScale;

    // Gövdenin kendi ekseninde çok yavaş sürüklenmesi: parlamalar yüzeyde
    // gezinir, cisim "duran bir kütle" olmaktan çıkar. Noise obje uzayında
    // olduğu için loblar gövdeyle birlikte döner — doğru davranış.
    if (!reducedMotion) {
      mesh.rotation.y += delta * BLOB.driftSpeed.y;
      mesh.rotation.x += delta * BLOB.driftSpeed.x;
    }
    // Raycast obje uzayına dönüşüm için güncel matris ister; konum, ölçek ve
    // rotasyon bu frame'de değişti.
    mesh.updateMatrixWorld();

    // --- Mouse: ekran ışını ile blob küresini kesiştir
    const m = mouse.current;
    let targetStrength = 0;

    // Hız, olay başına değil FRAME başına ölçülür (NDC birimi / saniye).
    // Olay başına ölçüm, tarayıcının kaç mousemove ürettiğine bağlıydı ve
    // hızlı harekette tutarsız sonuç veriyordu.
    let speed = 0;
    if (m) {
      if (prevNdc.current.seeded) {
        speed =
          Math.hypot(m.ndc.x - prevNdc.current.x, m.ndc.y - prevNdc.current.y) /
          Math.max(delta, 1 / 240);
      }
      prevNdc.current.x = m.ndc.x;
      prevNdc.current.y = m.ndc.y;
      prevNdc.current.seeded = true;
    }

    if (m?.active) {
      _pointer.set(m.ndc.x, m.ndc.y);
      _ray.setFromCamera(_pointer, camera);
      _sphere.center.copy(mesh.position);
      _sphere.radius = radius;

      if (_ray.ray.intersectSphere(_sphere, _hit)) {
        // Dünya → obje uzayı. `worldToLocal` matrisin TAMAMININ tersini
        // uygular; konum/ölçek farkını elle çıkarmak rotasyonu atlıyordu ve
        // gövde döndükçe çukur cursor'dan kayıyordu.
        _local.copy(_hit);
        mesh.worldToLocal(_local);
        _local.normalize();

        // Uzaklığa bağlı, frame-rate bağımsız takip: yavaşta yumuşak,
        // hızlı sweep'te çukur cursor'a yetişir.
        const dist = smooth.current.point.distanceTo(_local);
        const rate = BLOB.mouseFollowRate * (1 + dist * BLOB.mouseCatchUp);
        const step = Math.min(1 - Math.exp(-rate * delta), BLOB.mouseMaxStep);
        smooth.current.point.lerp(_local, step);

        const boost = Math.min(speed * BLOB.velocityGain, BLOB.velocityClamp);
        targetStrength = BLOB.baseStrength + boost;
      }
    }

    // Yükseliş ve sönümleme, ikisi de frame-rate bağımsız
    const rate =
      targetStrength > smooth.current.strength
        ? BLOB.strengthAttackRate
        : 1 / BLOB.mouseDecay;
    smooth.current.strength +=
      (targetStrength - smooth.current.strength) * (1 - Math.exp(-rate * delta));

    (u.uMouse!.value as THREE.Vector3).copy(smooth.current.point);
    u.uMouseStrength!.value = smooth.current.strength;
  });

  const detail = isMobile ? BLOB.detailMobile : BLOB.detail;

  return (
    <mesh ref={meshRef} frustumCulled={false}>
      <icosahedronGeometry args={[1, detail]} />
      <primitive object={material} attach="material" />
    </mesh>
  );
}
