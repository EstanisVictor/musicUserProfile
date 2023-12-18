import { downloadImage, downloadImageByName } from "@/Services";
import { useEffect, useState } from "react";

export default function Dashboard() {
    const [imageUrls, setImageUrls] = useState<string[]>([]);

  useEffect(() => {
    async function fetchImages() {
      const imageNames = await downloadImageByName();
      
      // Para cada nome de imagem, baixe a imagem e atualize o estado
      const urls = await Promise.all(imageNames.map(downloadImage));
      setImageUrls(urls);
    }

    // Inicie a busca de imagens
    fetchImages();
  }, []);


  return (
    <>
      <div className="flex items-center justify-center">
        <div className="flex flex-col w-2/6 items-center justify-center mt gap-2 bg-white p-8 mx-w-md">
          {imageUrls.map((url, index) => (
            <img key={index} src={url} alt={`Imagem ${index}`} />
          ))}
        </div>
      </div>
    </>
  );
}
