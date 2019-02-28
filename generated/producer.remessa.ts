import {
    Header_arquivo,
    Trailer_arquivo,
    Segmento_p,
    Segmento_q,
    Segmento_r,
    Segmento_s,
    Segmento_y01,
    Segmento_y50
} from './interface.remessa'

type TipoDetalhes = Segmento_p | Segmento_q | Segmento_r | Segmento_s | Segmento_y01 | Segmento_y50

class Cnab400Producer {
    detalhes: TipoDetalhes[] = [];
    header: Header_arquivo;
    trailer: Trailer_arquivo;

    constructor(
        header: Header_arquivo,
        trailer: Trailer_arquivo) {
        this.header = header;
        this.trailer = trailer;
    }

    addDetail = (detalhe: TipoDetalhes) => {
        this.detalhes.push(detalhe)
    };

    gerarRemessa = () => {

    }
}
