import Joi from  '@hapi/joi';
import { ConfigurationServicePlaceholders } from 'aws-sdk/lib/config_service_placeholders';

const TableName = "produto-cakih";

const constructor = function (data) {
  data = data || {}
  return {
    id: data.idProduto || "",
    idCategoria: data.idCategoria || "",
    idStatus: data.idStatus || "",
    nome: data.nome || "",
    quantidadeEstoqueMinimo: data.quantidadeEstoqueMinimo || "",
    quantidadeEstoqueAtual: data.quantidadeEstoqueAtual || "",
    tipoMoeda: data.tipoMoeda || "",
    valor: data.valor || "",
    valorDesconto: data.valorDesconto || "",
    cor: data.cor || "",
    urlImagem: data.urlImagem || "",
  }
}

const Schema = Joi.object().keys({
  id: Joi.string(),
  idCategoria: Joi.string().required(),
  idStatus: Joi.string().required(),
  nome: Joi.string(),
  quantidadeEstoqueMinimo: Joi.number().required(),
  quantidadeEstoqueAtual: Joi.number().required(),
  tipoMoeda: Joi.any(),
  valor: Joi.number().required(),
  valorDesconto: Joi.number().required(),
  cor: Joi.string(),
  urlImagem: Joi.string().uri()
})

const modelValidation = function (data) {
  return !!Schema.validate(data).error
}

/*TODO Filtro de produtos ativos
  TODO busca por quantidade
  TODO paginação

*/

export class Products {

  constructor() {
    //criar injecao do banco, criar injecao de dependencia s3    
  }

  async getAll({ documentClient }) {
    const params = {
      TableName
    }
    const itens = await documentClient.scan(params).promise()
    return itens && itens.Items ? itens.Items : []
  }

  async create ({ documentClient }, { // Creating an Item with a unique id and with the passed title
    id,
    idCategoria,
    idStatus,
    nome,
    quantidadeEstoqueMinimo,
    quantidadeEstoqueAtual,
    tipoMedida,
    valor,
    valorDesconto,
    cor,
    urlImagem
  }) {
    const params = {
      TableName, // The name of your DynamoDB table
      Item: { // Creating an Item with a unique id and with the passed title
        id,
        idCategoria,
        idStatus,
        nome,
        quantidadeEstoqueMinimo,
        quantidadeEstoqueAtual,
        tipoMedida,
        valor,
        valorDesconto,
        cor,
        urlImagem
      }
    }
    const data = await documentClient.put(params).promise();
    return data
  }
  
  async getByid ({ documentClient }, id) {
  
    const params = {
      TableName, // The name of your DynamoDB table
      Key: {
        id: id
      }
  
    };
  
    const data = await documentClient.get(params).promise();
    return data
  }
  
  async update ({ documentClient }, {
    idCategoria,
    idStatus,
    nome,
    quantidadeEstoqueMinimo,
    quantidadeEstoqueAtual,
    tipoMedida,
    valor,
    valorDesconto,
    cor,
    urlImagem
  }, id) {
  
    const params = {
      TableName,
      Key: {
        "id": id
      },
      UpdateExpression: "set idCategoria =:idCategoria,idStatus =:idStatus,nome =:nome,quantidadeEstoqueMinimo =:quantidadeEstoqueMinimo,quantidadeEstoqueAtual =:quantidadeEstoqueAtual,tipoMedida =:tipoMedida,valor =:valor,valorDesconto =:valorDesconto,cor =:cor,urlImagem =:urlImagem",
      ExpressionAttributeValues: {
        ":idCategoria": idCategoria,
        ":idStatus": idStatus,
        ":nome": nome,
        ":quantidadeEstoqueMinimo": quantidadeEstoqueMinimo,
        ":quantidadeEstoqueAtual": quantidadeEstoqueAtual,
        ":tipoMedida": tipoMedida,
        ":valor": valor,
        ":valorDesconto": valorDesconto,
        ":cor": cor,
        ":urlImagem": urlImagem
      },
      ReturnValues: "UPDATED_NEW"
    };
  
    await documentClient.update(params).promise();
  }
  
  async logicDelete ({ documentClient },id) {
    const statusInactive = 0;
    const params = {
      TableName,
      Key: {
        "id": id
      },
      UpdateExpression: "set idStatus =:idStatus",
      ExpressionAttributeValues: {
        ":idStatus": statusInactive,
      },
      ReturnValues: "UPDATED_NEW"
    };
    await documentClient.update(params).promise();
  }
  
  async deleteById ({ documentClient }, id) {
    console.log(id);
    const params = {
      TableName,
      Key: {
        "id": id
      }
    }
    await documentClient.delete(params).promise()
  }
}