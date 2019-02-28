const jsonToGo = require('./json-to-go.js');
import {json2ts} from "json-ts/dist";
import * as fs from 'fs'

//GOLANG GENERATOR
export function generateGolangType(data: object,typename = data.constructor.name){
    return jsonToGo(JSON.stringify(data),typename);
}


//TYPESCRIPT INTERFACE GENERATOR - Usando json2ts como paleativo
export function generateTypeScriptInterface(Data: any) : Boolean {
    const interfaceString = json2ts(JSON.stringify(Data));
    fs.writeFileSync("./generated/interface.ts", interfaceString);
    return true
}

