
import Joi from '@hapi/joi';

const TableName = "cliente-cakih"

const constructor = function (data) {
  data = data || {}
  return {
    id: data.id || "",
    razaoSocial: data.razaoSocial || "",
    nomeFantasia: data.nomeFantasia || "",
    nomeContato: data.nomeContato || "",
    cpf: data.cpf || "",
    email: data.email || "",
    website: data.website || "",
    telefone: data.telefone || "",
    celular: data.celular || "",
    descricao: data.descricao || "",
    senha: data.senha || "",
    idStatus: data.idStatus || "",
    cnpj: data.idStatus || ""
  }
}

const Schema = Joi.object().keys({
  id: Joi.string(),
  razaoSocial: Joi.string(),
  nomeFantasia: Joi.string(),
  nomeContato: Joi.string(),
  cpf: Joi.string(),
  email: Joi.string(),
  website: Joi.string(),
  telefone: Joi.string(),
  celular: Joi.string(),
  descricao: Joi.string(),
  senha: Joi.string(),
  idStatus: Joi.string(),
  cnpj: Joi.string()
})

const modelValidation = function (data) {
  return !!Schema.validate(data).error
}

export class Cliente {

  constructor() {
    //criar injecao do banco, criar injecao de dependencia s3    
  }

  async createAfterCognito({ documentClient }, { // Creating an Item with a unique id and with the passed title
    id,
    email,
    enderecos
  }) {
    const params = {
      TableName,
      Item: {
        id,
        email,
        enderecos
      }
    }
    const data = await documentClient.put(params).promise();
    console.log("save")
    return data
  }

  async create({ documentClient }, { // Creating an Item with a unique id and with the passed title
    id,
    razaoSocial,
    nomeFantasia,
    nomeContato,
    cpf,
    email,
    website,
    telefone,
    celular,
    descricao,
    senha,
    idStatus,
    cnpj,
    enderecos
  }) {
    const params = {
      TableName,
      Item: {
        id,
        razaoSocial,
        nomeFantasia,
        nomeContato,
        cpf,
        email,
        website,
        telefone,
        celular,
        descricao,
        senha,
        idStatus,
        cnpj,
        enderecos
      }
    }
    const data = await documentClient.put(params).promise();
    return data
  }

  async getByid({ documentClient }, id) {

    const params = {
      TableName, // The name of your DynamoDB table
      Key: {
        id: id
      }

    };

    const data = await documentClient.get(params).promise();
    return data && data.Item ? data.Item : null
  }

  async update({ documentClient }, {
    razaoSocial,
    nomeFantasia,
    nomeContato,
    cpf,
    email,
    website,
    telefone,
    celular,
    descricao,
    senha,
    idStatus,
    cnpj
  }, id) {

    const params = {
      TableName,
      Key: {
        "id": id
      },
      UpdateExpression: "set razaoSocial=:razaoSocial,nomeFantasia=:nomeFantasia,nomeContato=:nomeContato,cpf=:cpf,email=:email,website=:website,telefone=:telefone,celular=:celular,descricao=:descricao,senha=:senha,idStatus=:idStatus,cnpj=:cnpj",
      ExpressionAttributeValues: {
        ":razaoSocial": razaoSocial,
        ":nomeFantasia": nomeFantasia,
        ":nomeContato": nomeContato,
        ":cpf": cpf,
        ":email": email,
        ":website": website,
        ":telefone": telefone,
        ":celular": celular,
        ":descricao": descricao,
        ":senha": senha,
        ":idStatus": idStatus,
        ":cnpj": cnpj
      },
      ReturnValues: "UPDATED_NEW"
    };

    await documentClient.update(params).promise();
  }

  async deleteById({ documentClient }, id) {
    console.log("entrouuuuuuuuuuuuu")
    const params = {
      TableName,
      Key: {
        "id": id
      }
    }
    await documentClient.delete(params).promise()
  }

  async getAll({ documentClient }) {
    //TODO pagination
    const params = {
      TableName
    }

    const clientes = await documentClient.scan(params).promise()
    return clientes && clientes.Items ? clientes.Items : []
  
  }

  async enderecoGetAllById({ documentClient }, idCliente){
    //TODO pagination
    const params = {
      TableName,
      Key: {
        "id": idCliente
      }
    }

    let clientes = await documentClient.scan(params).promise()
    return  clientes && clientes.Items ? clientes.Items.enderecos : []
    
  }

  async enderecoGetById({ documentClient }, idCliente, idEndereco){
    const params = {
      TableName,
      Key: {
        "id": idCliente
      }
    }

    let clientes = await documentClient.scan(params).promise()
    let enderecos =  clientes && clientes.Items ? clientes.Items.enderecos : []
    
    enderecos = enderecos.filter((data)=> data.idEndereco != idEndereco)
    
    return enderecos && enderecos.lenght ? enderecos[0] : {}
  }

  async enderecoDeleteById({ documentClient }, idCliente, idEndereco){

   
    let cliente = await documentClient.get({
        TableName, // The name of your DynamoDB table
        Key: {
            id: idCliente
        }
    }).promise();
    //verificar se produto ja existe
    
    if(!cliente){
        return "Cliente nao encontrado"
    }

    cliente = cliente.Item

    const params = {
        TableName,
        Key: {
            "id": idCliente
        },
        UpdateExpression: "set enderecos=:enderecos",
        ExpressionAttributeValues: {
            ":enderecos": cliente.enderecos.filter((data)=> data.idEndereco != idEndereco)
        },
        ReturnValues: "UPDATED_NEW"
    };

    await documentClient.update(params).promise();

  }
  async enderecoUpdate({ documentClient }, enderecoData,idCliente, idEndereco){

   
    let cliente = await documentClient.get({
        TableName, // The name of your DynamoDB table
        Key: {
            id: idCliente
        }
    }).promise();
    //verificar se produto ja existe
    
    //TODO verifificar formato de erro
    if(!cliente){
        return "Cliente nao encontrado"
    }

    cliente = cliente.Item
    let clienteExist = false;

    cliente.enderecos = cliente.enderecos.map((item)=>{
        console.log(item, enderecoData)
        if(item.idEndereco === idEndereco){
            console.log(enderecoData)
            clienteExist = true
            console.log("entrouuuuuuuuuuuuuuu")
            return enderecoData
        }

        return item
    })

    const params = {
        TableName,
        Key: {
            "id": idCliente
        },
        UpdateExpression: "set enderecos=:enderecos",
        ExpressionAttributeValues: {
            ":enderecos": cliente.enderecos
        },
        ReturnValues: "UPDATED_NEW"
    };

    await documentClient.update(params).promise();
  }

  async enderecoCreate({ documentClient }, enderecoData,idCliente){

    let cliente = await documentClient.get({
      TableName, // The name of your DynamoDB table
      Key: {
          id: idCliente
      }
  }).promise();
  //verificar se produto ja existe
  
  //TODO verifificar formato de erro
  if(!cliente){
      return "Cliente nao encontrado"
  }

  cliente = cliente.Item

  cliente.ende
  const params = {
      TableName,
      Key: {
          "id": idCliente
      },
      UpdateExpression: "set enderecos=:enderecos",
      ExpressionAttributeValues: {
          ":enderecos": cliente.enderecos.push(enderecoData)
      },
      ReturnValues: "UPDATED_NEW"
  };

  await documentClient.update(params).promise();
  }
  

}