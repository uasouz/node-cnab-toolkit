import { CnabConfig, CNABConfigObject,  GenericKeyedObject, LayoutCNAB240} from "./interfaces";

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


function generateCnab400Producer<T>(headerInterface: string, segmentsInterfaces: string[], trailerInterface: string, layout: T) {

    let segmentsArrayCode = "";
    segmentsInterfaces.forEach(interfaceName=>{
        segmentsArrayCode += `\n    ${interfaceName.toLowerCase()} : ${interfaceName}[] = [];`
    });

    const producer = `
import {${headerInterface},${trailerInterface},${segmentsInterfaces.join(',\n')}} from './interface.remessa'
type TipoDetalhes = ${segmentsInterfaces.join('|')}

export interface LayoutCNAB400{
    header_arquivo: CNABConfigObject;
    detalhes: {[key: string]: any};
    trailer_arquivo: CNABConfigObject;
}

export interface CNABConfigObject{
    [key: string]: CNABField
}

export interface CNABField{
    pos: number[];
    picture: string;
    default?: string | number
}

//0 direita | 1 esquerda
const stringFulfill = (value:string,expectedSize: number,alignment=1)=>{
  const offset = expectedSize - value.length;
    if(offset>0){
        if(alignment==0){
            return " ".repeat(offset) + value
        } else {
            return value + " ".repeat(offset)
        }
    }
    return value
};

const assembleLine = (layout: CNABConfigObject, lineData: any) => {
    let lineDataString = " ".repeat(400);
    Object.keys(layout).forEach(key => {
        const field = layout[key];
        const rx = /(?!\\()(\\d*)(?=\\))/g;
        const fieldSize = parseInt((field.picture.match(rx) || ['1'])[0]);
        if (lineData[key]) {
            lineDataString = lineDataString.slice(0, field.pos[0]-1) + stringFulfill(lineData[key].toString().slice(0, fieldSize),fieldSize) + lineDataString.slice(field.pos[1]-1, -1)
        } else {
            lineDataString = lineDataString.slice(0, field.pos[0]-1) + " ".repeat(fieldSize) + lineDataString.slice(field.pos[1]-1, -1)
        }
    });
    console.log("\\nSIZE",lineDataString.length)
    return lineDataString + "\\r\\n"
};


const layout = ${JSON.stringify(layout)} as LayoutCNAB400

export class Cnab400Producer {\n`+ segmentsArrayCode+

    `
    detalhes: TipoDetalhes[] = [];
    header: Header_arquivo;
    trailer: Trailer_arquivo;

    constructor(
        header: Header_arquivo,
        trailer: Trailer_arquivo) {
        this.header = header;
        this.trailer = trailer;
    }

    addDetail = (detalhe: TipoDetalhes) => {
        this.detalhes.push(detalhe)
    };

    gerarRemessa = () => {
        let remessa = assembleLine(layout.header_arquivo,this.header)
        remessa+= assembleLine(layout.trailer_arquivo,this.trailer)
        console.log(remessa)
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
        fs.writeFileSync("./generated/producer.remessa.ts",generateCnab400Producer('Header_arquivo', segmentosRemessa, 'Trailer_arquivo',layout.remessa));
        return layoutResult
    } else {

    }
    return {remessa: {}, retorno: {}}
}

export function gerarInterfaceLayout<T, D>(Layout: CnabConfig<T, D>): any {
    return generateTypeScriptInterface(parseLayout(Layout), Layout.servico)
}
