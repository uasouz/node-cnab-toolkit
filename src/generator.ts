import {CNAB240, CnabConfig, CNABField, GenericKeyedObject, LayoutCNAB240} from "./interfaces";

const jsonToGo = require('./json-to-go.js');
import {json2ts} from "json-ts/dist";
import * as fs from 'fs'

//GOLANG GENERATOR
export function generateGolangType(data: object, typename = data.constructor.name) {
    return jsonToGo(JSON.stringify(data), typename);
}

interface ParsedLayout {
    remessa: any,
    retorno: any
}


function generateCnab400Producer(headerInterface: string, segmentsInterfaces: string[], trailerInterface: string) {
    const producer = `
import {${headerInterface},${trailerInterface},${segmentsInterfaces.join(',')}} from './interface.remessa'
type TipoDetalhes = ${segmentsInterfaces.join('|')}

class Cnab400Producer {
detalhes: TipoDetalhes[] = [];
header: ${headerInterface};
trailer: ${trailerInterface};
constructor(
    header: ${headerInterface},
trailer: ${trailerInterface}){
    this.header = header;
    this.trailer = trailer;
}

addDetail = (detalhe: TipoDetalhes)=>{
    this.detalhes.push(detalhe)
};

gerarRemessa = ()=>{

}
}
`;
    return producer
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

const parseDataToLayout = (layout: any) => {
    const layoutObj: GenericKeyedObject = {};
    Object.keys(layout).forEach(key => {
        const field = layout[key] as CNABField;
        if (field.picture.match('9')) {
            layoutObj[key] = 0
        } else {
            layoutObj[key] = ""
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
                segmentosRemessa.push(capitalize(key))
                layoutResult['remessa'][key] = parseDataToLayout(detalhe)
            });
            layoutResult['remessa']['trailer_lote'] = parseDataToLayout(layout.remessa.trailer_lote);
            layoutResult['remessa']['trailer_arquivo'] = parseDataToLayout(layout.remessa.trailer_arquivo);
        }
        fs.writeFileSync("./generated/producer.remessa.ts",generateCnab400Producer('Header_arquivo', segmentosRemessa, 'Trailer_arquivo'));
        return layoutResult
    } else {

    }
    return {remessa: {}, retorno: {}}
}

export function gerarInterfaceLayout<T, D>(Layout: CnabConfig<T, D>): any {
    return generateTypeScriptInterface(parseLayout(Layout), Layout.servico)
}
