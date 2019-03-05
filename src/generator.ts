import {CnabConfig, CNABConfigObject, GenericKeyedObject, LayoutCNAB240, LayoutCNAB400} from "./interfaces";

const jsonToGo = require('./json-to-go.js');
import {json2ts} from "json-ts/dist";
import * as fs from 'fs'
import {generateCnab400Producer} from "./generator.400";
import {generateCnab240Producer} from "./generator.240";

//GOLANG GENERATOR
export function generateGolangType(data: object, typename = data.constructor.name) {
    return jsonToGo(JSON.stringify(data), typename);
}

interface ParsedLayout {
    remessa: any,
    retorno: any
}

//TYPESCRIPT INTERFACE GENERATOR - Usando json2ts como paleativo
function generateTypeScriptInterface(Data: ParsedLayout, name: string,): Boolean {
    const RemessaExports: string[] = [];
    Object.keys(Data.remessa).forEach(key=>{
        RemessaExports.push(capitalize(key))
    });
    const interfaceRemessaString = json2ts(JSON.stringify(Data.remessa), {rootName: "remessa_" + name, prefix: ""});
    fs.writeFileSync("./generated/interface.remessa.ts", interfaceRemessaString +"\n\n" + 'export {'+RemessaExports.join(',')+'}');

    const RetornoExports: string[] = [];
    Object.keys(Data.retorno).forEach(key=>{
        RetornoExports.push(capitalize(key))
    });
    const interfaceRetornoString = json2ts(JSON.stringify(Data.retorno), {rootName: 'retorno_' + name, prefix: ""});
    fs.writeFileSync("./generated/interface.retorno.ts", interfaceRetornoString+"\n\n" + 'export {'+RetornoExports.join(',')+'}');
    return true
}

const parseDataToLayout = (layout: CNABConfigObject) => {
    const layoutObj: GenericKeyedObject = {};
    Object.keys(layout).forEach(key => {
        const field = layout[key];
        const rx = /(?!\()(\d*)(?=\))/g;
        const fieldSize = parseInt((field.picture.match(rx)||['1'])[0]);
        if (field.picture.match('X')) {
            layoutObj[key] = " "
        } else {
            layoutObj[key] = 0
        }
    });
    return layoutObj
};


const capitalize = function(value: string) {
    return value.charAt(0).toUpperCase() + value.slice(1);
};

function parseLayout(Layout: CnabConfig<any, any>): ParsedLayout {
    const layoutResult: ParsedLayout = {remessa: {}, retorno: {}};
    if (Layout.layout == 'cnab240') {
        const layout = Layout as CnabConfig<LayoutCNAB240, LayoutCNAB240>;
        const segmentosRemessa: string[] = [];
        if (layout.retorno) {
            layoutResult['retorno']['header_arquivo'] = parseDataToLayout(layout.retorno.header_arquivo);
            layoutResult['retorno']['header_lote'] = parseDataToLayout(layout.retorno.header_lote);
            Object.keys(layout.retorno.detalhes).forEach((key) => {
                const detalhe = layout.retorno.detalhes[key];
                layoutResult['retorno'][key] = parseDataToLayout(detalhe)
            });
            layoutResult['retorno']['trailer_lote'] = parseDataToLayout(layout.retorno.trailer_lote);
            layoutResult['retorno']['trailer_arquivo'] = parseDataToLayout(layout.retorno.trailer_arquivo);
        }
        if (layout.remessa) {
            layoutResult['remessa']['header_arquivo'] = parseDataToLayout(layout.remessa.header_arquivo);
            layoutResult['remessa']['header_lote'] = parseDataToLayout(layout.remessa.header_lote);
            Object.keys(layout.remessa.detalhes).forEach((key:string) => {
                const detalhe = layout.remessa.detalhes[key];
                segmentosRemessa.push(capitalize(key));
                layoutResult['remessa'][key] = parseDataToLayout(detalhe)
            });
            layoutResult['remessa']['trailer_lote'] = parseDataToLayout(layout.remessa.trailer_lote);
            layoutResult['remessa']['trailer_arquivo'] = parseDataToLayout(layout.remessa.trailer_arquivo);
        }
        fs.writeFileSync("./generated/producer.remessa.ts",generateCnab240Producer('Header_arquivo','Header_lote' ,segmentosRemessa, 'Trailer_lote','Trailer_arquivo',layout.remessa));
        return layoutResult
    } else {
        const layout = Layout as CnabConfig<LayoutCNAB400, LayoutCNAB400>;
        const segmentosRemessa: string[] = [];
        if (layout.retorno) {
            layoutResult['retorno']['header_arquivo'] = parseDataToLayout(layout.retorno.header_arquivo);
            Object.keys(layout.retorno.detalhes).forEach((key) => {
                const detalhe = layout.retorno.detalhes[key];
                layoutResult['retorno'][key] = parseDataToLayout(detalhe)
            });
            layoutResult['retorno']['trailer_arquivo'] = parseDataToLayout(layout.retorno.trailer_arquivo);
        }
        if (layout.remessa) {
            layoutResult['remessa']['header_arquivo'] = parseDataToLayout(layout.remessa.header_arquivo);
            Object.keys(layout.remessa.detalhes).forEach((key:string) => {
                const detalhe = layout.remessa.detalhes[key];
                segmentosRemessa.push(capitalize(key));
                layoutResult['remessa'][key] = parseDataToLayout(detalhe)
            });
            layoutResult['remessa']['trailer_arquivo'] = parseDataToLayout(layout.remessa.trailer_arquivo);
        }
        fs.writeFileSync("./generated/producer.remessa.ts",generateCnab400Producer('Header_arquivo', segmentosRemessa, 'Trailer_arquivo',layout.remessa));
        return layoutResult
    }
}

export function gerarInterfaceLayout<T, D>(Layout: CnabConfig<T, D>): any {
    return generateTypeScriptInterface(parseLayout(Layout), Layout.servico)
}
