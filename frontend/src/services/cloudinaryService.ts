import { v2 as cloudinary } from 'cloudinary';

// Configuração do Cloudinary
cloudinary.config({
  cloud_name: 'dzaoukvjt',
  api_key: '374324728379382',
  api_secret: 'xGZHHZOuoBXla4w6HC3bMto1Rqk'
});

// Função para fazer upload de imagem
export const uploadImage = async (file: File): Promise<string> => {
  try {
    // Converter File para base64
    const base64Data = await new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        resolve(base64.split(',')[1]);
      };
      reader.readAsDataURL(file);
    });

    // Upload para o Cloudinary
    const result = await cloudinary.uploader.upload(
      `data:${file.type};base64,${base64Data}`,
      {
        folder: 'cars',
        resource_type: 'auto',
        transformation: [
          { width: 1000, crop: "limit" },
          { quality: "auto" },
          { fetch_format: "auto" }
        ]
      }
    );

    return result.secure_url;
  } catch (error) {
    console.error('Erro ao fazer upload da imagem:', error);
    throw new Error('Falha ao fazer upload da imagem. Por favor, tente novamente.');
  }
}; 