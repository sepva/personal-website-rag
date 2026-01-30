An exploration into artistic machine learning, this app lets users transform their photos using pre-trained neural style transfer models.

I was inspired by the famous Neural Style Transfer paper by Gatys et al., and wanted to make this technology accessible in the browser. The app runs entirely client-side using TensorFlow.js, meaning users' photos never leave their device.

Implementation details:
• Used pre-trained MobileNetV2 as the base model
• Implemented custom training pipeline for style models
• Optimized for mobile devices with model quantization
• Progressive Web App with offline support
• Real-time preview with adjustable style strength

The biggest challenge was achieving acceptable performance on mobile devices. I reduced model size by 70% through quantization and implemented a progressive rendering approach that shows a low-res preview first.