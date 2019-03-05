export function generateCnab240Producer<T>(headerInterface: string,loteHeaderInterface: string, segmentsInterfaces: string[], loteTrailerInterface:string, trailerInterface: string, layout: T) {

    let segmentsArrayCode = "";
    segmentsInterfaces.forEach(interfaceName=>{
        segmentsArrayCode += `\n    ${interfaceName.toLowerCase()} : ${interfaceName}[] = [];`
    });

    const producer = `import {${headerInterface},${loteHeaderInterface},${loteTrailerInterface}, ${trailerInterface},${segmentsInterfaces.join(',\n')}} from './interface.remessa'
type TipoDetalhes = ${segmentsInterfaces.join('|')}

export interface LayoutCNAB240{
    header_arquivo: CNABConfigObject;
    header_lote: CNABConfigObject;
    detalhes: {[key: string]: any};
    trailer_lote: CNABConfigObject;
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


const layout = ${JSON.stringify(layout)} as LayoutCNAB240

interface Lote {
    header_lote: Header_lote;
    trailer_lote: Trailer_lote;
    detalhes: TipoDetalhes[];
}

export class Cnab240Producer {
    lotes = new  Map< string,Lote>();
    detalhes: TipoDetalhes[] = [];
    header: Header_arquivo;
    trailer: Trailer_arquivo;

    constructor(
        header: Header_arquivo,
        trailer: Trailer_arquivo) {
        this.header = header;
        this.trailer = trailer;
    }
    
    addLote = (codigoLote: string,header_lote: Header_lote,trailer_lote: Trailer_lote,detalhes: TipoDetalhes[]=[]) =>{
        const lote = this.lotes.get(codigoLote)
        if (!lote) {
            const novoLote = new class implements Lote {
                header_lote = header_lote;
                trailer_lote  =trailer_lote;
                detalhes= detalhes
            };
            this.lotes.set(codigoLote,novoLote)
        }
    }

    addDetail = (codigoLote:string, detalhe: TipoDetalhes) => {
        const lote = this.lotes.get(codigoLote)
        if (lote) {
            lote.detalhes.push(detalhe)
            this.lotes.set(codigoLote, lote)
        }
    };

    gerarRemessa = () => {
        let remessa = assembleLine(layout.header_arquivo,this.header)
        this.lotes.forEach(lote=> {
             remessa += assembleLine(layout.header_lote, lote.header_lote)
             lote.detalhes.forEach((detalhe) => {
                remessa += assembleLine(layout.detalhes["segmento_" + detalhe.codigo_segmento], detalhe)
             });
             remessa += assembleLine(layout.trailer_lote, lote.trailer_lote)
        })
        remessa+= assembleLine(layout.trailer_arquivo,this.trailer)
        console.log(remessa)
    }
}
`;
    return producer
}