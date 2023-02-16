import { DOMImplementation, XMLSerializer } from 'xmldom';
import JsBarcode from 'jsbarcode'

function createBarcodeSvg(text, otherOptions = {}) {
    const xmlSerializer = new XMLSerializer();
    const document = new DOMImplementation().createDocument('http://www.w3.org/1999/xhtml', 'html', null);
    const svgNode = document.createElementNS('http://www.w3.org/2000/svg', 'svg');

    JsBarcode(svgNode, text, {
        xmlDocument: document,
        ...otherOptions
    });
    return xmlSerializer.serializeToString(svgNode);
}

export default createBarcodeSvg