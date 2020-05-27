export class Client { 
    idCliente: string;
    razaoSocial: string;
    nomeFantasia: string;
    nomeContato: string;
    cpf: string;
    email: string;
    website: string;
    telefone: string;
    celular: string;
    descricao: string;
    senha: string;
    idStatus: number;
    cnpj: string;
    enderecos: Array<Enderecos>
}

export class Enderecos {
    idEndereco: string;
    idCliente: string;
    idStatus: string;
    nome: string;
    logradouro: string;
    complemento: string;
    bairro: string;
    cidade: string;
    uf: string;
    cep: string;

    constructor(parameters) {
        
    }
}