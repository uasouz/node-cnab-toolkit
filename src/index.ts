import {loadDefaultConfig} from './utils';

import { CNAB_EOL} from "./config";
import {
    CnabConfig,
    GenericKeyedObject,
    LayoutCNAB240,
    LayoutCNAB400,
    Lote, CNAB240,
    CNAB400
} from "./interfaces";

const parseDataToLayout = (layout: any,header: string) =>{
    const headerObj: GenericKeyedObject = {};
    Object.keys(layout).forEach(key=>{
        const field = layout[key];
        headerObj[key] = header.slice(field.pos[0]-1,field.pos[1])
    });
    return headerObj
};

const defaultCNAB240Parser = (layout: LayoutCNAB240,parameters: CNAB240) =>{
    let {header_arquivo, lotes, trailer_arquivo} = parameters;
    const result: GenericKeyedObject = {};
    //Header Parse
    const headerObj: GenericKeyedObject = {};
    Object.keys(layout.header_arquivo).forEach(key=>{
        const field = layout.header_arquivo[key];
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
                const field = segmento[key];
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
        const field = layout.trailer_arquivo[key];
        trailerObject[key] = trailer_arquivo.slice(field.pos[0]-1,field.pos[1])
    });
    //End Trailer Parse

    result["header_arquivo"] = headerObj;
    result["trailer_arquivo"] = trailerObject;
    result["lotes"] = lotesObject;
    return result
};

const defaultCNAB400Parser = (layout: LayoutCNAB400,parameters: CNAB400) =>{
    let {header_arquivo, detalhes, trailer_arquivo} = parameters;
    const result: GenericKeyedObject = {};
    //Header Parse
    const headerObj: GenericKeyedObject = {};
        Object.keys(layout.header_arquivo).forEach(key=>{
            const field = layout.header_arquivo[key];
            headerObj[key] = header_arquivo.slice(field.pos[0]-1,field.pos[1])
        });
    //End Header Parse

    //Details parse
    const detalhesObjectArray: GenericKeyedObject[] = [];
    const segmentos = layout.detalhes;
    detalhes.forEach((detalhe)=>{
        const detalhesObject: GenericKeyedObject = {};
        console.log(detalhe,detalhe.slice(0,1),Object.keys(segmentos));
        const segmento = segmentos["segmento_"+detalhe.slice(0,1)];
        Object.keys(segmento).forEach(key=> {
            const field = segmento[key];
            detalhesObject[key] = detalhe.slice(field.pos[0] - 1, field.pos[1])
        });
        detalhesObjectArray.push(detalhesObject)
    });
    //End Details parse

    //Trailer Parse
    const trailerObject: GenericKeyedObject = {};
    Object.keys(layout.trailer_arquivo).forEach(key=>{
        const field = layout.trailer_arquivo[key];
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
    const array_retorno = retorno.split(CNAB_EOL).filter((item)=>{return item != ''});
    if(cnabtype==400) {
        const data: CNAB400 =  new class implements CNAB400 {
            detalhes = array_retorno.slice(1,array_retorno.length-1);
            header_arquivo = array_retorno[0];
            trailer_arquivo = array_retorno[array_retorno.length - 1];
        };
        return parser(config.retorno,data)
    } else {
        const data: CNAB240 =  new class implements CNAB240 {
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

export {loadDefaultConfig,parseRetornoCnab}
