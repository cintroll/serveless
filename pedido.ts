
import { APIGatewayEvent, Context } from 'aws-lambda';
import 'source-map-support/register';
import { DynamoDB} from 'aws-sdk';
const crypto = require('crypto');

import { Pedido } from './services/pedido';
const clientId = null
const documentClient = new DynamoDB.DocumentClient();

exports.create = async (event: APIGatewayEvent, _context: Context) => {
    const generateUUID = () => crypto.randomBytes(16).toString("hex");
    try {

        //TODO verificar se cliente existe
        //TODO verificar se endereco existe
        //definir status padrao caso nao tenha

        console.log(event)
        //TODO inserir validacoes dos campos criacao
        const data = JSON.parse(event.body);
        data.idCliente = clientId || event.requestContext.authorizer.claims.sub
        data.id = generateUUID()
        data.produtos = data.produtos || []
        await new Pedido().create({ documentClient }, data);
        const response = {
            statusCode: 200,
            body: JSON.stringify({
                idPedido: data.id
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



exports.createPedidoProduto = async (event: APIGatewayEvent, _context: Context) => {
    try {

        //TODO verificar se produto existe
        //definir status padrao caso nao tenha

        console.log(event)
        //TODO inserir validacoes dos campos criacao
        const data = JSON.parse(event.body);
        const idCliente = clientId || event.requestContext.authorizer.claims.sub
        await new Pedido().adicionarProdutoPedido({ documentClient }, data, event.pathParameters.idPedido, idCliente);
        const response = {
            statusCode: 200,
            body: JSON.stringify({
                idPedido: data.id
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

exports.deletarPedidoProduto = async (event: APIGatewayEvent, _context: Context) => {
    try {

        //TODO verificar se produto existe
        //definir status padrao caso nao tenha

        console.log(event)
        const idCliente = clientId || event.requestContext.authorizer.claims.sub
        await new Pedido().deletarProdutoPedido({ documentClient }, event.pathParameters.idPedido, event.pathParameters.idProduto, idCliente );
        const response = {
            statusCode: 200,
            body: JSON.stringify({
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



exports.update = async (event: APIGatewayEvent, _context: Context) => {
    try {
        //TODO inserir validacoa dos campos atualizacao

        const idCliente = clientId || event.requestContext.authorizer.claims.sub
        await new Pedido().update({ documentClient }, JSON.parse(event.body), event.pathParameters.idPedido, idCliente);
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

exports.deleteByid = async (event: APIGatewayEvent, _context: Context) => {
    try {

        //TODO inserir validacao dos campos
        const idCliente = clientId || event.requestContext.authorizer.claims.sub
        await new Pedido().deleteById({ documentClient }, event.pathParameters.idPedido, idCliente);
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
        const idCliente = clientId || event.requestContext.authorizer.claims.sub
        console.log(idCliente)
        const products = await new Pedido().getAll({ documentClient }, idCliente);
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


exports.getByid = async (event: APIGatewayEvent, _context: Context) => {
    try {
        const idCliente = clientId || event.requestContext.authorizer.claims.sub
        const products = await new Pedido().getByid({ documentClient }, event.pathParameters.idPedido, idCliente);
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




