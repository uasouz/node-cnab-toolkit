import {loadDefaultConfig, parseRetornoCnab} from "../src";
import {BANK} from "../src/config";
import * as fs from "fs";
import {CnabConfig} from "../src/interfaces";
const expect = require('chai').expect;

describe('Teste de cobranca Itau - CNAB400', ()=>{
    let layoutConfig: CnabConfig<{}, {}> | null | undefined;
    it('Teste de carregamento de configuração padrão',(done)=>{
        layoutConfig = loadDefaultConfig(BANK.itau,400,"cobranca");
        done()
    });

    it('Teste de parse de retorno da conciliacao bancária do Itau',(done => {
        const result = parseRetornoCnab(layoutConfig!,fs.readFileSync("./test/retornos/itau/cobranca/T00129.00T",'utf-8'),400);
        console.log(result);
        expect(result).to.be.an('object');
        expect(result.header_arquivo.codigo_banco).to.be.a('string').that.is.eq('341');
        // expect(result.lotes['1'].detalhes).to.be.an('array').and.that.is.not.empty;
        done()
    }))
});