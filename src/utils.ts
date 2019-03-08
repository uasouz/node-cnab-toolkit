import {BankConfig, CnabConfig} from "./interfaces";

import * as yaml from "js-yaml";

import * as fs from 'fs';

import * as path from 'path'

const readYaml = (filename: string) => {
    try {
        if (!fs.existsSync(path.resolve(filename))) {
            console.error("Arquivo inacessível ou inexistente");
            return null
        }
        return yaml.safeLoad(fs.readFileSync(path.resolve(filename), `utf8`));
    } catch (e) {
        console.log(e);
        return null;
    }
};

const makeFilesLayout = (files: Array<any>, bankCode: string, cnabCode: number) => {
    const filesLayout = {};
    files.map(f => {
        // @ts-ignore
        filesLayout[f] = JSON.parse(fs.readFileSync(`test/data/cnab${cnabCode}/${bankCode}/${f}.json`, 'utf8'));
    });
    return filesLayout;
};

const loadDefaultConfig = (bank: BankConfig, cnabCode: number, version: string, type = 'yaml') => {
    const cnab = cnabCode == 240 ? "cnab240" : "cnab400";
    if (type == 'yaml') {
        return loadLayoutFromYamlFile(`./src/cnab_data/${type}/${bank.name}/${cnab}/${bank.layouts.yaml[cnab][version]}`)
    } else if (type == "json") {
        return loadLayoutFromJsonFile(`./src/cnab_data/${type}/${bank.name}/${cnab}/${bank.layouts.json[cnab][version]}`)
    }
};

const loadLayoutFromYamlFile = <T, D>(filename: string) => {
    console.log("Loading YAML: " + path.resolve(filename));
    const data = readYaml(filename);
    if (data) {
        return data as CnabConfig<T, D>;
    }
    return null
};

const loadLayoutFromYamlData = <T, D>(data: string) => {
    try {
        return yaml.safeLoad(data) as CnabConfig<T, D>;
    } catch (e) {
        console.log(e);
        return null;
    }
};

const loadLayoutFromJsonFile = <T, D>(filename: string) => JSON.parse(fs.readFileSync(filename, 'utf8')) as CnabConfig<T, D>;


const loadLayoutFromJsonData = <T, D>(data: string) => JSON.parse(data) as CnabConfig<T, D>;

export {
    readYaml,
    makeFilesLayout,
    loadDefaultConfig,
    loadLayoutFromYamlFile,
    loadLayoutFromJsonData,
    loadLayoutFromJsonFile,
    loadLayoutFromYamlData
}