import { Estatisticas } from "@/Interfaces";
import { downloadImage, downloadImageByName, getAllDescriptions } from "@/Services";
import { useEffect, useState } from "react";

interface Descricao {
  Cluster_ID: number;
  Numero_Usuarios: number;
  Estatisticas_Horas_Ouvidas: {
    mean: {
      id_usuario: number;
      horas_ouvidas_rock: number;
      horas_ouvidas_samba: number;
      horas_ouvidas_pop: number;
      horas_ouvidas_rap: number;
      cluster: number;
    };
    std: {
      id_usuario: number;
      horas_ouvidas_rock: number;
      horas_ouvidas_samba: number;
      horas_ouvidas_pop: number;
      horas_ouvidas_rap: number;
      cluster: number;
    };
    min: {
      id_usuario: number;
      horas_ouvidas_rock: number;
      horas_ouvidas_samba: number;
      horas_ouvidas_pop: number;
      horas_ouvidas_rap: number;
      cluster: number;
    };
    '25%': {
      id_usuario: number;
      horas_ouvidas_rock: number;
      horas_ouvidas_samba: number;
      horas_ouvidas_pop: number;
      horas_ouvidas_rap: number;
      cluster: number;
    };
    '50%': {
      id_usuario: number;
      horas_ouvidas_rock: number;
      horas_ouvidas_samba: number;
      horas_ouvidas_pop: number;
      horas_ouvidas_rap: number;
      cluster: number;
    };
    '75%': {
      id_usuario: number;
      horas_ouvidas_rock: number;
      horas_ouvidas_samba: number;
      horas_ouvidas_pop: number;
      horas_ouvidas_rap: number;
      cluster: number;
    };
    max: {
      id_usuario: number;
      horas_ouvidas_rock: number;
      horas_ouvidas_samba: number;
      horas_ouvidas_pop: number;
      horas_ouvidas_rap: number;
      cluster: number;
    };
  };
  Interpretacao: string;
  Estilos_Interessantes: string[];
};

export default function Dashboard() {
    const [imageUrls, setImageUrls] = useState<string[]>([]);
    const [descriptions, setDescriptions] = useState<Descricao[]>([]);

  useEffect(() => {
    async function fetchImages() {
      const imageNames = await downloadImageByName();
      
      
      // Para cada nome de imagem, baixe a imagem e atualize o estado
      const urls = await Promise.all(imageNames.map(downloadImage));
      setImageUrls(urls);
    }
    async function fetchData() {
      try {
        const imageNames = await downloadImageByName();
        const urls = await Promise.all(imageNames.map(downloadImage));
        setImageUrls(urls);

        const data = await getAllDescriptions();
        setDescriptions(data);
      } catch (error) {
        console.log(error)
      }
    }

    // Inicie a busca de imagens
    fetchImages();
    fetchData();
  }, []);


  return (
    <>
      <div className="flex items-center justify-center">
        <div className="flex w-full flex-col items-center">
          {imageUrls.map((url, index) => (
            <div key={index} className="flex flex-col w-1/2 items-center justify-center p-4 border">
              <img src={url} alt={`Imagem ${index}`} />
              {descriptions[index] && (
                <div>
                  <h3>{`Cluster ${descriptions[index].Cluster_ID}`}</h3>
                  <p>{`Número de Usuários: ${descriptions[index].Numero_Usuarios}`}</p>
                  <h4>Estatísticas Horas Ouvidas</h4>
                  <ul>
                    <li>{`Média: ${descriptions[index].Estatisticas_Horas_Ouvidas.mean.horas_ouvidas_rock}`}</li>
                    <li>{`Desvio Padrão: ${descriptions[index].Estatisticas_Horas_Ouvidas.std.horas_ouvidas_rock}`}</li>
                    <li>{`Mínimo: ${descriptions[index].Estatisticas_Horas_Ouvidas.min.horas_ouvidas_rock}`}</li>
                    <li>{`25%: ${descriptions[index].Estatisticas_Horas_Ouvidas['25%'].horas_ouvidas_rock}`}</li>
                    <li>{`50%: ${descriptions[index].Estatisticas_Horas_Ouvidas['50%'].horas_ouvidas_rock}`}</li>
                    <li>{`75%: ${descriptions[index].Estatisticas_Horas_Ouvidas['75%'].horas_ouvidas_rock}`}</li>
                    <li>{`Máximo: ${descriptions[index].Estatisticas_Horas_Ouvidas.max.horas_ouvidas_rock}`}</li>
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
