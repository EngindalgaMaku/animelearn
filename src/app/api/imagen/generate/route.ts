import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { prompt, cardId, element } = await request.json();

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    // Google Cloud Vertex AI Imagen API kullanımı
    const projectId = process.env.GOOGLE_CLOUD_PROJECT_ID;
    const location = process.env.GOOGLE_CLOUD_LOCATION || 'us-central1';
    const accessToken = process.env.GOOGLE_CLOUD_ACCESS_TOKEN;

    if (!projectId || !accessToken) {
      return NextResponse.json(
        { error: 'Google Cloud credentials not configured' },
        { status: 500 }
      );
    }

    // Imagen 3 API endpoint
    const imagenUrl = `https://${location}-aiplatform.googleapis.com/v1/projects/${projectId}/locations/${location}/publishers/google/models/imagen-3.0-generate-001:predict`;

    const requestBody = {
      instances: [
        {
          prompt: prompt,
          negative_prompt: "blurry, low quality, distorted, watermark, text, signature, low resolution, artifacts, jpeg artifacts, poorly drawn",
          // Kart boyutları için optimize edilmiş parametreler
          aspectRatio: "2:3", // Trading card oranı
          safetyFilterLevel: "block_some",
          personGeneration: "allow_adult"
        }
      ],
      parameters: {
        sampleCount: 1,
        language: "en",
        guidanceScale: 15,
        seed: Math.floor(Math.random() * 2147483647)
      }
    };

    const response = await fetch(imagenUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Imagen API Error:', errorData);
      return NextResponse.json(
        { error: 'Failed to generate image with Imagen API', details: errorData },
        { status: response.status }
      );
    }

    const result = await response.json();
    
    if (!result.predictions || result.predictions.length === 0) {
      return NextResponse.json(
        { error: 'No image generated' },
        { status: 500 }
      );
    }

    // Base64 encoded image data
    const imageData = result.predictions[0].bytesBase64Encoded;
    const mimeType = result.predictions[0].mimeType || 'image/jpeg';

    // Resmi dosya sistemine kaydet
    if (cardId && element) {
      try {
        const fs = require('fs').promises;
        const path = require('path');
        
        const cardsDir = path.join(process.cwd(), 'public', 'cards', element);
        await fs.mkdir(cardsDir, { recursive: true });
        
        const filename = `${cardId}.jpg`;
        const filepath = path.join(cardsDir, filename);
        
        // Base64'ten buffer'a çevir ve kaydet
        const buffer = Buffer.from(imageData, 'base64');
        await fs.writeFile(filepath, buffer);
        
        return NextResponse.json({
          success: true,
          imageUrl: `/cards/${element}/${filename}`,
          base64: `data:${mimeType};base64,${imageData}`,
          cardId,
          element,
          prompt
        });
      } catch (saveError) {
        console.error('Error saving image:', saveError);
        // Hata olsa bile base64 olarak döndür
        return NextResponse.json({
          success: true,
          base64: `data:${mimeType};base64,${imageData}`,
          cardId,
          element,
          prompt,
          saveError: 'Could not save to file system'
        });
      }
    }

    return NextResponse.json({
      success: true,
      base64: `data:${mimeType};base64,${imageData}`,
      mimeType,
      prompt
    });

  } catch (error) {
    console.error('Imagen generation error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// Batch generation endpoint
export async function PUT(request: NextRequest) {
  try {
    const { cards } = await request.json();

    if (!Array.isArray(cards) || cards.length === 0) {
      return NextResponse.json(
        { error: 'Cards array is required' },
        { status: 400 }
      );
    }

    const results = [];
    const errors = [];

    // Her kart için sırayla resim oluştur (rate limiting için)
    for (const card of cards) {
      try {
        const response = await fetch(`${request.nextUrl.origin}/api/imagen/generate`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            prompt: card.prompt,
            cardId: card.cardId,
            element: card.element
          }),
        });

        const result = await response.json();
        
        if (result.success) {
          results.push({
            cardId: card.cardId,
            element: card.element,
            imageUrl: result.imageUrl,
            status: 'success'
          });
        } else {
          errors.push({
            cardId: card.cardId,
            error: result.error
          });
        }

        // Rate limiting: Her request arasında 2 saniye bekle
        await new Promise(resolve => setTimeout(resolve, 2000));

      } catch (cardError) {
        errors.push({
          cardId: card.cardId,
          error: cardError instanceof Error ? cardError.message : 'Unknown error'
        });
      }
    }

    return NextResponse.json({
      success: true,
      generated: results.length,
      failed: errors.length,
      results,
      errors
    });

  } catch (error) {
    console.error('Batch generation error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}