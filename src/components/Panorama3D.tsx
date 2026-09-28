import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const BASE = import.meta.env.BASE_URL;

// BoxGeometry material order: [+X, -X, +Y, -Y, +Z, -Z].
// Applied UV rotations: +X=0deg, -X=0deg, +Y=0deg, -Y=0deg, +Z=0deg, -Z=0deg.
// Adjust only the +Y/-Y entries to 90deg, 180deg, or 270deg if their seams need it.
const PANORAMA_FACES = [
  { src: `${BASE}gui/title/background/panorama_0.png`, rotationDegrees: 0 },
  { src: `${BASE}gui/title/background/panorama_1.png`, rotationDegrees: 0 },
  { src: `${BASE}gui/title/background/panorama_2.png`, rotationDegrees: 0 },
  { src: `${BASE}gui/title/background/panorama_3.png`, rotationDegrees: 0 },
  { src: `${BASE}gui/title/background/panorama_4.png`, rotationDegrees: 0 },
  { src: `${BASE}gui/title/background/panorama_5.png`, rotationDegrees: 0 },
] as const;

const ROTATION_SPEED = 0.02;

export function Panorama3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, 10);
    camera.position.set(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.domElement.style.position = 'fixed';
    renderer.domElement.style.inset = '0';
    renderer.domElement.style.zIndex = '0';
    renderer.domElement.style.imageRendering = 'pixelated';
    container.appendChild(renderer.domElement);

    const geometry = new THREE.BoxGeometry(10, 10, 10);

    const loader = new THREE.TextureLoader();
    const materials = PANORAMA_FACES.map(({ src, rotationDegrees }) => {
      const texture = loader.load(src);
      texture.flipY = false;
      texture.wrapS = THREE.ClampToEdgeWrapping;
      texture.wrapT = THREE.ClampToEdgeWrapping;
      texture.rotation = THREE.MathUtils.degToRad(rotationDegrees);
      texture.magFilter = THREE.NearestFilter;
      texture.minFilter = THREE.NearestFilter;
      texture.colorSpace = THREE.SRGBColorSpace;
      return new THREE.MeshBasicMaterial({
        map: texture,
        side: THREE.BackSide,
      });
    });

    const cube = new THREE.Mesh(geometry, materials);
    scene.add(cube);

    let lastTime = performance.now();

    const animate = (currentTime: number) => {
      const deltaTime = (currentTime - lastTime) / 1000;
      lastTime = currentTime;

      camera.rotation.y += deltaTime * ROTATION_SPEED;

      renderer.render(scene, camera);
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      materials.forEach((m) => m.map?.dispose());
      geometry.dispose();
      container.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={containerRef} className="panorama3d-container" />;
}