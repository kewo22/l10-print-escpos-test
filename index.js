// Load HTTP module
const express = require('express');
const app = express();
const escpos = require('escpos');
escpos.Bluetooth = require('escpos-bluetooth');

const port = 1000;

app.get('/', (req, res) => {
    (async () => {
        console.log('Connecting.');
        try {
            const availablePrinters = await escpos.Bluetooth.findPrinters();
            console.log('Connecting..');
           
            const preferredPrinterName = 'SPP-R410';

            console.log('availablePrinters' + JSON.stringify(availablePrinters));

            const btPrinter =
                availablePrinters.find(p => p && p.name === preferredPrinterName);
            console.log('btPrinter' + JSON.stringify(btPrinter));
            // const btPrinter = availablePrinters[0];
            // console.log('btPrinter' + btPrinter);
            console.log('Connecting...');
            console.log('PRINTER DETECTED --->', btPrinter.name, btPrinter.address, btPrinter.channel);
            const bluetoothDevice = new escpos.Bluetooth('74:F0:7D:EF:93:4D', 1);
            const printer = new escpos.Printer(bluetoothDevice);
            bluetoothDevice.open((error) => {
                console.log(error)
                console.log('JOB STARTING');
                printer
                    .font('a')
                    .align('ct')
                    .style('bu')
                    .size(1, 1)
                    .text('The quick brown fox jumps over the lazy dog')
                    .text('敏捷的棕色狐狸跳过懒狗')
                    .barcode('1234567', 'EAN8')
                    .table(["One", "Two", "Three"])
                    .tableCustom([
                        { text: "Left", align: "LEFT", width: 0.33 },
                        { text: "Center", align: "CENTER", width: 0.33 },
                        { text: "Right", align: "RIGHT", width: 0.33 }
                    ])
                    .qrimage('https://github.com/song940/node-escpos', (err) => {
                        console.log(err)
                        this.cut();
                        this.close();
                        console.log('print job done');
                    });
            });
            // ----------- TEST-1 ----------
            // const device = await escpos.Bluetooth.getDevice('74:F0:7D:EF:93:4D', 1);
            // console.log('device', JSON.stringify(device))
            // const printer = await Printer.create(device);
            // console.log('device', JSON.stringify(printer))
            // await printer.text('hello');
            // await printer.cut();
            // await printer.close();
            // console.log('print job done');
            // ----------- TEST-1 ----------
        } catch (error) {
            console.log('error', error);
        }
    })();

   res.send({ title: 'GeeksforGeeks' });
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}!`)
});