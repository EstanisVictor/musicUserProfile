export interface Estatisticas {
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
}

export interface Dados {
  Cluster_ID: number;
  Numero_Usuarios: number;
  Estatisticas_Horas_Ouvidas: Estatisticas;
  Interpretacao: string;
  Estilos_Interessantes: string[];
}