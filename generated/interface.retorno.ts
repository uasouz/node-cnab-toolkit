interface Retorno_cobranca {
    header_arquivo: Header_arquivo;
    header_lote: Header_lote;
    segmento_t: Segmento_t;
    segmento_u: Segmento_u;
    segmento_y01: Segmento_y01;
    segmento_y50: Segmento_y50;
    trailer_lote: Trailer_lote;
    trailer_arquivo: Trailer_arquivo;
}
interface Header_arquivo {
    codigo_banco: number;
    lote_servico: number;
    tipo_registro: number;
    exclusivo_febraban_01: string;
    tipo_inscricao: number;
    numero_inscricao: number;
    codigo_convenio: string;
    agencia: number;
    verificador_agencia: string;
    conta: number;
    verificador_conta: string;
    verificador_agencia_conta: string;
    nome_empresa: string;
    nome_banco: string;
    exclusivo_febraban_02: string;
    codigo_remessa_retorno: number;
    data_geracao: number;
    hora_geracao: number;
    numero_sequencial: number;
    versao_layout: number;
    densidade_gravacao: number;
    reservado_banco_01: string;
    reservado_empresa_01: string;
    exclusivo_febraban_03: string;
}
interface Header_lote {
    codigo_banco: number;
    lote_servico: number;
    tipo_registro: number;
    tipo_operacao: string;
    tipo_servico: number;
    exclusivo_febraban_01: string;
    versao_layout: number;
    exclusivo_febraban_02: string;
    tipo_inscricao: number;
    numero_inscricao: number;
    codigo_convenio: string;
    agencia: number;
    verificador_agencia: string;
    conta: number;
    verificador_conta: string;
    verificador_agencia_conta: string;
    nome_empresa: string;
    mensagem_01: string;
    mensagem_02: string;
    numero_sequencial: number;
    data_gravacao: number;
    data_credito: number;
    exclusivo_febraban_03: string;
}
interface Segmento_t {
    codigo_banco: number;
    lote_servico: number;
    tipo_registro: number;
    numero_registro: number;
    codigo_segmento: string;
    exclusivo_febraban_01: string;
    codigo_movimento: number;
    agencia_mantenedora_conta: number;
    verificador_agencia_mantenedora: number;
    numero_conta: number;
    verificador_conta: number;
    verificador_agencia_conta: number;
    identificacao_titulo: string;
    codigo_carteira: number;
    numero_documento_cobranca: string;
    data_vencimento: number;
    valor_nominal: number;
    numero_banco: number;
    agencia_cobradora_recebedora: number;
    verificador_agencia_cobradora_recebedora: number;
    identificacao_titulo_empresa: string;
    codigo_moeda: number;
    tipo_inscricao: number;
    numero_inscricao: number;
    nome: string;
    numero_contrato_operacao_credito: number;
    valor_tarifa_custas: number;
    identificacao_rejeicoes: string;
    exclusivo_febraban_02: string;
}
interface Segmento_u {
    codigo_banco: number;
    lote_servico: number;
    tipo_registro: number;
    numero_registro: number;
    codigo_segmento: string;
    exclusivo_febraban_01: string;
    codigo_movimento: number;
    juros_multa_encargos: number;
    valor_desconto_concedido: number;
    valor_abatimento_concedido: number;
    valor_iof: number;
    valor_pago: number;
    valor_liquido: number;
    outras_despesas: number;
    outros_creditos: number;
    data_ocorrencia: number;
    data_efetivacao_credito: number;
    codigo_ocorrencia: number;
    data_ocorrencia_2: number;
    valor_ocorrencia: number;
    complemento_ocorrencia: string;
    codigo_banco_correspondente_compensacao: number;
    nosso_numero_banco_correspondente: number;
    exclusivo_febraban_02: string;
}
interface Segmento_y01 {
    codigo_banco: number;
    lote_servico: number;
    tipo_registro: number;
    numero_registro: number;
    codigo_segmento: string;
    exclusivo_febraban_01: string;
    codigo_movimento: number;
    identificacao_registro: number;
    tipo_inscricao: number;
    numero_inscricao: number;
    nome_sacador_avalista: string;
    endereco: string;
    bairro: string;
    cep: number;
    sufixo_cep: number;
    cidade: string;
    uf: string;
    exclusivo_febraban_02: string;
}
interface Segmento_y50 {
    codigo_banco: number;
    lote_servico: number;
    tipo_registro: number;
    numero_registro: number;
    codigo_segmento: string;
    exclusivo_febraban_01: string;
    codigo_movimento: number;
    identificacao_registro: number;
    agencia_mantenedora: number;
    verificador_agencia_mantenedora: string;
    numero_conta: number;
    verificador_conta: string;
    verificador_agencia_conta: string;
    identificacao_produto: string;
    zeros: string;
    nosso_numero: string;
    digito_nosso_numero: string;
    codigo_calculo_rateio: number;
    tipo_valor: number;
    valor: number;
    codigo_banco_credito_benef: number;
    codigo_agencia_credito_benef: number;
    digito_agencia_credito_benef: string;
    conta_credito_beneficiario: number;
    digito_conta_credito_benef: string;
    digito_agencia_conta_benef: string;
    nome_beneficiario: string;
    identificacao_parcela_rateio: string;
    qtde_dias_credito_benef: number;
    data_credito_beneficiario: number;
    identificacao_rejeicoes: number;
    exclusivo_febraban_02: string;
}
interface Trailer_lote {
    codigo_banco: number;
    lote_servico: number;
    tipo_registro: number;
    exclusivo_febraban_01: string;
    quantidade_registros: number;
    quantidade_titulos_simples: number;
    valor_total_titulos_simples: number;
    quantidade_titulos_vinculada: number;
    valor_total_titulos_vinculada: number;
    quantidade_titulos_caucionada: number;
    valor_total_titulos_caucionada: number;
    quantidade_titulos_descontada: number;
    valor_total_titulos_descontada: number;
    numero_aviso: string;
    exclusivo_febraban_02: string;
}
interface Trailer_arquivo {
    codigo_banco: number;
    lote_servico: number;
    tipo_registro: number;
    exclusivo_febraban_01: string;
    quantidade_lotes: number;
    quantidade_registros: number;
    quantidade_contas: number;
    exclusivo_febraban_02: string;
}


export {Header_arquivo,Header_lote,Segmento_t,Segmento_u,Segmento_y01,Segmento_y50,Trailer_lote,Trailer_arquivo}