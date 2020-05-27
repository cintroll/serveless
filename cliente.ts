
import { APIGatewayEvent, CognitoUserPoolEvent, Context, Callback } from 'aws-lambda';
import 'source-map-support/register';
import { DynamoDB} from 'aws-sdk';
const crypto = require('crypto');

import { Cliente } from './services/cliente';

const documentClient = new DynamoDB.DocumentClient();

//TODO criar endereco
// TODO atualizar endereco
// TODO listar endereco por id
// TODO listar todos endereços
// TODO deletar endereco


exports.create = async (event: CognitoUserPoolEvent, _context: Context, callback: Callback) => {
    try {
        //TODO verificar se cliente existe
        //TODO verificar se endereco existe
        //TODO definir status padrao caso nao tenha

        console.log(JSON.stringify(event))
  
        const clienteModel = {
            email: event.request.userAttributes.email,
            id: event.userName,
            enderecos: []
        }
        await new Cliente().createAfterCognito({ documentClient }, clienteModel);
        callback(null,event)
    } catch (error) {
        console.log(error)
        return {
            statusCode: 500,
            body: JSON.stringify({})
        }
    }
};

exports.update = async (event: APIGatewayEvent, _context: Context) => {
    try {
        //TODO inserir validacoa dos campos atualizacao

        await new Cliente().update({ documentClient }, JSON.parse(event.body), event.pathParameters.idCliente);
        const response = {
            statusCode: 200,
            body: JSON.stringify({})
        };
        return response;
    } catch (error) {
        console.log(error)
        return {
            statusCode: 500
        }
    }
};

exports.deleteById = async (event: APIGatewayEvent, _context: Context) => {
    try {

        //TODO inserir validacao dos campos

        await new Cliente().deleteById({ documentClient }, event.pathParameters.idCliente);
        const response = {
            statusCode: 200,
            body: JSON.stringify({})
        };
        return response;
    } catch (error) {
        console.log(error)
        return {
            statusCode: 500
        }
    }
};

exports.getAll = async (event: APIGatewayEvent, _context: Context) => {
    try {
        //TODO pegar campos queryParameter
        const products = await new Cliente().getAll({ documentClient });
        const response = {
            statusCode: 200,
            body: JSON.stringify({
                data: products
            })
        };
        return response;
    } catch (error) {
        console.log(error)
        return {
            statusCode: 500
        }
    }
};


exports.getById = async (event: APIGatewayEvent, _context: Context) => {
    try {
        
        const products = await new Cliente().getByid({ documentClient }, event.pathParameters.idCliente);

        //TODO se objeto for igual a nulo, retornar 404

        const response = {
            statusCode: 200,
            body: JSON.stringify({
                data: products
            })
        };
        return response;
    } catch (error) {
        console.log(error)
        return {
            statusCode: 500
        }
    }
};




exports.enderecoCreate = async (event: APIGatewayEvent, _context: Context) => {
    const generateUUID = () => crypto.randomBytes(16).toString("hex");
    try {

        //TODO verificar se cliente existe
        //TODO verificar se endereco existe
        //TODO definir status padrao caso nao tenha

        console.log(event)
        //TODO inserir validacoes dos campos criacao
        const data = JSON.parse(event.body);
        data.id = generateUUID()
        data.enderecos = []
        await new Cliente().create({ documentClient }, data);
        const response = {
            statusCode: 200,
            body: JSON.stringify({
                idCliente: data.id
            })
        };
        return response;
    } catch (error) {
        console.log(error)
        return {
            statusCode: 500,
            body: JSON.stringify({})
        }
    }
};

exports.enderecoUpdate = async (event: APIGatewayEvent, _context: Context) => {
    try {
        //TODO inserir validacoa dos campos atualizacao

        await new Cliente().enderecoUpdate({ documentClient }, JSON.parse(event.body), event.pathParameters.idCliente,  event.pathParameters.idEndereco);
        const response = {
            statusCode: 200,
            body: JSON.stringify({})
        };
        return response;
    } catch (error) {
        console.log(error)
        return {
            statusCode: 500
        }
    }
};

exports.enderecoDeleteById = async (event: APIGatewayEvent, _context: Context) => {
    try {

        //TODO inserir validacao dos campos

        await new Cliente().enderecoDeleteById({ documentClient }, event.pathParameters.idCliente, event.pathParameters.idEndereco);
        const response = {
            statusCode: 200,
            body: JSON.stringify({})
        };
        return response;
    } catch (error) {
        console.log(error)
        return {
            statusCode: 500
        }
    }
};

exports.enderecoGetAll = async (event: APIGatewayEvent, _context: Context) => {
    try {
        //TODO pegar campos queryParameter
        const products = await new Cliente().enderecoGetAllById({ documentClient }, event.pathParameters.idCliente);
        const response = {
            statusCode: 200,
            body: JSON.stringify({
                data: products
            })
        };
        return response;
    } catch (error) {
        console.log(error)
        return {
            statusCode: 500
        }
    }
};

exports.enderecoGetById = async (event: APIGatewayEvent, _context: Context) => {
    try {
        
        const products = await new Cliente().enderecoGetById({ documentClient }, event.pathParameters.idCliente, event.pathParameters.idEndereco);

        //TODO se objeto for igual a nulo, retornar 404
        
        const response = {
            statusCode: 200,
            body: JSON.stringify({
                data: products
            })
        };
        return response;
    } catch (error) {
        console.log(error)
        return {
            statusCode: 500
        }
    }
};
