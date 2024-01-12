import pandas as pd
from sklearn.cluster import KMeans
import json
import plotly.express as px

class ClusterAnalysis:
    def __init__(self, data_path, num_clusters=8):
        self.data = pd.read_csv(data_path)
        self.X = self.data.iloc[:, 1:]
        self.num_clusters = num_clusters
        self.estilos_musicais = ['rock', 'samba', 'pop', 'rap']
        self.kmeans = KMeans(n_clusters=self.num_clusters, random_state=42)
        self.data['cluster'] = self.kmeans.fit_predict(self.X)

    def _descrever_cluster(self, cluster_id, cluster_data):
        descricao = {"Cluster_ID": cluster_id}
        num_usuarios = len(cluster_data)
        descricao["Numero_Usuarios"] = num_usuarios

        desc_stats = cluster_data.describe().transpose()
        desc_stats = desc_stats[['mean', 'std', 'min', '25%', '50%', '75%', 'max']].round(2)
        descricao["Estatisticas_Horas_Ouvidas"] = desc_stats.to_dict()

        descricao["Interpretacao"] = f"Breve interpretação para o Cluster {cluster_id}:\n"
        
        estilos_interessantes = []
        for estilo in self.estilos_musicais:
            if desc_stats['mean'][f'horas_ouvidas_{estilo}'] > 30:
                estilos_interessantes.append(estilo.capitalize())
        
        descricao["Estilos_Interessantes"] = estilos_interessantes

        return descricao

    def gerar_graficos_e_descricoes(self):
        for cluster_id in range(self.num_clusters):
            cluster_data = self.data[self.data['cluster'] == cluster_id]

            fig = px.scatter_matrix(cluster_data, dimensions=[f'horas_ouvidas_{estilo}' for estilo in self.estilos_musicais],
                                   labels={f'horas_ouvidas_{estilo}': estilo.capitalize() for estilo in self.estilos_musicais},
                                   title=f'Dispersão para Cluster {cluster_id + 1}',
                                   size_max=20)
            
            fig.update_traces(marker=dict(size=2))

            # Salve as imagens na pasta "images"
            fig.write_image(f'images/dispersao_cluster_{cluster_id + 1}.png')

            descricao_cluster = self._descrever_cluster(cluster_id + 1, cluster_data)

            # Salve os arquivos JSON na pasta "desc"
            with open(f'desc/descricao_cluster_{cluster_id + 1}.json', 'w') as json_file:
                json.dump(descricao_cluster, json_file, indent=4)
