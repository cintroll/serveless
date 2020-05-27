
import { APIGatewayEvent, Context  } from 'aws-lambda';
import 'source-map-support/register';
import { DynamoDB, S3 } from 'aws-sdk';
const csv = require('csvtojson');
const crypto = require('crypto');

import {Products} from './services/products';

const documentClient = new DynamoDB.DocumentClient();

exports.create = async (event: APIGatewayEvent, _context: Context) => {
  const generateUUID = () => crypto.randomBytes(16).toString("hex");
  try {
    console.log(event)
    //TODO inserir validacoes dos campos criacao
    const data = JSON.parse(event.body); 
    console.log(data)
    data.id = generateUUID()
    await new Products().create({documentClient},data);
    const response = {
        statusCode: 200,
        body: JSON.stringify({})
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

    await new Products().update({documentClient},JSON.parse(event.body), event.pathParameters.idProduto);
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
    await new Products().deleteById({documentClient},event.pathParameters.idProduto);
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

exports.getAll = async (event: APIGatewayEvent, _context: Context) =>{
  try {
    //TODO pegar campos queryParameter
    console.log(JSON.stringify(event))
    const products = await new Products().getAll({documentClient});
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


exports.getByid = async (event: APIGatewayEvent, _context: Context) =>{
  try {
    const products = await new Products().getByid({documentClient}, event.pathParameters.idProduto);
    
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


const getProductFromCsv = async (params) => {
  const stream = new S3().getObject(params).createReadStream();
  return csv().fromStream(stream);
};

exports.updateByS3 = async (event: APIGatewayEvent, _context: Context) => {
  const params = {
      Bucket: 'cakih',
      Key: 'produto.csv'
  };
  const productService = new Products()

  const results = await getProductFromCsv(params);

  for (const product of results) {

      const data = await productService.getByid({ documentClient }, product.id);

      if (data && data.id) {
          await productService.update({ documentClient }, data, data.id);
      } else {
          await productService.create({ documentClient }, product);
      }
  }

}