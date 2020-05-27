const Joi = require("@hapi/joi");

const TableName = "pedido-cakih";

const constructor = function (data) {
    data = data || {}
    return {
        id: data.id || "",
        idCliente: data.idCliente || "",
        idEndereco: data.idEndereco || "",
        idStatusPedido: data.idStatusPedido || "",
        valorTotal: data.valorTotal || 0,
        valorDesconto: data.valorDesconto || 0,
        valorFrete: data.valorFrete || 0,
        dataPedido: data.dataPedido || "",
        dataPrevisaoPedido: data.dataPrevisaoPedido || "",
        dataPrevisaoEntrega: data.dataPrevisaoEntrega || ""
    }
}

const Schema = Joi.object().keys({
    id: Joi.string(),
    idCliente: Joi.string().required(),
    idEndereco: Joi.string().required(),
    idStatusPedido: Joi.string().required(),
    valorTotal: Joi.number().required(),
    valorDesconto: Joi.number().required(),
    valorFrete: Joi.number().required(),
    dataPedido: Joi.date().required(),
    dataPrevisaoPedido: Joi.date().required(),
    dataPrevisaoEntrega: Joi.date().required(),
})

const modelValidation = function (data) {
    return !!Schema.validate(data).error
}

export class Pedido {
    async create({ documentClient }, { // Creating an Item with a unique id and with the passed title
        id,
        idCliente,
        idEndereco,
        idStatusPedido,
        valorTotal,
        valorDesconto,
        valorFrete,
        dataPedido,
        dataPrevisaoPedido,
        dataPrevisaoEntrega,
        produtos
    }) {
        const params = {
            TableName, // The name of your DynamoDB table
            Item: { // Creating an Item with a unique id and with the passed title
                id,
                idCliente,
                idEndereco,
                idStatusPedido,
                valorTotal,
                valorDesconto,
                valorFrete,
                dataPedido,
                dataPrevisaoPedido,
                dataPrevisaoEntrega,
                produtos
            }
        }
        const data = await documentClient.put(params).promise();
        return data
    }

    async getByid({ documentClient }, id, idCliente) {

        const params = {
            TableName,
            FilterExpression: '#idCliente = :idCliente and #id=:id',
            ExpressionAttributeNames: {
                '#idCliente': 'idCliente',
                '#id': 'id',
            },
            ExpressionAttributeValues: {
                ':idCliente': idCliente,
                ':id': id,
            },
        }
        
        const data = await documentClient.scan(params).promise();

        return data.Items.length > 0 ? data.Items[0] : {}
    }

    async update({ documentClient }, {
        idEndereco,
        idStatusPedido,
        valorTotal,
        valorDesconto,
        valorFrete,
        dataPedido,
        dataPrevisaoPedido,
        dataPrevisaoEntrega
    }, id, idCliente) {



        if(consult.idCliente !== idCliente){
            throw new Error("Usuário invalido")
        }

        const params = {
            TableName,
            Key: {
                "id": id
            },
            UpdateExpression: "set idEndereco=:idEndereco,idStatusPedido=:idStatusPedido,valorTotal=:valorTotal,valorDesconto=:valorDesconto,valorFrete=:valorFrete,dataPedido=:dataPedido,dataPrevisaoPedido=:dataPrevisaoPedido,dataPrevisaoEntrega=:dataPrevisaoEntrega",
            ExpressionAttributeValues: {
                ":idEndereco": idEndereco,
                ":idStatusPedido": idStatusPedido,
                ":valorTotal": valorTotal,
                ":valorDesconto": valorDesconto,
                ":valorFrete": valorFrete,
                ":dataPedido": dataPedido,
                ":dataPrevisaoPedido": dataPrevisaoPedido,
                ":dataPrevisaoEntrega": dataPrevisaoEntrega
            },
            ReturnValues: "UPDATED_NEW"
        };

        await documentClient.update(params).promise();
        
    }

    // async logicDelete(id,idCliente, idStatusPedido) {
    //     const params = {
    //         TableName,
    //         Key: {
    //             "id": id,
    //             "idCliente": idCliente
    //         },
    //         UpdateExpression: "set idStatus =:idStatus",
    //         ExpressionAttributeValues: {
    //             ":idStatus": idStatusPedido !== null ? 0 : 1,
    //         },
    //         ReturnValues: "UPDATED_NEW"
    //     };
    // }

    async deleteById({ documentClient }, id, idCliente) {

        const consult =await this.getByid({documentClient}, id,idCliente)
        if(consult.idCliente !== idCliente){
            throw new Error("Usuário invalido")
        }
        const params = {
            TableName,
            Key: {
                "id": id
            }
        }
        await documentClient.delete(params).promise()
    }

    async getAll({ documentClient }, idCliente) {
        //TODO pagination
        const params = {
            TableName,
            FilterExpression: '#idCliente = :idCliente',
            ExpressionAttributeNames: {
                '#idCliente': 'idCliente',
            },
            ExpressionAttributeValues: {
                ':idCliente': idCliente,
            },
        }
        const produtos = await documentClient.scan(params).promise()

        return produtos && produtos.Items ? produtos.Items : []

    }


    async adicionarProdutoPedido({ documentClient }, pedidoData, idPedido, idCliente) {

        const consult =await this.getByid({documentClient}, idPedido,idCliente)
        if(consult.idCliente !== idCliente){
            throw new Error("Usuário invalido")
        }
        let  pedido = await documentClient.get({
            TableName, // The name of your DynamoDB table
            Key: {
                id: idPedido
            }
        }).promise();
        //verificar se produto ja existe
        
        if(!pedido){
            return "pedido nao encontrado"
        }

        pedido = pedido.Item
        let productExist = false;

        pedido.produtos = pedido.produtos.map((item)=>{
            console.log(item, pedidoData)
            if(item.idProduto === pedidoData.idProduto){
                console.log(pedidoData)
                productExist = true
                console.log("entrouuuuuuuuuuuuuuu")
                return pedidoData
            }

            return item
        })

        if(!productExist){
            pedido.produtos.push(pedidoData)
        }

        console.log(pedido)
        //adicionar pedido

        const params = {
            TableName,
            Key: {
                "id": idPedido
            },
            UpdateExpression: "set produtos=:produtos",
            ExpressionAttributeValues: {
                ":produtos": pedido.produtos
            },
            ReturnValues: "UPDATED_NEW"
        };

        const result = await documentClient.update(params).promise();
        console.log(result)
    }

    async deletarProdutoPedido({ documentClient }, idPedido, idProduto, idCliente) {
        const consult =await this.getByid({documentClient}, idPedido,idCliente)
        if(consult.idCliente !== idCliente){
            throw new Error("Usuário invalido")
        }
        let  pedido = await documentClient.get({
            TableName, // The name of your DynamoDB table
            Key: {
                id: idPedido
            }
        }).promise();
        //verificar se produto ja existe
        
        if(!pedido){
            return "pedido nao encontrado"
        }

        pedido = pedido.Item
        pedido.produtos = pedido.produtos.filter((data)=> data.idProduto != idProduto)

        console.log(pedido)
        //adicionar pedido

        const params = {
            TableName,
            Key: {
                "id": idPedido
            },
            UpdateExpression: "set produtos=:produtos",
            ExpressionAttributeValues: {
                ":produtos": pedido.produtos
            },
            ReturnValues: "UPDATED_NEW"
        };

        const result = await documentClient.update(params).promise();
    }
}