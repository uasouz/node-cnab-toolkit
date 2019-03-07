export function generateCnab400Producer<T>(headerInterface: string, segmentsInterfaces: string[], trailerInterface: string, layout: T) {

    let segmentsArrayCode = "";
    segmentsInterfaces.forEach(interfaceName=>{
        segmentsArrayCode += `\n    ${interfaceName.toLowerCase()} : ${interfaceName}[] = [];`
    });

    const producer = `import {${headerInterface},${trailerInterface},${segmentsInterfaces.join(',\n')}} from './interface.remessa'
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
        // const rx = /(?!\\()(\\d*)(?=\\))/g;
        const fieldSize = (field.pos[1]-field.pos[0])+1
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

export class Cnab400Producer {
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
        this.detalhes.forEach((detalhe)=>{
                remessa += assembleLine(layout.detalhes["segmento_"+detalhe.codigo_segmento], detalhe)
        });
        remessa+= assembleLine(layout.trailer_arquivo,this.trailer)
        console.log(remessa)
    }
}
`;
    return producer
}