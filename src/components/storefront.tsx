"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { ContactShadows, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { ArrowRight, Check, ChevronDown, ImagePlus, Minus, Plus, RotateCcw, ShoppingBag, Sparkles, Type, Upload, WandSparkles, X } from "lucide-react";

type Layer = { id: number; kind: "text" | "image"; value: string; color: string; font: string; size: number; x: number; y: number };
type Product = { id: string; name: string; description: string; price: number; image: string };

function Mug({ color, handleColor, texture }: { color: string; handleColor: string; texture: THREE.CanvasTexture }) {
  const outerProfile = useMemo(() => [
    new THREE.Vector2(0, 0.035),
    new THREE.Vector2(0.34, 0.035),
    new THREE.Vector2(0.405, 0.04),
    new THREE.Vector2(0.455, 0.065),
    new THREE.Vector2(0.482, 0.105),
    new THREE.Vector2(0.493, 0.17),
    new THREE.Vector2(0.501, 0.32),
    new THREE.Vector2(0.505, 0.52),
    new THREE.Vector2(0.505, 0.72),
    new THREE.Vector2(0.502, 0.82),
    new THREE.Vector2(0.496, 0.852),
    new THREE.Vector2(0.487, 0.86)
  ].map(point => new THREE.Vector2(point.x, point.y * 1.22)), []);
  const innerProfile = useMemo(() => [
    new THREE.Vector2(0.466, 0.855),
    new THREE.Vector2(0.474, 0.82),
    new THREE.Vector2(0.476, 0.70),
    new THREE.Vector2(0.474, 0.48),
    new THREE.Vector2(0.466, 0.25),
    new THREE.Vector2(0.445, 0.16),
    new THREE.Vector2(0.405, 0.125)
  ].map(point => new THREE.Vector2(point.x, point.y * 1.22)), []);
  const handleCurve = useMemo(() => new THREE.CatmullRomCurve3([
    new THREE.Vector3(0.455, 0.70, 0.015),
    new THREE.Vector3(0.60, 0.755, 0.015),
    new THREE.Vector3(0.79, 0.70, 0.015),
    new THREE.Vector3(0.91, 0.56, 0.015),
    new THREE.Vector3(0.92, 0.39, 0.015),
    new THREE.Vector3(0.82, 0.235, 0.015),
    new THREE.Vector3(0.63, 0.18, 0.015),
    new THREE.Vector3(0.455, 0.225, 0.015)
  ].map(point => new THREE.Vector3(point.x, point.y * 1.22, point.z)), false, "centripetal", 0.35), []);
  return <group position={[0, -0.52, 0]}>
    {/* Corpo cerâmico: a cor é independente da arte aplicada. */}
    <mesh castShadow receiveShadow>
      <latheGeometry args={[outerProfile, 192]} />
      <meshPhysicalMaterial color={color} roughness={0.2} metalness={0} clearcoat={0.22} clearcoatRoughness={0.18} />
    </mesh>
    {/* Arte em uma camada transparente sobre a cerâmica, sem tingir o desenho. */}
    <mesh scale={[1.0015, 1, 1.0015]} renderOrder={1}>
      <latheGeometry args={[outerProfile, 192]} />
      <meshBasicMaterial map={texture} transparent alphaTest={0.015} depthWrite={false} polygonOffset polygonOffsetFactor={-1} side={THREE.FrontSide} toneMapped={false} />
    </mesh>
    <mesh>
      <latheGeometry args={[innerProfile, 192]} />
      <meshPhysicalMaterial color={color} side={THREE.DoubleSide} roughness={0.24} />
    </mesh>
    <mesh position={[0, 0.161, 0]}>
      <circleGeometry args={[0.405, 160]} />
      <meshStandardMaterial color={color} side={THREE.DoubleSide} roughness={0.3} />
    </mesh>
    <mesh position={[0, 1.04, 0]} rotation={[Math.PI / 2, 0, 0]}>
      <torusGeometry args={[0.491, 0.012, 16, 192]} />
      <meshPhysicalMaterial color={color} roughness={0.2} clearcoat={0.24} />
    </mesh>
    <mesh castShadow receiveShadow>
      <tubeGeometry args={[handleCurve, 160, 0.073, 32, false]} />
      <meshPhysicalMaterial color={handleColor} roughness={0.2} clearcoat={0.25} clearcoatRoughness={0.18} />
    </mesh>
    <mesh position={[0, 0.067, 0]}>
      <cylinderGeometry args={[0.425, 0.425, 0.035, 160]} />
      <meshStandardMaterial color={color} roughness={0.25} />
    </mesh>
  </group>;
}
function MugScene({ color, handleColor, texture }: { color: string; handleColor: string; texture: THREE.CanvasTexture }) {
  return <Canvas camera={{ position: [0.12, 1.18, 4.35], fov: 29 }} dpr={[1, 1.7]} shadows>
    <hemisphereLight args={["#ffffff", "#a99b8d", 1.45]} />
    <ambientLight intensity={0.3} />
    <directionalLight position={[-3, 4, 4]} intensity={2.2} castShadow shadow-mapSize-width={2048} shadow-mapSize-height={2048} />
    <directionalLight position={[3, 2, -2]} intensity={0.85} />
    <pointLight position={[0, 1.8, 2.5]} intensity={0.35} color="#fff4e8" />
    <Mug color={color} handleColor={handleColor} texture={texture} />
    <ContactShadows position={[0, -0.49, 0]} opacity={0.3} scale={3.2} blur={2.8} far={1.3} resolution={512} />
    <OrbitControls enablePan={false} minDistance={2.4} maxDistance={5.2} minPolarAngle={0.35} maxPolarAngle={2.25} />
  </Canvas>;
}

export default function Storefront() {
  const [layers, setLayers] = useState<Layer[]>([{ id: 1, kind: "text", value: "Seu nome aqui", color: "#a45d48", font: "Arial", size: 42, x: 0, y: 0 }]);
  const [active, setActive] = useState(1);
  const [mugColor, setMugColor] = useState("#f3eee7");
  const [handleColor, setHandleColor] = useState("#f3eee7");
  const [tab, setTab] = useState<"text" | "image">("text");
  const [showAR, setShowAR] = useState(false);
  const [modelUrl, setModelUrl] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [products, setProducts] = useState<Product[]>([]);
  const [productsLoaded, setProductsLoaded] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [productName, setProductName] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [productPrice, setProductPrice] = useState("59.90");
  const [productImage, setProductImage] = useState("");
  const activeLayer = layers.find(layer => layer.id === active);
  useEffect(() => {
    try { const saved = localStorage.getItem("artvix-products"); if (saved) setProducts(JSON.parse(saved) as Product[]); }
    catch { /* mantém a vitrine disponível se o armazenamento estiver inválido */ }
    finally { setProductsLoaded(true); }
  }, []);
  useEffect(() => {
    if (!productsLoaded) return;
    try { localStorage.setItem("artvix-products", JSON.stringify(products)); }
    catch { alert("O armazenamento do navegador está cheio. Remova imagens grandes dos produtos."); }
  }, [products, productsLoaded]);
  const currentPrice = selectedProduct?.price ?? 59.9;
  const saveProduct = () => {
    const name = productName.trim();
    const price = Number(productPrice.replace(",", "."));
    if (!name || !Number.isFinite(price) || price <= 0) { alert("Informe o nome do produto e um preço válido."); return; }
    setProducts(prev => [{ id: crypto.randomUUID(), name, description: productDescription.trim(), price, image: productImage }, ...prev]);
    setProductName(""); setProductDescription(""); setProductPrice("59.90"); setProductImage("");
  };
  const selectProduct = (product: Product) => {
    setSelectedProduct(product);
    document.getElementById("personalizar")?.scrollIntoView({ behavior: "smooth" });
  };

  const texture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 2048;
    canvas.height = 1024;
    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.ClampToEdgeWrapping;
    tex.anisotropy = 8;
    // Centraliza a arte na face voltada para a câmera inicial da caneca.
    tex.offset.x = 0.5;
    return tex;
  }, []);

  useEffect(() => {
    let cancelled = false;
    const canvas = texture.image as HTMLCanvasElement;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const draw = async () => {
      const loadedImages = await Promise.all(layers.map(layer => {
        if (layer.kind !== "image") return Promise.resolve<HTMLImageElement | null>(null);
        return new Promise<HTMLImageElement | null>(resolve => {
          const image = new window.Image();
          image.onload = () => resolve(image);
          image.onerror = () => resolve(null);
          image.src = layer.value;
        });
      }));
      if (cancelled) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      layers.forEach((layer, index) => {
        ctx.save();
        ctx.translate(1024 + layer.x * 6, 512 - layer.y * 4.5);
        if (layer.kind === "text") {
          ctx.fillStyle = layer.color;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.font = `bold ${layer.size * 2.2}px ${layer.font}`;
          ctx.shadowColor = "rgba(0,0,0,0.08)";
          ctx.shadowBlur = 2;
          ctx.fillText(layer.value, 0, 0, 1500);
        } else {
          const image = loadedImages[index];
          if (image) {
            const size = layer.size * 5;
            ctx.drawImage(image, -size / 2, -size / 2, size, size);
          }
        }
        ctx.restore();
      });
      texture.needsUpdate = true;
    };
    void draw();
    return () => { cancelled = true; };
  }, [layers, texture]);

  const addText = () => {
    const id = Date.now();
    setLayers(prev => [...prev, { id, kind: "text", value: "Novo texto", color: "#a45d48", font: "Arial", size: 42, x: 0, y: 0 }]);
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
    <header className="topbar"><a className="brand" href="#"><span className="brand-mark">A</span> artvix<span className="brand-dot">.</span></a><nav><a href="#colecao">Coleção</a><a href="#gerenciar">Cadastrar produtos</a><a href="#como-funciona">Como funciona</a><a href="#personalizar">Personalizador 3D</a></nav><button className="bag"><ShoppingBag size={17}/> <span>Minha sacola</span></button></header>
    <section className="hero">
      <div className="hero-copy"><span className="eyebrow"><Sparkles size={14}/> PRESENTES COM A SUA IDENTIDADE</span><h1>O extraordinário<br/>está nos <em>detalhes.</em></h1><p>Transforme ideias em objetos únicos. Personalize em 3D, explore cada detalhe e crie algo que é só seu.</p><a className="primary" href="#personalizar">Criar meu produto <ArrowRight size={17}/></a><div className="hero-note"><span className="note-line"/> Feito por você. Produzido com carinho.</div></div>
      <div className="hero-art"><div className="orb orb-one"/><div className="orb orb-two"/><div className="hero-card"><div className="hero-mug"><div className="mug-handle"/><div className="mug-face">A<span>✳</span></div></div><span className="floating-tag">feito para você <Sparkles size={12}/></span></div><div className="hero-caption">OBJETOS QUE CONTAM HISTÓRIAS <span>01 / 04</span></div></div>
    </section>
    <section className="intro" id="colecao"><div><span className="eyebrow">SUA IDEIA, SUA PEÇA</span><h2>Peças únicas.<br/><em>Do seu jeito.</em></h2></div><p>Uma caneca com uma memória, um presente com significado, uma criação que começa na sua imaginação. Aqui, cada detalhe importa.</p></section>
    <section className="catalog-section"><div className="section-heading"><div><span className="eyebrow">VITRINE ART VIX</span><h2>Nossa <em>coleção.</em></h2></div><span className="step-indicator">{products.length} PRODUTO(S) CADASTRADO(S)</span></div>
      <div className="catalog-grid">{products.map(product => <article className="product-card" key={product.id}><div className="product-card-image">{product.image ? <img src={product.image} alt={product.name}/> : <div className="product-placeholder"><span>A</span><small>ART VIX</small></div>}</div><div className="product-card-info"><div><h3>{product.name}</h3><strong>R$ {product.price.toFixed(2).replace(".", ",")}</strong></div>{product.description && <p>{product.description}</p>}<button onClick={() => selectProduct(product)}>Personalizar produto <ArrowRight size={15}/></button></div></article>)}
      {products.length===0 && <div className="empty-catalog"><Sparkles size={22}/><strong>Seus produtos aparecerão aqui</strong><p>Cadastre um produto para ele entrar automaticamente nesta vitrine.</p><a href="#gerenciar">Cadastrar primeiro produto</a></div>}</div>
    </section>
    <section className="manage-section" id="gerenciar"><div className="manage-heading"><span className="eyebrow">PAINEL DA LOJA</span><h2>Cadastro de <em>produtos.</em></h2><p>Cadastre os itens da loja e veja cada um aparecer na coleção.</p></div>
      <div className="manage-form"><div className="manage-fields">
        <label>Nome do produto<input value={productName} onChange={e=>setProductName(e.target.value)} placeholder="Ex.: Caneca personalizada"/></label>
        <label>Preço (R$)<input type="number" min="0.01" step="0.01" value={productPrice} onChange={e=>setProductPrice(e.target.value)}/></label>
        <label className="wide">Descrição<textarea value={productDescription} onChange={e=>setProductDescription(e.target.value)} placeholder="Descreva o produto, material e detalhes..."/></label>
        <label className="wide">Imagem do produto<input type="file" accept="image/png,image/jpeg,image/webp" onChange={e=>{const file=e.target.files?.[0];if(!file)return;if(file.size>5*1024*1024){alert("A imagem deve ter até 5 MB.");return;}const reader=new FileReader();reader.onload=()=>setProductImage(String(reader.result));reader.readAsDataURL(file);}}/></label>
      </div>
      {productImage && <div className="product-image-preview"><img src={productImage} alt="Prévia do produto"/><button type="button" onClick={()=>setProductImage("")}>Remover imagem</button></div>}
      <button className="save-product" onClick={saveProduct}><Plus size={16}/> Cadastrar produto na vitrine</button>
      {products.length>0 && <div className="registered-products"><strong>Produtos cadastrados</strong>{products.map(product=><div key={product.id}><span>{product.name}</span><b>R$ {product.price.toFixed(2).replace(".", ",")}</b><button onClick={()=>setProducts(prev=>prev.filter(item=>item.id!==product.id))} aria-label={"Excluir "+product.name}><X size={15}/></button></div>)}</div>}</div>
    </section>
    <section className="customizer-section" id="personalizar">
      <div className="section-heading"><div><span className="eyebrow">ESTÚDIO CRIATIVO ART VIX</span><h2>Crie sua <em>caneca.</em></h2></div><span className="step-indicator">01 — PERSONALIZAÇÃO 3D</span></div>
      <div className="editor">
        <div className="preview-column"><div className="preview-top"><span><span className="live-dot"/> VISUALIZAÇÃO EM TEMPO REAL</span><button onClick={reset}><RotateCcw size={14}/> Restaurar</button></div><div className="preview"><MugScene color={mugColor} handleColor={handleColor} texture={texture}/><div className="preview-hint">Arraste para girar · Scroll para aproximar</div></div><div className="preview-bottom"><span>{(selectedProduct?.name || "CANECA DE CERÂMICA").toUpperCase()} · PERSONALIZÁVEL</span><span>R$ {currentPrice.toFixed(2).replace(".", ",")}</span></div></div>
        <aside className="controls">
          <div className="control-heading"><div><span className="eyebrow">SEU PROJETO</span><h3>Personalização</h3></div><span className="step-count">1/3</span></div>
          <div className="control-group"><label>Cor da caneca</label><div className="swatches">{["#f3eee7","#ffffff","#222222","#d8a7a1","#a8b8a0","#c2b4d8"].map(c=><button key={c} aria-label={`Cor ${c}`} className={mugColor===c?"swatch selected":"swatch"} style={{background:c}} onClick={()=>setMugColor(c)}/>)}</div></div>
          <div className="control-group"><label>Cor da alça</label><div className="swatches">{["#f3eee7","#ffffff","#222222","#d8a7a1","#a8b8a0","#c2b4d8"].map(c=><button key={c} aria-label={`Alça ${c}`} className={handleColor===c?"swatch selected":"swatch"} style={{background:c}} onClick={()=>setHandleColor(c)}/>)}</div></div>
          <div className="tabs"><button className={tab==="text"?"tab active":"tab"} onClick={()=>setTab("text")}><Type size={15}/> Texto</button><button className={tab==="image"?"tab active":"tab"} onClick={()=>setTab("image")}><ImagePlus size={15}/> Imagem / Logo</button></div>
          {tab==="text" ? <div className="control-group"><label>Seu texto</label><input value={activeLayer?.kind==="text"?activeLayer.value:""} onChange={e=>updateLayer({value:e.target.value})} placeholder="Digite seu nome ou frase"/><div className="field-row"><div><label>Fonte</label><select value={activeLayer?.font||"Arial"} onChange={e=>updateLayer({font:e.target.value})}><option>Arial</option><option>Georgia</option><option>Verdana</option><option>Courier New</option><option>Trebuchet MS</option></select></div><div><label>Tamanho</label><input type="range" min="20" max="90" value={activeLayer?.size||42} onChange={e=>updateLayer({size:Number(e.target.value)})}/></div></div><div className="field-row"><div><label>Cor do texto</label><input type="color" value={activeLayer?.color||"#ffffff"} onChange={e=>updateLayer({color:e.target.value})}/></div><div><label>Posição horizontal</label><input type="range" min="-80" max="80" value={activeLayer?.x||0} onChange={e=>updateLayer({x:Number(e.target.value)})}/></div></div><div className="control-group"><label>Altura do texto</label><input type="range" min="-80" max="80" value={activeLayer?.y||0} onChange={e=>updateLayer({y:Number(e.target.value)})}/></div><button className="add-layer" onClick={addText}><Plus size={15}/> Adicionar outro texto</button></div> : <div className="upload-zone"><Upload size={22}/><strong>Adicione sua imagem</strong><span>PNG, JPG ou WebP · até 8 MB</span><label className="upload-button">Escolher arquivo<input type="file" accept="image/png,image/jpeg,image/webp" onChange={e=>upload(e.target.files?.[0])}/></label>{activeLayer?.kind==="image"&&<><div className="control-group"><label>Tamanho da imagem</label><input type="range" min="20" max="90" value={activeLayer.size} onChange={e=>updateLayer({size:Number(e.target.value)})}/></div><div className="control-group"><label>Posição horizontal</label><input type="range" min="-120" max="120" value={activeLayer.x} onChange={e=>updateLayer({x:Number(e.target.value)})}/></div><div className="control-group"><label>Altura da imagem</label><input type="range" min="-80" max="80" value={activeLayer.y} onChange={e=>updateLayer({y:Number(e.target.value)})}/></div></>}</div>}
          <div className="layers"><div className="layers-title">ELEMENTOS <span>{layers.length}</span></div>{layers.map(layer=><div key={layer.id} className={active===layer.id?"layer active":"layer"} onClick={()=>setActive(layer.id)}><span>{layer.kind==="text"?<Type size={14}/>:<ImagePlus size={14}/>}</span><strong>{layer.kind==="text"?layer.value:"Imagem enviada"}</strong><button aria-label="Remover elemento" onClick={e=>{e.stopPropagation();setLayers(prev=>prev.filter(l=>l.id!==layer.id));}}><X size={14}/></button></div>)}</div>
          <button className="ar-button" onClick={()=>setShowAR(true)}><WandSparkles size={17}/> Visualizar no meu ambiente <ArrowRight size={16}/></button>
          <div className="purchase"><div><span>Valor unitário</span><strong>R$ {currentPrice.toFixed(2).replace(".", ",")}</strong></div><div className="quantity"><button onClick={()=>setQuantity(Math.max(1,quantity-1))}><Minus size={13}/></button>{quantity}<button onClick={()=>setQuantity(quantity+1)}><Plus size={13}/></button></div><button className="checkout" onClick={saveDesign}>Salvar criação · R$ {(currentPrice*quantity).toFixed(2).replace(".",",")}</button></div>
          <p className="secure-note"><Check size={13}/> Sua criação fica salva neste dispositivo nesta demonstração.</p>
        </aside>
      </div>
    </section>
    <section className="how" id="como-funciona"><span className="eyebrow">SIMPLES ASSIM</span><h2>Da ideia à realidade.</h2><div className="how-grid"><article><span>01</span><h3>Imagine</h3><p>Escolha seu produto e comece com uma tela em branco.</p></article><article><span>02</span><h3>Personalize</h3><p>Adicione textos, fotos e cores. Veja tudo em 3D.</p></article><article><span>03</span><h3>Receba</h3><p>Finalize seu pedido e receba uma peça feita para você.</p></article></div></section>
    <footer><a className="brand" href="#"><span className="brand-mark">A</span> artvix<span className="brand-dot">.</span></a><span>Pequenos detalhes. Grandes significados.</span><span>© 2026 ArtVix</span></footer>
    {showAR&&<div className="modal-backdrop" onClick={()=>setShowAR(false)}><div className="ar-modal" onClick={e=>e.stopPropagation()}><button className="modal-close" onClick={()=>setShowAR(false)}><X/></button><span className="eyebrow">REALIDADE AUMENTADA</span><h2>Veja sua criação<br/><em>no seu espaço.</em></h2><p>Para visualizar a caneca em tamanho real, selecione o modelo 3D GLB da peça. Em dispositivos compatíveis, o visualizador abrirá a experiência AR nativa.</p><label className="upload-button">Selecionar modelo GLB<input type="file" accept=".glb,.gltf,model/gltf-binary,model/gltf+json" onChange={e=>{const file=e.target.files?.[0];if(file){if(modelUrl)URL.revokeObjectURL(modelUrl);setModelUrl(URL.createObjectURL(file));}}}/></label>{modelUrl&&<model-viewer src={modelUrl} ar ar-modes="webxr scene-viewer quick-look" camera-controls shadow-intensity="1" style={{width:"100%",height:320,background:"#f3eee7",borderRadius:16}}><button slot="ar-button" className="primary">Visualizar no ambiente</button></model-viewer>}<p className="secure-note">A experiência AR depende do suporte do navegador e de um modelo GLB compatível. Sem modelo, continue explorando o editor 3D.</p></div></div>}
  </main>;
}