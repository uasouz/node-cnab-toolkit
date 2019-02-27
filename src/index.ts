import {loadDefaultConfig} from './utils';

import {BANK, CNAB_EOL} from "./config";
import {
    CnabConfig,
    CNABField,
    GenericKeyedObject,
    LayoutCNAB240,
    LayoutCNAB400,
    Lote, RetornoCNAB240,
    RetornoCNAB400
} from "./interfaces";
import * as fs from "fs";

const parseDataToLayout = (layout: any,header: string) =>{
    const headerObj: GenericKeyedObject = {};
    Object.keys(layout).forEach(key=>{
        const field = layout[key] as CNABField;
        headerObj[key] = header.slice(field.pos[0]-1,field.pos[1])
    });
    return headerObj
};

const defaultCNAB240Parser = (layout: LayoutCNAB240,parameters: RetornoCNAB240) =>{
    let {header_arquivo, lotes, trailer_arquivo} = parameters;
    const result: GenericKeyedObject = {};
    //Header Parse
    const headerObj: GenericKeyedObject = {};
    Object.keys(layout.header_arquivo).forEach(key=>{
        const field = layout.header_arquivo[key] as CNABField;
        headerObj[key] = header_arquivo.slice(field.pos[0]-1,field.pos[1])
    });
    //End Header Parse

    //Details parse
    const lotesObject: GenericKeyedObject = {};
    Object.keys(lotes).forEach(key=>{
        const lote = lotes[key];
        const segmentos = layout.detalhes as GenericKeyedObject;
        const detalhesObjectArray: GenericKeyedObject[] = [];
        lote.detalhes.forEach((detalhe)=>{
            const detalhesObject: GenericKeyedObject = {};
            console.log(detalhe.slice(13,14),Object.keys(segmentos));
            const segmento = segmentos["segmento_"+detalhe.slice(13,14).toLowerCase()];
            Object.keys(segmento).forEach(key=> {
                const field = segmento[key] as CNABField;
                detalhesObject[key] = detalhe.slice(field.pos[0] - 1, field.pos[1])
            });
            detalhesObjectArray.push(detalhesObject)
        });
        lotesObject[key] = {
            header_lote: parseDataToLayout(layout.header_lote,lote.header_lote),
            detalhes: detalhesObjectArray,
            trailer_lote: parseDataToLayout(layout.trailer_lote,lote.trailer_lote)
        }
    });
    //End Details parse

    //Trailer Parse
    const trailerObject: GenericKeyedObject = {};
    Object.keys(layout.trailer_arquivo).forEach(key=>{
        const field = layout.trailer_arquivo[key] as CNABField;
        trailerObject[key] = trailer_arquivo.slice(field.pos[0]-1,field.pos[1])
    });
    //End Trailer Parse

    result["header_arquivo"] = headerObj;
    result["trailer_arquivo"] = trailerObject;
    result["lotes"] = lotesObject;
    return result
};

const defaultCNAB400Parser = (layout: LayoutCNAB400,parameters: RetornoCNAB400) =>{
    let {header_arquivo, detalhes, trailer_arquivo} = parameters;
    const result: GenericKeyedObject = {};
    //Header Parse
    const headerObj: GenericKeyedObject = {};
        Object.keys(layout.header_arquivo).forEach(key=>{
            const field = layout.header_arquivo[key] as CNABField;
            headerObj[key] = header_arquivo.slice(field.pos[0]-1,field.pos[1])
        });
    //End Header Parse

    //Details parse
    const detalhesObjectArray: GenericKeyedObject[] = [];
    const segmentos = layout.detalhes as GenericKeyedObject;
    detalhes.forEach((detalhe)=>{
        const detalhesObject: GenericKeyedObject = {};
        console.log(detalhe.slice(0,1),Object.keys(segmentos));
        const segmento = segmentos["segmento_"+detalhe.slice(0,1)];
        Object.keys(segmento).forEach(key=> {
            const field = segmento[key] as CNABField;
            detalhesObject[key] = detalhe.slice(field.pos[0] - 1, field.pos[1])
        });
        detalhesObjectArray.push(detalhesObject)
    });
    //End Details parse

    //Trailer Parse
    const trailerObject: GenericKeyedObject = {};
    Object.keys(layout.trailer_arquivo).forEach(key=>{
        const field = layout.trailer_arquivo[key] as CNABField;
        trailerObject[key] = trailer_arquivo.slice(field.pos[0]-1,field.pos[1])
    });
    //End Trailer Parse

    result["header_arquivo"] = headerObj;
    result["trailer_arquivo"] = trailerObject;
    result["detalhes"] = detalhesObjectArray;
    return result
};

/**
 * ARQUIVO RETORNO
 * @param {*} config
 * @param {*} cnabtype 
 * @param {*} retorno
 * @param {*} parser
 */
const parseRetornoCnab = <T,D> (config: CnabConfig<T,D>,retorno: string, cnabtype = 400,parser = defaultCNAB400Parser) => {
    console.log(`Configuração carregada: {
                Layout: ${config.layout}
                Servico: ${config.servico}
                Versao: ${config.versao}}`);
    if(!config.retorno){
        throw new Error("Essa configuração de CNAB não tem remessa")
    }
    const array_retorno = retorno.split(CNAB_EOL);
    if(cnabtype==400) {
        const data: RetornoCNAB400 =  new class implements RetornoCNAB400 {
            detalhes = array_retorno.slice(1,array_retorno.length-1);
            header_arquivo = array_retorno[0];
            trailer_arquivo = array_retorno[array_retorno.length - 1];
        };
        return parser(config.retorno,data)
    } else {
        const data: RetornoCNAB240 =  new class implements RetornoCNAB240 {
            lotes: { [p: string]: Lote } = {};
            header_arquivo: any;
            trailer_arquivo: any;
        };
        let loteNum = 1;
        array_retorno.forEach(registro=>{
            if (registro[7] === '0') {//header_arquivo de arquivo
                data.header_arquivo = registro;
            } else if (registro[7] === '1') {//header de lote
                data.lotes[loteNum] = new class implements Lote {
                    detalhes: any[] = [];
                    header_lote = registro;
                    trailer_lote: any;
                };
            } else if (registro[7] === '3') {//detalhe ou segmento
                    data.lotes[loteNum].detalhes.push(registro);
                return;
            } else if (registro[7] === '5') {//trailer de lote
                    data.lotes[loteNum].trailer_lote = registro;
                    loteNum++
            } else if (registro[7] === '9') {//trailer_arquivo de arquivo
                data.trailer_arquivo = registro;
            }
        });

        return defaultCNAB240Parser(config.retorno,data)
    }
};

const jsonLayout = loadDefaultConfig(BANK.bradesco,240,"conciliacao_bancaria");
const result = parseRetornoCnab(jsonLayout!,fs.readFileSync("./test/CC1201H04.RET",'utf-8'),240);
console.log(JSON.stringify(result));

