# ArtVix

Loja virtual de produtos personalizados com editor 3D para canecas e integração de realidade aumentada.

## Começar

```bash
npm install
npm run dev
```

Acesse http://localhost:3000.

## Estado atual

- Vitrine responsiva e identidade visual ArtVix.
- Editor 3D interativo de caneca com rotação, zoom, cores de corpo/alça, textos, fontes, imagens e camadas.
- Exportação local da arte criada.
- Entrada para visualização AR com `<model-viewer>`, WebXR, Scene Viewer e Quick Look quando o dispositivo e o modelo GLB suportarem.

## Próximas integrações necessárias para operação comercial

O repositório foi iniciado sem código preexistente. Antes de receber pedidos reais, conectar persistência PostgreSQL, autenticação da proprietária e clientes, armazenamento privado de uploads e modelos, geração/salvamento de arte final, checkout e gateway de pagamento, cálculo de frete e gestão de pedidos.

A visualização AR usa um arquivo GLB real fornecido no modal. Para a personalização aparecer também no AR, o próximo passo técnico é gerar/atualizar o GLB com a textura exportada do editor e associar esse arquivo ao pedido. Não há simulação de AR quando o modelo não foi informado.
