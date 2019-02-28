import { gerarInterfaceLayout} from "../../src/generator";
import {loadDefaultConfig} from "../../src";
import {BANK} from "../../src/config";

const expect = require('chai').expect;

describe('Teste de geração de tipos em TypeScript', () => {
    let layoutConfig: import("../../src/interfaces").CnabConfig<{}, {}> | undefined;
    before(done => {
        layoutConfig = loadDefaultConfig(BANK.bradesco, 240, "cobranca");
        done()
    });

    it('Gerando interface', (done => {
        if(gerarInterfaceLayout(layoutConfig!)) {
            done()
        }
    }))
});