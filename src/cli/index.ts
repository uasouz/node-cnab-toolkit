#! /usr/bin/env node

import * as program from 'commander'
import {gerarInterfaceLayout} from "../generator";
import {loadDefaultConfig, loadLayoutFromYamlFile} from "../utils";
import {BANK} from "../config";

program.version("0.0.1", '-v,--version')
    .option("gen", "generate");

program.command("generate <type> <mode> [details...]")
    .alias("gen")
    // .option("-l,--layout <filepath>", "Gerar usando arquivo")
    .option("-o,--output <output>", "Diretorio de destino")
    // .option("-d,--default [details]")
    .action((type,mode,details, options) => {
        if (!type) {
            console.log("Tipo não especificado ou inválidor. Deve ser: producer ou reader");
            return
        }
        // let mode = options.layout ? "file" : "default";
        let outputPath = options.output;
        if (mode == "default") {
            console.log(details);
            if(details.length<3){
                console.log("Argumentos insuficientes. Esperado: codigo_do_banco tipo_cnab servico_bancario");
                return
            }
            let bankData: any = null;
            Object.values(BANK).forEach((value)=>{
               if(value.code==details[0]){
                   bankData = value
               }
            });
            if(!bankData){
                console.log("Dados de banco não disponível ou código do banco inválido");
                return
            }
            let layoutConfig = loadDefaultConfig(bankData, details[1], details[2]);
            if (layoutConfig && gerarInterfaceLayout(layoutConfig!, outputPath)) {
                console.log("Arquivos gerados com sucesso")
            } else {
                console.log("Falha ao gerar arquivos")
            }
        } else if (mode == "file") {
            console.log(details);
            let layout = details[0];
            let layoutConfig = loadLayoutFromYamlFile(layout);
            if (layoutConfig && gerarInterfaceLayout(layoutConfig!, outputPath)) {
                console.log("Arquivos gerados com sucesso")
            } else {
                console.log("Falha ao gerar arquivos")
            }
        }
    });

program.parse(process.argv);