import {generateTypeScriptInterface} from "../../src/generator";
import {loadDefaultConfig, parseRetornoCnab} from "../../src";
import {BANK} from "../../src/config";
import * as fs from 'fs'

const expect = require('chai').expect;

describe('Teste de geração de tipos em TypeScript', () => {
    let layoutConfig: import("../../src/interfaces").CnabConfig<{}, {}> | undefined;
    let CnabObj: import("../../src/interfaces").GenericKeyedObject;
    before(done => {

        layoutConfig = loadDefaultConfig(BANK.bradesco, 240, "conciliacao_bancaria_05");
        CnabObj = parseRetornoCnab(layoutConfig!, fs.readFileSync("./test/retornos/bradesco/conciliacao/CC1201H04.RET", 'utf-8'), 240);
        done()
    });

    it('Gerando interface', (done => {
        if(generateTypeScriptInterface(CnabObj)) {
            done()
        }
    }))
});