import { gerarInterfaceLayout} from "../../src/generator";
import {loadDefaultConfig, parseRetornoCnab} from "../../src";
import {BANK} from "../../src/config";
// @ts-ignore
import {
    Header_arquivo,
    Header_lote,
    Segmento_p,
    Segmento_s,
    Trailer_arquivo,
    Trailer_lote
} from "../../generated/interface.remessa";

const expect = require('chai').expect;

describe('Teste de geração de tipos em TypeScript', () => {
    let layoutConfig240: import("../../src/interfaces").CnabConfig<{}, {}> | undefined;
    let layoutConfig400: import("../../src/interfaces").CnabConfig<{}, {}> | undefined;
    before(done => {
        layoutConfig240 = loadDefaultConfig(BANK.bradesco, 240, "cobranca");
        // layoutConfig400 = loadDefaultConfig(BANK.bradesco, 400, "cobranca");
        done()
    });

    it('Gerando interface', (done => {
        if(gerarInterfaceLayout(layoutConfig240!)) {
            const Cnab240Producer = require('../../generated/producer.remessa').Cnab240Producer;
            const header  = new class implements Header_arquivo {
                agencia = 1999;
                codigo_banco = 237;
                codigo_convenio = "codigoconv";
                codigo_remessa_retorno = 2;
                conta = 1270397;
                data_geracao = 20032019;
                densidade_gravacao= 4;
                exclusivo_febraban_01 = "exclusivo 1";
                exclusivo_febraban_02 = "exclusivo 2";
                exclusivo_febraban_03 = "exclusivo 3";
                hora_geracao  = 18;
                lote_servico = 1073;
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
            //Talvez seja melhor gerar classes ao inves de interfaces,ou gera-las tambem para facilitar o uso
            const detalhe = new class implements Segmento_s {
                codigo_banco = 237;
                codigo_movimento = 1;
                codigo_segmento = "s";
                exclusivo_febraban_01 = "exc1";
                exclusivo_febraban_03 = "exc3";
                identificacao_impressao = 423;
                lote_servico = 14;
                mensagem_05 = "Tentando";
                mensagem_06 = "Inserir";
                mensagem_07 = "Detalhe";
                mensagem_08 = "para";
                mensagem_09 = "Cobranca";
                numero_registro = 123;
                tipo_registro = 1;

            };
            const producer = new Cnab240Producer(header,trailer);
            const header_lote = new class implements Header_lote{
                agencia = 1999;
                codigo_banco = 237;
                codigo_convenio = "codigoconv";
                conta = 1270397;
                data_geracao = 20032019;
                densidade_gravacao= 4;
                exclusivo_febraban_01 = "exclusivo 1";
                exclusivo_febraban_02 = "exclusivo 2";
                exclusivo_febraban_03 = "exclusivo 3";

                data_credito = 20032019;
                data_gravacao = 20032019;
                lote_servico = 1;
                mensagem_01 = "primeiro";
                mensagem_02 = "lote";
                nome_empresa = "HADARA S.A.";
                numero_inscricao = 1998;
                numero_sequencial = 1;
                tipo_inscricao = 2;
                tipo_operacao = "8888";
                tipo_registro = 1;
                tipo_servico = 4;
                verificador_agencia = "8";
                verificador_agencia_conta = "9";
                verificador_conta = "X";
                versao_layout = 1;

            };
            const trailer_lote = new class implements Trailer_lote {
                codigo_banco = 237;
                exclusivo_febraban_01 = "exc1";
                exclusivo_febraban_02 = "ex2";
                lote_servico = 1;
                numero_aviso = "aviso";
                quantidade_registros = 1;
                quantidade_titulos_caucionada = 0;
                quantidade_titulos_descontada = 0;
                quantidade_titulos_simples = 0;
                quantidade_titulos_vinculada = 0;
                tipo_registro = 1;
                valor_total_titulos_caucionada = 0;
                valor_total_titulos_descontada = 0;
                valor_total_titulos_simples = 0;
                valor_total_titulos_vinculada = 0;

            };
            producer.addLote("001",header_lote,trailer_lote);
            producer.addDetail("001",detalhe);
            producer.gerarRemessa();
            done()
        }
    }))
});