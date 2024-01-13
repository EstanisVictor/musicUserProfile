import { IuserprofileMusic, Estatisticas, Dados } from "@/Interfaces";
import path from "path";

export async function uploadFile(userProfileMusic: IuserprofileMusic) {
  const formdarta = new FormData();
  formdarta.append("file", userProfileMusic.file[0]);

  return fetch("http://localhost:5000/upload", {
    method: "POST",
    body: formdarta,
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      return data;
    })
    .catch((err) => {
      console.log(err);
    });
}

export async function downloadImageByName() {
  try {
    const response = await fetch("http://localhost:5000/get-all-images");
    if (!response.ok) {
      throw new Error("Erro ao buscar imagens");
    }

    const data = await response.json();
    const imageNames = data.images || [];

    // Manipule a lista de nomes de imagens (imageNames) conforme necessário
    console.log("Nomes das imagens:", imageNames);
    return imageNames;
  } catch (error) {
    console.error("Erro ao buscar imagens:", error);
    return [];
  }
}

export async function downloadImage(imageName: string) {
    try {
        const response = await fetch(
        `http://localhost:5000/get-image/${imageName}`
        );
        if (!response.ok) {
        throw new Error("Erro ao buscar imagens");
        }
    
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        return url;
    } catch (error) {
        console.error("Erro ao buscar imagens:", error);
        return "";
    }
}

export async function getAllDescriptions(): Promise<any> {
  try {
    const response = await fetch("http://localhost:5000/get-all-descriptions");
    if (!response.ok) {
      throw new Error("Erro ao buscar descrições");
    }

    const data = await response.json();
    const descriptions: Dados[] = data.descriptions || [];

    const descriptionsComEstatisticas: Dados[] = descriptions.map(descricao => {
      return {
        ...descricao,
        Estatisticas_Horas_Ouvidas: associateWithEstatisticas(descricao.Estatisticas_Horas_Ouvidas),
      };
    });

    console.log("Descrições dos clusters:", descriptionsComEstatisticas);
    return descriptionsComEstatisticas;
  } catch (error) {
    console.error("Erro ao buscar descrições:", error);
    return [];
  }
}

function associateWithEstatisticas(estatisticasData: any): Estatisticas {
  const estatisticas: Estatisticas = {
    mean: { ...estatisticasData.mean },
    std: { ...estatisticasData.std },
    min: { ...estatisticasData.min },
    '25%': { ...estatisticasData['25%'] },
    '50%': { ...estatisticasData['50%'] },
    '75%': { ...estatisticasData['75%'] },
    max: { ...estatisticasData.max },
  };

  return estatisticas;
}