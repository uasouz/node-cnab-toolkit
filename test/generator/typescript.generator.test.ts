import { gerarInterfaceLayout} from "../../src/generator";
import {loadDefaultConfig, parseRetornoCnab} from "../../src";
import {BANK} from "../../src/config";
import {Header_arquivo, Trailer_arquivo} from "../../generated/interface.remessa";

const expect = require('chai').expect;

describe('Teste de geração de tipos em TypeScript', () => {
    let layoutConfig: import("../../src/interfaces").CnabConfig<{}, {}> | undefined;
    before(done => {
        layoutConfig = loadDefaultConfig(BANK.bradesco, 240, "cobranca");
        done()
    });

    it('Gerando interface', (done => {
        if(gerarInterfaceLayout(layoutConfig!)) {
            const Cnab400Producer = require('../../generated/producer.remessa').Cnab400Producer;
            const header  = new class implements Header_arquivo {
                agencia = 1999;
                codigo_banco = 237;
                codigo_convenio = "1";
                codigo_remessa_retorno = 2;
                conta = 1270397;
                data_geracao = 20032019;
                densidade_gravacao= 4;
                exclusivo_febraban_01 = "exclusivo 1";
                exclusivo_febraban_02 = "exclusivo 2";
                exclusivo_febraban_03 = "exclusivo 3";
                hora_geracao  = 18;
                lote_servico = 1;
                nome_banco =  "BRADESCO SA";
                nome_empresa =  "NUCASH SIMPLIFICANDO PAGAMENTOS";
                numero_inscricao = 1986;
                numero_sequencial = 327;
                reservado_banco_01 = "";
                reservado_empresa_01 = "nuca";
                tipo_inscricao =0;
                tipo_registro = 21;
                verificador_agencia = 'X';
                verificador_agencia_conta = "X";
                verificador_conta = 'X';
                versao_layout = 2;

            };
            const trailer = new class implements Trailer_arquivo {
                codigo_banco = 237;
                exclusivo_febraban_01 = "";
                exclusivo_febraban_02 = "";
                lote_servico = 1;
                quantidade_contas = 0;
                quantidade_lotes = 0;
                quantidade_registros= 0;
                tipo_registro = 1;
            };
            const producer = new Cnab400Producer(header,trailer);
            producer.gerarRemessa();
            done()
        }
    }))
});