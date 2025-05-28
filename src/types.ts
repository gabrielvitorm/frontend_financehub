export interface Usuario {
  idUsuario: number;
  nomeUsuario: string;
  emailUsuario: string;
  cpfUsuario: string;
}

export interface LoginDTO {
  emailUsuario: string;
  senhaUsuario: string;
}

export interface Transacao {
  idTransacao?: number;
  nomeTransaca: string;             
  descricaoTransacao: string;   
  tipoTransacao: string;
  tipoCategoria: string;
  valor: number;
  dataCriacao: string;
  usuario?: { idUsuario: number };
  orcamento?: { idOrcamento: number };
}

export interface Orcamento {
  idOrcamento: number;
  limiteOrcamento: number;
  mesReferencia: string;
}