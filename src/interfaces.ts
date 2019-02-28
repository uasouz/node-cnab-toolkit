export interface DataType {
    cnab240?: any;
    cnab400?: any;
}

export interface LayoutCNAB400{
    header_arquivo: any;
    detalhes: any[];
    trailer_arquivo: any;
}

export interface CNAB400 {
    header_arquivo: string;
    detalhes: string[];
    trailer_arquivo: string;
}

export interface Lote {
    header_lote: string;
    detalhes: string[];
    trailer_lote: string;
}

export interface CNAB240 {
    header_arquivo: string;
    lotes: {[key:string] : Lote};
    trailer_arquivo: string;
}

export interface LayoutCNAB240 {
    header_arquivo: any;
    header_lote: any;
    detalhes: GenericKeyedObject;
    trailer_lote: any;
    trailer_arquivo: any;
}

export interface CNABField{
    pos: number[];
    picture: string;
    default?: string | number
}

export interface BankConfig {
    name: string;
    code: string;
    layouts: {
        yaml: DataType,
        json: DataType
    };
}

export interface GenericKeyedObject {
    [key: string]: any
}

export interface Banks {
    [key: string]: BankConfig
}

export interface CnabConfig<T,D> {
    servico: string;
    versao: string;
    layout: string;
    remessa: T | any
    retorno: D | any
}
