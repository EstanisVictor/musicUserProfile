import pandas as pd
from sklearn.cluster import KMeans
import json
import plotly.express as px

class ClusteringAnalyzer:
    def __init__(self, file_path):
        self.file_path = file_path
        self.data = None
        self.estilos_musicais = ['rock', 'samba', 'pop', 'rap']
        self.num_clusters = 8
        self.kmeans = KMeans(n_clusters=self.num_clusters, random_state=42)

    def load_data(self):
        self.data = pd.read_csv(self.file_path)

    def apply_clustering(self):
        X = self.data.iloc[:, 1:]
        self.data['cluster'] = self.kmeans.fit_predict(X)

    def describe_clusters(self):
        descriptions = {}
        for cluster_id in range(self.num_clusters):
            cluster_data = self.data[self.data['cluster'] == cluster_id]
            description_cluster = self._describe_cluster(cluster_id + 1, cluster_data)
            descriptions[f'Cluster_{cluster_id + 1}'] = description_cluster
        return descriptions

    def _describe_cluster(self, cluster_id, cluster_data):
        description = {"Cluster_ID": cluster_id}
        num_users = len(cluster_data)
        description["Numero_Usuarios"] = num_users
        desc_stats = cluster_data.describe().transpose()
        desc_stats = desc_stats[['mean', 'std', 'min', '25%', '50%', '75%', 'max']].round(2)
        description["Estatisticas_Horas_Ouvidas"] = desc_stats.to_dict()
        description["Interpretacao"] = f"Breve interpretação para o Cluster {cluster_id}:\n"
        estilos_interessantes = []
        for estilo in self.estilos_musicais:
            if desc_stats['mean'][f'horas_ouvidas_{estilo}'] > 30:
                estilos_interessantes.append(estilo.capitalize())
        description["Estilos_Interessantes"] = estilos_interessantes
        return description

    def generate_plots(self):
        for cluster_id in range(self.num_clusters):
            cluster_data = self.data[self.data['cluster'] == cluster_id]
            fig = px.scatter_matrix(
                cluster_data,
                dimensions=[f'horas_ouvidas_{estilo}' for estilo in self.estilos_musicais],
                labels={f'horas_ouvidas_{estilo}': estilo.capitalize() for estilo in self.estilos_musicais},
                title=f'Dispersão para Cluster {cluster_id + 1}',
                size_max=20
            )
            fig.update_traces(marker=dict(size=2))
            fig.write_image(f'dispersao_cluster_{cluster_id + 1}.png')

    def save_cluster_descriptions(self):
        descriptions = self.describe_clusters()
        for cluster_id, description in descriptions.items():
            with open(f'descricao_cluster_{cluster_id}.json', 'w') as json_file:
                json.dump(description, json_file, indent=4)
