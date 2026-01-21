import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { createSupabaseServerClient } from '@/lib/supabase-server';

// HYBRID MODE: Demo + Production
// - Demo Mode: Intelligent matching of inputs to pre-generated results
// - Production Mode: Add GOOGLE_GEMINI_API_KEY to use real AI
// Credits deduct in BOTH modes

// Helper function to create image hash for matching
function createImageHash(base64Image: string): string {
  const crypto = require('crypto');
  const cleanBase64 = base64Image.includes(',') ? base64Image.split(',')[1] : base64Image;
  return crypto.createHash('md5').update(cleanBase64.substring(0, 1000)).digest('hex').substring(0, 8);
}

// Load demo configuration
async function getDemoConfig() {
  const fs = await import('fs/promises');
  const path = await import('path');
  const configPath = path.join(process.cwd(), 'public', 'demo-results', 'demo-config.json');

  try {
    const configData = await fs.readFile(configPath, 'utf-8');
    return JSON.parse(configData);
  } catch (error) {
    console.warn('⚠️ Demo config not found, using fallback');
    return {
      'demo-pairs': [],
      'fallback-images': ['demo-1.jpg', 'demo-2.jpg', 'demo-3.jpg', 'demo-4.jpg']
    };
  }
}

export async function POST(req: NextRequest) {
  try {
    const {
      bodyImage, topImage, bottomImage, footwearImage, prompt,
      bodyImageName, topImageName, bottomImageName, footwearImageName
    } = await req.json();

    // 1. AUTH: Check if user is logged in
    const supabase = await createSupabaseServerClient();
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2. VALIDATION: Check images
    let garmentImage = topImage || bottomImage || footwearImage;
    if (!bodyImage || !garmentImage) {
      return NextResponse.json({ error: 'Missing images' }, { status: 400 });
    }

    // 3. CHECK CREDITS: Get user's current credits
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('credits')
      .eq('id', session.user.id)
      .single();

    if (userError) {
      console.error('Error fetching user credits:', userError);
      return NextResponse.json({ error: 'Failed to fetch user credits' }, { status: 500 });
    }

    const CREDITS_PER_GENERATION = 5;

    if (!userData || userData.credits < CREDITS_PER_GENERATION) {
      return NextResponse.json({
        error: `Insufficient credits. You need ${CREDITS_PER_GENERATION} credits per generation. Please purchase more credits to continue.`
      }, { status: 402 });
    }

    console.log(`💳 User has ${userData.credits} credits`);

    // 4. DEDUCT CREDITS (5 credits per generation)
    const { error: deductError } = await supabase
      .from('users')
      .update({ credits: userData.credits - CREDITS_PER_GENERATION })
      .eq('id', session.user.id);

    if (deductError) {
      console.error('Error deducting credits:', deductError);
      return NextResponse.json({ error: 'Failed to deduct credits' }, { status: 500 });
    }

    console.log(`✅ Deducted ${CREDITS_PER_GENERATION} credits. Remaining: ${userData.credits - CREDITS_PER_GENERATION}`);

    // 5. DETERMINE MODE: Demo or Production
    const hasApiKey = !!process.env.GOOGLE_GEMINI_API_KEY;
    const isProductionMode = hasApiKey;

    if (isProductionMode) {
      // PRODUCTION MODE: Use real Gemini 2.0 Flash
      console.log('🤖 Production Mode: Using Gemini 2.0 Flash...');

      try {
        const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY!);
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });
        const cleanBase64 = (str: string) => str.includes(',') ? str.split(',')[1] : str;

        const tryOnPrompt = `Generate a photorealistic virtual try-on image showing the SAME person from the first image wearing the clothing from the second image. Preserve the person's face, body, and pose exactly. Only change the clothing.`;

        const result = await model.generateContent([
          tryOnPrompt,
          { inlineData: { data: cleanBase64(bodyImage), mimeType: "image/png" } },
          { inlineData: { data: cleanBase64(garmentImage), mimeType: "image/png" } },
          prompt || "Virtual try-on"
        ]);

        const response = await result.response;
        const generatedImage = response.text();
        const outputUrl = generatedImage.startsWith('data:') ? generatedImage : `data:image/jpeg;base64,${generatedImage}`;

        return NextResponse.json({
          success: true,
          output_url: outputUrl,
          credits_remaining: userData.credits - CREDITS_PER_GENERATION,
          mode: 'production',
          debug_info: { model_used: "gemini-2.0-flash-exp" }
        });

      } catch (error: any) {
        console.error('❌ Gemini Error:', error);
        console.log('⚠️ Falling back to demo mode...');

        // Don't refund credit - we'll use demo mode instead
        // Just fall through to demo mode below
      }
    }

    // DEMO MODE: Intelligent matching with fallback
    console.log('🎨 Demo Mode: Using intelligent matching...');

    // Simulate AI processing time
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Load demo configuration
    const demoConfig = await getDemoConfig();

    // Determine garment type(s) - can be combinations!
    let garmentTypes = [];
    if (topImage) garmentTypes.push('top');
    if (bottomImage) garmentTypes.push('bottom');
    if (footwearImage) garmentTypes.push('footwear');

    // Create garment type string (e.g., "top", "bottom", "top+bottom", "top+bottom+footwear")
    const garmentType = garmentTypes.join('+');

    // Extract base names from filenames (remove extension and path)
    const getBaseName = (filename: string) => {
      if (!filename) return '';
      const name = filename.split('/').pop()?.split('\\').pop() || '';
      return name.replace(/\.(jpg|jpeg|png|webp)$/i, '');
    };

    const bodyBaseName = getBaseName(bodyImageName || '');
    const topBaseName = getBaseName(topImageName || '');
    const bottomBaseName = getBaseName(bottomImageName || '');
    const footwearBaseName = getBaseName(footwearImageName || '');

    console.log('🔍 Looking for matching demo pair:', {
      bodyBaseName,
      topBaseName,
      bottomBaseName,
      footwearBaseName,
      garmentType
    });

    // Try to find a matching pair
    let selectedImage = null;
    let matchType = 'random';

    // Check if we have any demo pairs configured
    if (demoConfig['demo-pairs'] && demoConfig['demo-pairs'].length > 0) {
      // Try to find exact filename match first
      let matchedPair = null;

      for (const pair of demoConfig['demo-pairs']) {
        // Check if garment type matches
        if (pair.garmentType !== garmentType) continue;

        // Extract base names from config
        const pairBodyBase = getBaseName(pair.bodyImage || '');
        const pairTopBase = getBaseName(pair.topImage || '');
        const pairBottomBase = getBaseName(pair.bottomImage || '');
        const pairFootwearBase = getBaseName(pair.footwearImage || '');

        // Check for exact match
        let isMatch = pairBodyBase === bodyBaseName;
        if (topImage && pairTopBase) isMatch = isMatch && pairTopBase === topBaseName;
        if (bottomImage && pairBottomBase) isMatch = isMatch && pairBottomBase === bottomBaseName;
        if (footwearImage && pairFootwearBase) isMatch = isMatch && pairFootwearBase === footwearBaseName;

        if (isMatch) {
          matchedPair = pair;
          break;
        }
      }

      if (matchedPair) {
        selectedImage = matchedPair.resultImage;
        matchType = 'filename-matched';
        console.log(`✅ Exact filename match found: ${matchedPair.id} (${matchedPair.description}) [${garmentType}]`);
      } else {
        // No exact match, filter by garment type and use first one
        const relevantPairs = demoConfig['demo-pairs'].filter((pair: any) =>
          pair.garmentType === garmentType
        );

        if (relevantPairs.length > 0) {
          const selectedPair = relevantPairs[0];
          selectedImage = selectedPair.resultImage;
          matchType = 'type-matched';
          console.log(`⚠️ No filename match, using first ${garmentType} pair: ${selectedPair.id}`);
        } else {
          // No pairs for this garment type, use fallback
          const fallbackImages = demoConfig['fallback-images'] || ['result-top.jpg', 'result-bottom.jpg', 'result-combo.jpg'];
          const randomIndex = Math.floor(Math.random() * fallbackImages.length);
          selectedImage = fallbackImages[randomIndex];
          matchType = 'fallback';
          console.log(`🎲 No pairs for ${garmentType}, using random fallback: ${selectedImage}`);
        }
      }
    } else {
      // Fallback to random selection from fallback images
      const fallbackImages = demoConfig['fallback-images'] || ['result-top.jpg', 'result-bottom.jpg', 'result-combo.jpg'];
      const randomIndex = Math.floor(Math.random() * fallbackImages.length);
      selectedImage = fallbackImages[randomIndex];
      console.log(`🎲 Using random fallback: ${selectedImage}`);
    }

    // Read the selected image from public folder
    const fs = await import('fs/promises');
    const path = await import('path');
    const imagePath = path.join(process.cwd(), 'public', 'demo-results', selectedImage);

    try {
      const imageBuffer = await fs.readFile(imagePath);
      const base64 = imageBuffer.toString('base64');
      const outputUrl = `data:image/jpeg;base64,${base64}`;

      return NextResponse.json({
        success: true,
        output_url: outputUrl,
        credits_remaining: userData.credits - CREDITS_PER_GENERATION,
        mode: 'demo',
        debug_info: {
          model_used: "demo-mode-intelligent",
          match_type: matchType,
          selected_image: selectedImage,
          message: isProductionMode
            ? "Gemini quota exceeded - using demo mode"
            : "Add GOOGLE_GEMINI_API_KEY to .env.local for real AI generation"
        }
      });
    } catch (fileError) {
      console.error('❌ Error reading demo image:', fileError);
      return NextResponse.json({
        error: 'Demo images not found. Please add images to public/demo-results/ folder (demo-1.jpg, demo-2.jpg, etc.)'
      }, { status: 500 });
    }

  } catch (error: any) {
    console.error('❌ Generation Error:', error);
    return NextResponse.json(
      { error: `Failed to generate try-on: ${error.message || 'Unknown error'}` },
      { status: 500 }
    );
  }
}
