"use client";

import { useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { ArrowRight, Check, ChevronDown, ImagePlus, Minus, Plus, RotateCcw, ShoppingBag, Sparkles, Type, Upload, WandSparkles, X } from "lucide-react";

type Layer = { id: number; kind: "text" | "image"; value: string; color: string; font: string; size: number; x: number; y: number };

function Mug({ color, handleColor, texture }: { color: string; handleColor: string; texture: THREE.CanvasTexture }) {
  const group = useRef<THREE.Group>(null);
  useFrame((_, delta) => { if (group.current) group.current.rotation.y += delta * 0.12; });
  const profile = useMemo(() => {
    const points = [new THREE.Vector2(0.01, 0), new THREE.Vector2(0.48, 0), new THREE.Vector2(0.53, 0.08), new THREE.Vector2(0.57, 0.82), new THREE.Vector2(0.54, 0.91), new THREE.Vector2(0.48, 0.94), new THREE.Vector2(0.47, 0.89), new THREE.Vector2(0.49, 0.82), new THREE.Vector2(0.47, 0.12), new THREE.Vector2(0.01, 0.12)];
    return new THREE.LatheGeometry(points, 96);
  }, []);
  return <group ref={group} position={[0, -0.46, 0]}>
    <mesh geometry={profile}>
      <meshStandardMaterial color={color} map={texture} roughness={0.22} metalness={0.02} />
    </mesh>
    <mesh position={[0.52, 0.47, 0]} rotation={[Math.PI / 2, 0, 0]}>
      <torusGeometry args={[0.29, 0.075, 24, 64]} />
      <meshStandardMaterial color={handleColor} roughness={0.2} />
    </mesh>
    <mesh position={[0, 0.005, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <circleGeometry args={[0.48, 64]} />
      <meshStandardMaterial color={color} />
    </mesh>
  </group>;
}

function MugScene({ color, handleColor, texture }: { color: string; handleColor: string; texture: THREE.CanvasTexture }) {
  return <Canvas camera={{ position: [1.9, 1.35, 2.3], fov: 34 }} dpr={[1, 1.7]}>
    <ambientLight intensity={1.6} />
    <directionalLight position={[3, 4, 5]} intensity={2.5} />
    <directionalLight position={[-3, 2, -2]} intensity={1.1} />
    <Mug color={color} handleColor={handleColor} texture={texture} />
    <OrbitControls enablePan={false} minDistance={2.2} maxDistance={5} minPolarAngle={0.4} maxPolarAngle={2.4} />
  </Canvas>;
}

export default function Storefront() {
  const [layers, setLayers] = useState<Layer[]>([{ id: 1, kind: "text", value: "Seu nome aqui", color: "#ffffff", font: "Arial", size: 42, x: 0, y: 0 }]);
  const [active, setActive] = useState(1);
  const [mugColor, setMugColor] = useState("#f3eee7");
  const [handleColor, setHandleColor] = useState("#f3eee7");
  const [tab, setTab] = useState<"text" | "image">("text");
  const [showAR, setShowAR] = useState(false);
  const [modelUrl, setModelUrl] = useState("");
  const [quantity, setQuantity] = useState(1);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const activeLayer = layers.find(layer => layer.id === active);

  const texture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 1024; canvas.height = 1024;
    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = "#ffffff"; ctx.fillRect(0, 0, 1024, 1024);
    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }, []);

  const redraw = () => {
    const canvas = texture.image as HTMLCanvasElement;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, 1024, 1024);
    ctx.fillStyle = "#ffffff"; ctx.fillRect(0, 0, 1024, 1024);
    layers.forEach(layer => {
      ctx.save();
      ctx.translate(512 + layer.x * 4, 512 - layer.y * 4);
      if (layer.kind === "text") {
        ctx.fillStyle = layer.color;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.font = `bold ${layer.size}px ${layer.font}`;
        ctx.fillText(layer.value, 0, 0, 850);
      } else {
        const img = new window.Image();
        img.onload = () => { ctx.drawImage(img, -180, -180, 360, 360); texture.needsUpdate = true; };
        img.src = layer.value;
      }
      ctx.restore();
    });
    texture.needsUpdate = true;
  };
  useMemo(() => { redraw(); return null; }, [layers, texture]);

  const addText = () => {
    const id = Date.now();
    setLayers(prev => [...prev, { id, kind: "text", value: "Novo texto", color: "#ffffff", font: "Arial", size: 42, x: 0, y: 0 }]);
    setActive(id); setTab("text");
  };
  const upload = (file?: File) => {
    if (!file) return;
    if (!["image/png", "image/jpeg", "image/webp"].includes(file.type) || file.size > 8 * 1024 * 1024) {
      alert("Envie PNG, JPG ou WebP de até 8 MB."); return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const id = Date.now();
      setLayers(prev => [...prev, { id, kind: "image", value: String(reader.result), color: "#ffffff", font: "Arial", size: 42, x: 0, y: 0 }]);
      setActive(id); setTab("image");
    };
    reader.readAsDataURL(file);
  };
  const updateLayer = (patch: Partial<Layer>) => setLayers(prev => prev.map(layer => layer.id === active ? { ...layer, ...patch } : layer));
  const reset = () => { setLayers([]); setMugColor("#f3eee7"); setHandleColor("#f3eee7"); };
  const saveDesign = () => {
    const preview = document.createElement("canvas");
    preview.width = 1024; preview.height = 1024;
    const ctx = preview.getContext("2d")!;
    ctx.fillStyle = mugColor; ctx.fillRect(0, 0, 1024, 1024);
    ctx.drawImage(texture.image, 0, 0);
    const link = document.createElement("a"); link.download = "artvix-personalizacao.png"; link.href = preview.toDataURL("image/png"); link.click();
  };

  return <main>
    <header className="topbar"><a className="brand" href="#"><span className="brand-mark">A</span> artvix<span className="brand-dot">.</span></a><nav><a href="#colecao">Coleção</a><a href="#como-funciona">Como funciona</a><a href="#personalizar">Personalizador 3D</a></nav><button className="bag"><ShoppingBag size={17}/> <span>Minha sacola</span></button></header>
    <section className="hero">
      <div className="hero-copy"><span className="eyebrow"><Sparkles size={14}/> PRESENTES COM A SUA IDENTIDADE</span><h1>O extraordinário<br/>está nos <em>detalhes.</em></h1><p>Transforme ideias em objetos únicos. Personalize em 3D, explore cada detalhe e crie algo que é só seu.</p><a className="primary" href="#personalizar">Criar meu produto <ArrowRight size={17}/></a><div className="hero-note"><span className="note-line"/> Feito por você. Produzido com carinho.</div></div>
      <div className="hero-art"><div className="orb orb-one"/><div className="orb orb-two"/><div className="hero-card"><div className="hero-mug"><div className="mug-handle"/><div className="mug-face">A<span>✳</span></div></div><span className="floating-tag">feito para você <Sparkles size={12}/></span></div><div className="hero-caption">OBJETOS QUE CONTAM HISTÓRIAS <span>01 / 04</span></div></div>
    </section>
    <section className="intro" id="colecao"><div><span className="eyebrow">SUA IDEIA, SUA PEÇA</span><h2>Peças únicas.<br/><em>Do seu jeito.</em></h2></div><p>Uma caneca com uma memória, um presente com significado, uma criação que começa na sua imaginação. Aqui, cada detalhe importa.</p></section>
    <section className="customizer-section" id="personalizar">
      <div className="section-heading"><div><span className="eyebrow">ESTÚDIO CRIATIVO ART VIX</span><h2>Crie sua <em>caneca.</em></h2></div><span className="step-indicator">01 — PERSONALIZAÇÃO 3D</span></div>
      <div className="editor">
        <div className="preview-column"><div className="preview-top"><span><span className="live-dot"/> VISUALIZAÇÃO EM TEMPO REAL</span><button onClick={reset}><RotateCcw size={14}/> Restaurar</button></div><div className="preview"><MugScene color={mugColor} handleColor={handleColor} texture={texture}/><div className="preview-hint">Arraste para girar · Scroll para aproximar</div></div><div className="preview-bottom"><span>CANeca DE CERÂMICA · 330 ML</span><span>R$ 59,90</span></div></div>
        <aside className="controls">
          <div className="control-heading"><div><span className="eyebrow">SEU PROJETO</span><h3>Personalização</h3></div><span className="step-count">1/3</span></div>
          <div className="control-group"><label>Cor da caneca</label><div className="swatches">{["#f3eee7","#ffffff","#222222","#d8a7a1","#a8b8a0","#c2b4d8"].map(c=><button key={c} aria-label={`Cor ${c}`} className={mugColor===c?"swatch selected":"swatch"} style={{background:c}} onClick={()=>setMugColor(c)}/>)}</div></div>
          <div className="control-group"><label>Cor da alça</label><div className="swatches">{["#f3eee7","#ffffff","#222222","#d8a7a1","#a8b8a0","#c2b4d8"].map(c=><button key={c} aria-label={`Alça ${c}`} className={handleColor===c?"swatch selected":"swatch"} style={{background:c}} onClick={()=>setHandleColor(c)}/>)}</div></div>
          <div className="tabs"><button className={tab==="text"?"tab active":"tab"} onClick={()=>setTab("text")}><Type size={15}/> Texto</button><button className={tab==="image"?"tab active":"tab"} onClick={()=>setTab("image")}><ImagePlus size={15}/> Imagem / Logo</button></div>
          {tab==="text" ? <div className="control-group"><label>Seu texto</label><input value={activeLayer?.kind==="text"?activeLayer.value:""} onChange={e=>updateLayer({value:e.target.value})} placeholder="Digite seu nome ou frase"/><div className="field-row"><div><label>Fonte</label><select value={activeLayer?.font||"Arial"} onChange={e=>updateLayer({font:e.target.value})}><option>Arial</option><option>Georgia</option><option>Verdana</option><option>Courier New</option><option>Trebuchet MS</option></select></div><div><label>Tamanho</label><input type="range" min="20" max="90" value={activeLayer?.size||42} onChange={e=>updateLayer({size:Number(e.target.value)})}/></div></div><div className="field-row"><div><label>Cor do texto</label><input type="color" value={activeLayer?.color||"#ffffff"} onChange={e=>updateLayer({color:e.target.value})}/></div><div><label>Posição horizontal</label><input type="range" min="-80" max="80" value={activeLayer?.x||0} onChange={e=>updateLayer({x:Number(e.target.value)})}/></div></div><button className="add-layer" onClick={addText}><Plus size={15}/> Adicionar outro texto</button></div> : <div className="upload-zone"><Upload size={22}/><strong>Adicione sua imagem</strong><span>PNG, JPG ou WebP · até 8 MB</span><label className="upload-button">Escolher arquivo<input type="file" accept="image/png,image/jpeg,image/webp" onChange={e=>upload(e.target.files?.[0])}/></label></div>}
          <div className="layers"><div className="layers-title">ELEMENTOS <span>{layers.length}</span></div>{layers.map(layer=><div key={layer.id} className={active===layer.id?"layer active":"layer"} onClick={()=>setActive(layer.id)}><span>{layer.kind==="text"?<Type size={14}/>:<ImagePlus size={14}/>}</span><strong>{layer.kind==="text"?layer.value:"Imagem enviada"}</strong><button aria-label="Remover elemento" onClick={e=>{e.stopPropagation();setLayers(prev=>prev.filter(l=>l.id!==layer.id));}}><X size={14}/></button></div>)}</div>
          <button className="ar-button" onClick={()=>setShowAR(true)}><WandSparkles size={17}/> Visualizar no meu ambiente <ArrowRight size={16}/></button>
          <div className="purchase"><div><span>Valor unitário</span><strong>R$ 59,90</strong></div><div className="quantity"><button onClick={()=>setQuantity(Math.max(1,quantity-1))}><Minus size={13}/></button>{quantity}<button onClick={()=>setQuantity(quantity+1)}><Plus size={13}/></button></div><button className="checkout" onClick={saveDesign}>Salvar criação · R$ {(59.9*quantity).toFixed(2).replace(".",",")}</button></div>
          <p className="secure-note"><Check size={13}/> Sua criação fica salva neste dispositivo nesta demonstração.</p>
        </aside>
      </div>
    </section>
    <section className="how" id="como-funciona"><span className="eyebrow">SIMPLES ASSIM</span><h2>Da ideia à realidade.</h2><div className="how-grid"><article><span>01</span><h3>Imagine</h3><p>Escolha seu produto e comece com uma tela em branco.</p></article><article><span>02</span><h3>Personalize</h3><p>Adicione textos, fotos e cores. Veja tudo em 3D.</p></article><article><span>03</span><h3>Receba</h3><p>Finalize seu pedido e receba uma peça feita para você.</p></article></div></section>
    <footer><a className="brand" href="#"><span className="brand-mark">A</span> artvix<span className="brand-dot">.</span></a><span>Pequenos detalhes. Grandes significados.</span><span>© 2026 ArtVix</span></footer>
    {showAR&&<div className="modal-backdrop" onClick={()=>setShowAR(false)}><div className="ar-modal" onClick={e=>e.stopPropagation()}><button className="modal-close" onClick={()=>setShowAR(false)}><X/></button><span className="eyebrow">REALIDADE AUMENTADA</span><h2>Veja sua criação<br/><em>no seu espaço.</em></h2><p>Para visualizar a caneca em tamanho real, selecione o modelo 3D GLB da peça. Em dispositivos compatíveis, o visualizador abrirá a experiência AR nativa.</p><label className="upload-button">Selecionar modelo GLB<input type="file" accept=".glb,.gltf,model/gltf-binary,model/gltf+json" onChange={e=>{const file=e.target.files?.[0];if(file){if(modelUrl)URL.revokeObjectURL(modelUrl);setModelUrl(URL.createObjectURL(file));}}}/></label>{modelUrl&&<model-viewer src={modelUrl} ar ar-modes="webxr scene-viewer quick-look" camera-controls shadow-intensity="1" style={{width:"100%",height:320,background:"#f3eee7",borderRadius:16}}><button slot="ar-button" className="primary">Visualizar no ambiente</button></model-viewer>}<p className="secure-note">A experiência AR depende do suporte do navegador e de um modelo GLB compatível. Sem modelo, continue explorando o editor 3D.</p></div></div>}
    <canvas ref={canvasRef} hidden/>
  </main>;
}