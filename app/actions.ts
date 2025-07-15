'use server';

interface GenerateImageResponse {
  success: boolean;
  imageUrl?: string;
  error?: string;
}

export async function generateImage(
  prompt: string
): Promise<GenerateImageResponse> {
  try {
    const response = await fetch(
      'https://ark.cn-beijing.volces.com/api/v3/images/generations',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.DOUBAO_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'doubao-seedream-3-0-t2i-250415',
          prompt: prompt,
          response_format: 'url',
          size: '1024x1024',
          seed: Math.floor(Math.random() * 1000000),
          guidance_scale: 2.5,
          watermark: true,
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error:', response.status, errorText);
      return {
        success: false,
        error: `API 调用失败: ${response.status}`,
      };
    }

    const data = await response.json();

    if (data.data && data.data.length > 0 && data.data[0].url) {
      return {
        success: true,
        imageUrl: data.data[0].url,
      };
    } else {
      return {
        success: false,
        error: 'API 返回数据格式异常',
      };
    }
  } catch (error) {
    console.error('Generate image error:', error);
    return {
      success: false,
      error: '网络请求失败，请检查网络连接',
    };
  }
}
