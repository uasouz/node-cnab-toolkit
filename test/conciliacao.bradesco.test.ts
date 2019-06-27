import {loadDefaultConfig, parseRetornoCnab} from "../src";
import {BANK} from "../src/config";
import * as fs from "fs";
import {CnabConfig} from "../src/interfaces";
const expect = require('chai').expect;

describe('Teste de conciliacao bancária Bradesco - CNAB240 - versao 05', ()=>{
    let layoutConfig: CnabConfig<{}, {}> | null | undefined;
    it('Teste de carregamento de configuração padrão',(done)=>{
        layoutConfig = loadDefaultConfig(BANK.bradesco,240,"conciliacao_bancaria_05");
        done()
    });

    it('Teste de parse de retorno da conciliacao bancária do Bradesco',(done => {
        const result = parseRetornoCnab(layoutConfig!,fs.readFileSync("./test/retornos/bradesco/conciliacao/CC1201H04.RET",'utf-8'),240);
        expect(result).to.be.an('object');
        expect(result.header_arquivo.codigo_banco).to.be.a('string').that.is.eq('237');
        expect(result.lotes['1'].detalhes).to.be.an('array').and.that.is.not.empty;
        done()
    }))
});