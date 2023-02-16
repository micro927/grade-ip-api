import PdfPrinter from "pdfmake";
import htmlToPdfmake from "html-to-pdfmake";
import { createWriteStream, readFileSync } from 'fs';
import { JSDOM } from "jsdom";
import { join } from "path"
import { createHash } from 'crypto'
const { window } = new JSDOM("");
import url from 'url';
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));


const createPdfFile = async (HTMLContent, fontFamily, fileName, otherOptions = {}) => {
    return new Promise((myResolve, myReject) => {
        const fontsDescriptorsPath = join(__dirname, 'fontsDescriptors.json')
        const fontsDescriptors = JSON.parse(readFileSync(fontsDescriptorsPath))

        if (fontsDescriptors[fontFamily]['normal'].split('.').pop() == 'ttf') {
            fontsDescriptors[fontFamily]['normal'] = join(__dirname, fontsDescriptors[fontFamily]['normal'])
            fontsDescriptors[fontFamily]['bold'] = join(__dirname, fontsDescriptors[fontFamily]['bold'])
            fontsDescriptors[fontFamily]['italics'] = join(__dirname, fontsDescriptors[fontFamily]['italics'])
            fontsDescriptors[fontFamily]['bolditalics'] = join(__dirname, fontsDescriptors[fontFamily]['bolditalics'])
        }

        const printer = new PdfPrinter(fontsDescriptors);
        const html = htmlToPdfmake(HTMLContent, { window: window, tableAutoSize: true });
        const docDefinition = {
            content: [
                html
            ],
            defaultStyle: {
                font: fontFamily
            },
            pageSize: 'A4',
            pageOrientation: 'portrait',
            pageMargins: [30, 40, 40, 30],
            ...otherOptions
        }


        const encodedFileName = createHash('sha256')
            .update(`pdf ${fileName}`)
            .digest('hex');
        const encodedFilePath = join(__dirname, '/temp/', encodedFileName + '.pdf')

        const now = new Date();
        const pdfDoc = printer.createPdfKitDocument(docDefinition);
        let writeStream = createWriteStream(encodedFilePath)
        pdfDoc.pipe(writeStream);
        pdfDoc.end();

        writeStream.on('finish', () => {
            myResolve({
                status: 'ok',
                path: encodedFilePath,
                time: (new Date() - now)
            })
        })

        writeStream.on("error", (err) => {
            myReject({
                status: 'error',
                message: err.message,
                time: (new Date() - now)
            })
        })
    })
}

export default createPdfFile