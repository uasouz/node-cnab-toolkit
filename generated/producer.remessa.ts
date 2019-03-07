import {Header_arquivo,Header_lote,Trailer_lote, Trailer_arquivo,Segmento_p,
Segmento_q,
Segmento_r,
Segmento_s,
Segmento_y01,
Segmento_y50} from './interface.remessa'
type TipoDetalhes = Segmento_p|Segmento_q|Segmento_r|Segmento_s|Segmento_y01|Segmento_y50

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
        // const rx = /(?!\()(\d*)(?=\))/g;
        const fieldSize = (field.pos[1]-field.pos[0])+1//parseInt((field.picture.match(rx) || ['1'])[0]);
        if (lineData[key] != undefined ||lineData[key] != null) {
            lineDataString = lineDataString.slice(0, field.pos[0]-1) + stringFulfill(lineData[key].toString().slice(0, fieldSize),fieldSize) + lineDataString.slice(field.pos[1]-1, -1)
        } else {
            lineDataString = lineDataString.slice(0, field.pos[0]-1) + " ".repeat(fieldSize) + lineDataString.slice(field.pos[1]-1, -1)
        }
    });
    console.log("\nSIZE",lineDataString.length)
    return lineDataString + "\r\n"
};


const layout = {"header_arquivo":{"codigo_banco":{"pos":[1,3],"picture":"9(3)","default":237},"lote_servico":{"pos":[4,7],"picture":"9(4)","default":0},"tipo_registro":{"pos":[8,8],"picture":"9(1)","default":0},"exclusivo_febraban_01":{"pos":[9,17],"picture":"X(9)","default":""},"tipo_inscricao":{"pos":[18,18],"picture":"9(1)"},"numero_inscricao":{"pos":[19,32],"picture":"9(14)"},"codigo_convenio":{"pos":[33,52],"picture":"X(20)"},"agencia":{"pos":[53,57],"picture":"9(5)"},"verificador_agencia":{"pos":[58,58],"picture":"X(1)"},"conta":{"pos":[59,70],"picture":"9(12)"},"verificador_conta":{"pos":[71,71],"picture":"X(1)"},"verificador_agencia_conta":{"pos":[72,72],"picture":"X(1)","default":""},"nome_empresa":{"pos":[73,102],"picture":"X(30)"},"nome_banco":{"pos":[103,132],"picture":"X(30)","default":"BANCO BRADESCO S.A."},"exclusivo_febraban_02":{"pos":[133,142],"picture":"X(10)","default":""},"codigo_remessa_retorno":{"pos":[143,143],"picture":"9(1)"},"data_geracao":{"pos":[144,151],"picture":"9(8)"},"hora_geracao":{"pos":[152,157],"picture":"9(6)"},"numero_sequencial":{"pos":[158,163],"picture":"9(6)"},"versao_layout":{"pos":[164,166],"picture":"9(3)","default":84},"densidade_gravacao":{"pos":[167,171],"picture":"9(5)","default":0},"reservado_banco_01":{"pos":[172,191],"picture":"X(20)","default":""},"reservado_empresa_01":{"pos":[192,211],"picture":"X(20)","default":""},"exclusivo_febraban_03":{"pos":[212,240],"picture":"X(29)","default":""}},"trailer_arquivo":{"codigo_banco":{"pos":[1,3],"picture":"9(3)","default":237},"lote_servico":{"pos":[4,7],"picture":"9(4)","default":"9999"},"tipo_registro":{"pos":[8,8],"picture":"9(1)","default":9},"exclusivo_febraban_01":{"pos":[9,17],"picture":"X(9)","default":""},"quantidade_lotes":{"pos":[18,23],"picture":"9(6)"},"quantidade_registros":{"pos":[24,29],"picture":"9(6)"},"quantidade_contas":{"pos":[30,35],"picture":"9(6)"},"exclusivo_febraban_02":{"pos":[36,240],"picture":"X(205)","default":""}},"header_lote":{"codigo_banco":{"pos":[1,3],"picture":"9(3)","default":237},"lote_servico":{"pos":[4,7],"picture":"9(4)"},"tipo_registro":{"pos":[8,8],"picture":"9(1)","default":1},"tipo_operacao":{"pos":[9,9],"picture":"X(1)"},"tipo_servico":{"pos":[10,11],"picture":"9(2)","default":1},"exclusivo_febraban_01":{"pos":[12,13],"picture":"X(2)","default":""},"versao_layout":{"pos":[14,16],"picture":"9(3)","default":42},"exclusivo_febraban_02":{"pos":[17,17],"picture":"X(1)","default":""},"tipo_inscricao":{"pos":[18,18],"picture":"9(1)"},"numero_inscricao":{"pos":[19,33],"picture":"9(15)"},"codigo_convenio":{"pos":[34,53],"picture":"X(20)"},"agencia":{"pos":[54,58],"picture":"9(5)"},"verificador_agencia":{"pos":[59,59],"picture":"X(1)"},"conta":{"pos":[60,71],"picture":"9(12)"},"verificador_conta":{"pos":[72,72],"picture":"X(1)"},"verificador_agencia_conta":{"pos":[73,73],"picture":"X(1)"},"nome_empresa":{"pos":[74,103],"picture":"X(30)","default":""},"mensagem_01":{"pos":[104,143],"picture":"X(40)","default":""},"mensagem_02":{"pos":[144,183],"picture":"X(40)","default":""},"numero_sequencial":{"pos":[184,191],"picture":"9(8)"},"data_gravacao":{"pos":[192,199],"picture":"9(8)"},"data_credito":{"pos":[200,207],"picture":"9(8)"},"exclusivo_febraban_03":{"pos":[208,240],"picture":"X(33)","default":""}},"trailer_lote":{"codigo_banco":{"pos":[1,3],"picture":"9(3)","default":237},"lote_servico":{"pos":[4,7],"picture":"9(4)"},"tipo_registro":{"pos":[8,8],"picture":"9(1)","default":5},"exclusivo_febraban_01":{"pos":[9,17],"picture":"X(9)","default":""},"quantidade_registros":{"pos":[18,23],"picture":"9(6)"},"quantidade_titulos_simples":{"pos":[24,29],"picture":"9(6)"},"valor_total_titulos_simples":{"pos":[30,46],"picture":"9(13)V9(2)","default":0},"quantidade_titulos_vinculada":{"pos":[47,52],"picture":"9(6)","default":0},"valor_total_titulos_vinculada":{"pos":[53,69],"picture":"9(13)V9(2)","default":0},"quantidade_titulos_caucionada":{"pos":[70,75],"picture":"9(6)","default":0},"valor_total_titulos_caucionada":{"pos":[76,92],"picture":"9(13)V9(2)","default":0},"quantidade_titulos_descontada":{"pos":[93,98],"picture":"9(6)","default":0},"valor_total_titulos_descontada":{"pos":[99,115],"picture":"9(13)V9(2)","default":0},"numero_aviso":{"pos":[116,123],"picture":"X(8)","default":""},"exclusivo_febraban_02":{"pos":[124,240],"picture":"X(117)","default":""}},"detalhes":{"segmento_p":{"codigo_banco":{"pos":[1,3],"picture":"9(3)","default":237},"lote_servico":{"pos":[4,7],"picture":"9(4)"},"tipo_registro":{"pos":[8,8],"picture":"9(1)","default":3},"numero_registro":{"pos":[9,13],"picture":"9(5)"},"codigo_segmento":{"pos":[14,14],"picture":"X(1)","default":"P"},"exclusivo_febraban_01":{"pos":[15,15],"picture":"X(1)","default":""},"codigo_movimento":{"pos":[16,17],"picture":"9(2)"},"agencia":{"pos":[18,22],"picture":"9(5)"},"verificador_agencia":{"pos":[23,23],"picture":"X(1)"},"conta":{"pos":[24,35],"picture":"9(12)"},"verificador_conta":{"pos":[36,36],"picture":"X(1)"},"verificador_agencia_conta":{"pos":[37,37],"picture":"X(1)","default":""},"identificacao_produto":{"pos":[38,40],"picture":"9(3)"},"zeros":{"pos":[41,45],"picture":"9(5)","default":0},"nosso_numero":{"pos":[46,56],"picture":"9(11)"},"digito_nosso_numero":{"pos":[57,57],"picture":"9(1)"},"codigo_carteira":{"pos":[58,58],"picture":"9(1)"},"forma_cadastramento_titulo":{"pos":[59,59],"picture":"9(1)"},"tipo_documento":{"pos":[60,60],"picture":"X(1)"},"identificacao_emissao":{"pos":[61,61],"picture":"9(1)"},"identificacao_distribuicao":{"pos":[62,62],"picture":"X(1)"},"numero_documento":{"pos":[63,77],"picture":"X(15)"},"vencimento":{"pos":[78,85],"picture":"9(8)"},"valor":{"pos":[86,100],"picture":"9(13)V9(2)"},"agencia_cobradora":{"pos":[101,105],"picture":"9(5)"},"verificador_agencia_cobradora":{"pos":[106,106],"picture":"X(1)"},"especie":{"pos":[107,108],"picture":"9(2)"},"aceite":{"pos":[109,109],"picture":"X(1)","default":"N"},"data_emissao":{"pos":[110,117],"picture":"9(8)"},"codigo_juros":{"pos":[118,118],"picture":"9(1)"},"data_juros_mora":{"pos":[119,126],"picture":"9(8)"},"juros_mora":{"pos":[127,141],"picture":"9(13)V9(2)"},"codigo_desconto_01":{"pos":[142,142],"picture":"9(1)"},"data_desconto_01":{"pos":[143,150],"picture":"9(8)"},"valor_desconto_01":{"pos":[151,165],"picture":"9(13)V9(2)","default":0},"valor_iof":{"pos":[166,180],"picture":"9(13)V9(2)"},"valor_abatimento":{"pos":[181,195],"picture":"9(13)V9(2)","default":0},"identificacao_titulo_empresa":{"pos":[196,220],"picture":"X(25)","default":""},"codigo_protesto":{"pos":[221,221],"picture":"9(1)"},"dias_protesto":{"pos":[222,223],"picture":"9(2)"},"codigo_baixa_devolucao":{"pos":[224,224],"picture":"9(1)"},"dias_baixa_devolucao":{"pos":[225,227],"picture":"X(3)"},"codigo_moeda":{"pos":[228,229],"picture":"9(2)","default":9},"numero_contrato":{"pos":[230,239],"picture":"9(10)"},"exclusivo_febraban_02":{"pos":[240,240],"picture":"X(1)","default":""}},"segmento_q":{"codigo_banco":{"pos":[1,3],"picture":"9(3)","default":237},"lote_servico":{"pos":[4,7],"picture":"9(4)"},"tipo_registro":{"pos":[8,8],"picture":"9(1)","default":3},"numero_registro":{"pos":[9,13],"picture":"9(5)"},"codigo_segmento":{"pos":[14,14],"picture":"X(1)","default":"Q"},"exclusivo_febraban_01":{"pos":[15,15],"picture":"X(1)","default":""},"codigo_movimento":{"pos":[16,17],"picture":"9(2)"},"tipo_inscricao_pagador":{"pos":[18,18],"picture":"9(1)"},"numero_inscricao_pagador":{"pos":[19,33],"picture":"9(15)"},"nome_pagador":{"pos":[34,73],"picture":"X(40)"},"endereco_pagador":{"pos":[74,113],"picture":"X(40)"},"bairro_pagador":{"pos":[114,128],"picture":"X(15)"},"cep_pagador":{"pos":[129,133],"picture":"9(5)"},"sufixo_cep_pagador":{"pos":[134,136],"picture":"9(3)"},"cidade_pagador":{"pos":[137,151],"picture":"X(15)"},"uf_pagador":{"pos":[152,153],"picture":"X(2)"},"tipo_inscricao_sacador":{"pos":[154,154],"picture":"9(1)"},"numero_inscricao_sacador":{"pos":[155,169],"picture":"9(15)"},"nome_sacador":{"pos":[170,209],"picture":"X(40)"},"codigo_banco_correspondente":{"pos":[210,212],"picture":"9(3)"},"nosso_numero_banco_correspondente":{"pos":[213,232],"picture":"X(20)"},"exclusivo_febraban_02":{"pos":[233,240],"picture":"X(8)","default":""}},"segmento_r":{"codigo_banco":{"pos":[1,3],"picture":"9(3)","default":237},"lote_servico":{"pos":[4,7],"picture":"9(4)"},"tipo_registro":{"pos":[8,8],"picture":"9(1)","default":3},"numero_registro":{"pos":[9,13],"picture":"9(5)"},"codigo_segmento":{"pos":[14,14],"picture":"X(1)","default":"R"},"exclusivo_febraban_01":{"pos":[15,15],"picture":"X(1)","default":""},"codigo_movimento":{"pos":[16,17],"picture":"9(2)"},"codigo_desconto_02":{"pos":[18,18],"picture":"9(1)","default":0},"data_desconto_02":{"pos":[19,26],"picture":"9(8)","default":0},"valor_desconto_02":{"pos":[27,41],"picture":"9(13)V9(2)","default":0},"codigo_desconto_03":{"pos":[42,42],"picture":"9(1)","default":0},"data_desconto_03":{"pos":[43,50],"picture":"9(8)","default":0},"valor_desconto_03":{"pos":[51,65],"picture":"9(13)V9(2)","default":0},"codigo_multa":{"pos":[66,66],"picture":"X(1)","default":""},"data_multa":{"pos":[67,74],"picture":"9(8)","default":0},"valor_multa":{"pos":[75,89],"picture":"9(13)V9(2)","default":0},"informacao_pagador":{"pos":[90,99],"picture":"X(10)","default":""},"mensagem_03":{"pos":[100,139],"picture":"X(40)","default":""},"mensagem_04":{"pos":[140,179],"picture":"X(40)","default":""},"exclusivo_febraban_02":{"pos":[180,199],"picture":"X(20)","default":""},"codigo_ocorrencia_pagador":{"pos":[200,207],"picture":"9(8)"},"codigo_banco_debito":{"pos":[208,210],"picture":"9(3)"},"codigo_agencia_debito":{"pos":[211,215],"picture":"9(5)"},"verificador_agencia_debito":{"pos":[216,216],"picture":"X(1)"},"conta_debito":{"pos":[217,228],"picture":"9(12)"},"verificador_conta_debito":{"pos":[229,229],"picture":"X(1)"},"verificador_agencia_conta_debito":{"pos":[230,230],"picture":"X(1)","default":""},"aviso_debito_automatico":{"pos":[231,231],"picture":"9(1)","default":0},"exclusivo_febraban_03":{"pos":[232,240],"picture":"X(9)","default":""}},"segmento_s":{"codigo_banco":{"pos":[1,3],"picture":"9(3)","default":237},"lote_servico":{"pos":[4,7],"picture":"9(4)"},"tipo_registro":{"pos":[8,8],"picture":"9(1)","default":3},"numero_registro":{"pos":[9,13],"picture":"9(5)"},"codigo_segmento":{"pos":[14,14],"picture":"X(1)","default":"S"},"exclusivo_febraban_01":{"pos":[15,15],"picture":"X(1)","default":""},"codigo_movimento":{"pos":[16,17],"picture":"9(2)"},"identificacao_impressao":{"pos":[18,18],"picture":"9(1)","default":0},"mensagem_05":{"pos":[19,58],"picture":"X(40)","default":""},"mensagem_06":{"pos":[59,98],"picture":"X(40)","default":""},"mensagem_07":{"pos":[99,138],"picture":"X(40)","default":""},"mensagem_08":{"pos":[139,178],"picture":"X(40)","default":""},"mensagem_09":{"pos":[179,218],"picture":"X(40)","default":""},"exclusivo_febraban_03":{"pos":[219,240],"picture":"X(22)","default":""}},"segmento_y01":{"codigo_banco":{"pos":[1,3],"picture":"9(3)","default":237},"lote_servico":{"pos":[4,7],"picture":"9(5)"},"tipo_registro":{"pos":[8,8],"picture":"9(1)","default":3},"numero_registro":{"pos":[9,13],"picture":"9(5)"},"codigo_segmento":{"pos":[14,14],"picture":"X(1)","default":"Y"},"exclusivo_febraban_01":{"pos":[15,15],"picture":"X(1)","default":""},"codigo_movimento":{"pos":[16,17],"picture":"9(2)"},"identificacao_registro":{"pos":[18,19],"picture":"9(2)","default":1},"tipo_inscricao":{"pos":[20,20],"picture":"9(1)"},"numero_inscricao":{"pos":[21,35],"picture":"9(15)"},"nome_sacador_avalista":{"pos":[36,75],"picture":"X(40)","default":""},"endereco":{"pos":[76,115],"picture":"X(40)","default":""},"bairro":{"pos":[116,130],"picture":"X(15)","default":""},"cep":{"pos":[131,135],"picture":"9(5)"},"sufixo_cep":{"pos":[136,138],"picture":"9(3)"},"cidade":{"pos":[139,153],"picture":"X(15)","default":""},"uf":{"pos":[154,155],"picture":"X(2)","default":""},"exclusivo_febraban_02":{"pos":[156,240],"picture":"X(85)","default":""}},"segmento_y50":{"codigo_banco":{"pos":[1,3],"picture":"9(3)","default":237},"lote_servico":{"pos":[4,7],"picture":"9(4)"},"tipo_registro":{"pos":[8,8],"picture":"9(1)","default":3},"numero_registro":{"pos":[9,13],"picture":"9(5)"},"codigo_segmento":{"pos":[14,14],"picture":"X(1)","default":"Y"},"exclusivo_febraban_01":{"pos":[15,15],"picture":"X(1)","default":""},"codigo_movimento":{"pos":[16,17],"picture":"9(2)"},"identificacao_registro":{"pos":[18,19],"picture":"9(2)","default":50},"agencia_mantenedora":{"pos":[20,24],"picture":"9(5)"},"verificador_agencia_mantenedora":{"pos":[25,25],"picture":"X(1)"},"numero_conta":{"pos":[26,37],"picture":"9(12)"},"verificador_conta":{"pos":[38,38],"picture":"X(1)"},"verificador_agencia_conta":{"pos":[39,39],"picture":"X(1)"},"identificacao_produto":{"pos":[40,42],"picture":"X(3)"},"zeros":{"pos":[43,47],"picture":"X(5)","default":"0"},"nosso_numero":{"pos":[48,58],"picture":"X(11)"},"digito_nosso_numero":{"pos":[59,59],"picture":"X(1)"},"codigo_calculo_rateio":{"pos":[60,60],"picture":"9(1)"},"tipo_valor":{"pos":[61,61],"picture":"9(1)"},"valor":{"pos":[62,76],"picture":"9(13)V9(2)"},"codigo_banco_credito_benef":{"pos":[77,79],"picture":"9(3)"},"codigo_agencia_credito_benef":{"pos":[80,84],"picture":"9(5)"},"digito_agencia_credito_benef":{"pos":[85,85],"picture":"X(1)"},"conta_credito_beneficiario":{"pos":[86,97],"picture":"9(12)"},"digito_conta_credito_benef":{"pos":[98,98],"picture":"X(1)"},"digito_agencia_conta_benef":{"pos":[99,99],"picture":"X(1)"},"nome_beneficiario":{"pos":[100,139],"picture":"X(40)"},"identificacao_parcela_rateio":{"pos":[140,145],"picture":"X(6)"},"qtde_dias_credito_benef":{"pos":[146,148],"picture":"9(3)"},"data_credito_beneficiario":{"pos":[149,156],"picture":"9(8)"},"identificacao_rejeicoes":{"pos":[157,166],"picture":"9(10)"},"exclusivo_febraban_02":{"pos":[167,240],"picture":"X(74)","default":""}}}} as LayoutCNAB240

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
