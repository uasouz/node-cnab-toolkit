import {Banks} from "./interfaces";

export const CNAB_EOL = '\r\n';

export const BANK: Banks = {
    'bb': {
        name: 'bb',
        code: '001',
        layouts: {
            yaml: {
                cnab240: {
                    cobranca_087: 'cobranca.yml',
                    cobranca_por_email_087:
                        'cobranca_por_email.yml'
                }
                ,
                cnab400: {
                    cobranca_cbr641_7digitos: 'cobranca_convenio_7_digitos.yml'
                }
            },
            json: {
                cnab400: {
                    deposito_identificado_ied810: 'deposito_identificado_ied810.json'
                }
            }
        }
    },
    bradesco: {
        name:'bradesco',
        code: '237',
        layouts:{
            yaml:{
                cnab240:{
                    conciliacao_bancaria_05: 'conciliacao_bancaria_05.yml',
                    conciliacao_bancaria_04: 'conciliacao_bancaria_04.yml',
                    cobranca: 'cobranca.yml'
                },
                cnab400: {
                    cobranca: 'cobranca.yml'
                }
            },
            json: {

            }
        }
    },
    itau: {
        name:'itau',
        code: '341',
        layouts:{
            yaml:{
                cnab240:{
                    cobranca: 'cobranca.yml'
                },
                cnab400: {
                    cobranca: 'cobranca.yml'
                }
            },
            json: {

            }
        }
    }
};

// export const BANK = new Map<string, BankConfig>();
// BANK.set('bb',
//     {
//         name: 'bb',
//         code: '001',
//         layouts: {
//             yaml: {
//                 cnab240: {
//                     cobranca_087: 'cobranca.yml',
//                     cobranca_por_email_087:
//                         'cobranca_por_email.yml'
//                 }
//                 ,
//                 cnab400: {
//                     cobranca_cbr641_7digitos: 'cobranca_convenio_7_digitos.yml'
//                 }
//             },
//             json: {}
//         }
//     });

// {
//   bb: {
//     code: '001',
//     layouts: {
//       yaml: {
//         cnab240:{
//           cobranca_087:'cobranca.yml',
//           cobranca_por_email_087:'cobranca_por_email.yml'
//         },
//         cnab400:{
//           cobranca_cbr641_7digitos:'cobranca_convenio_7_digitos.yml'
//         }
//       },
//       json: {
//
//       }
//     },
//     remessa: {
//       400: ['header_arquivo', 'detalhe']
//     },
//     retorno: {
//       400: ['header_arquivo', 'detalhe', 'trailer_arquivo']
//     }
//   },
//   santander: {
//     code: '033',
//     remessa: {
//       400: ['header_arquivo', 'detalhe', 'trailer_arquivo']
//     }
//   },
//   banrisul: {
//     code: '041',
//     retorno: {
//       400: ['header_arquivo', 'detalhe', 'trailer_arquivo']
//     }
//   },
//   caixa: {
//     code: '104',
//     remessa: {
//       400: ['header_arquivo', 'detalhe', 'trailer_arquivo']
//     },
//     retorno: {
//       400: ['header_arquivo', 'detalhe', 'trailer_arquivo']
//     }
//   },
//   bradesco: {
//     code: '237',
//     remessa: {
//       400: ['header_arquivo', 'detalhe', 'trailer_arquivo']
//     }
//   },
//   itau: {
//     code: '341',
//     retorno: {
//       400: ['header_arquivo', 'detalhe', 'trailer_arquivo']
//     }
//   },
//   bancoob: {
//     code: '756',
//     remessa: {
//       400: ['header_arquivo', 'detalhe', 'trailer_arquivo']
//     },
//     retorno: {
//       400: ['header_arquivo', 'detalhe', 'trailer_arquivo']
//     }
//   }
// };
