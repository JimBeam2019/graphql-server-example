// import ach from '@ach/ach';
import nach2 from 'nach2';
import moment from 'moment';
import fs from 'fs';

class AchModel{
    /**
     * 
     */
    static createAchFile() {
        console.log('Hello ACH!!');

        const file = new nach2.File({
            immediateDestination: '081000032',
            immediateOrigin: '123456789',
            immediateDestinationName: 'Some Bank',
            immediateOriginName: 'Your Company Inc',
            referenceCode: '#A000001',
        });
        const batch = new nach2.Batch({
            serviceClassCode: '220',
            companyName: 'Your Company Inc',
            standardEntryClassCode: 'WEB',
            companyIdentification: '123456789',
            companyEntryDescription: 'Trans Description',
            companyDescriptiveDate: moment(nach2.Utils.computeBusinessDay(8)).format('MMM D'),
            effectiveEntryDate: nach2.Utils.computeBusinessDay(8),
            originatingDFI: '081000032'
        });
        const entry = new nach2.Entry({
            receivingDFI: '081000210',
            DFIAccount: '5654221',
            amount: '175',
            idNumber: 'RAj##32b1kn1bb3',
            individualName: 'Luke Skywalker',
            discretionaryData: 'A1',
            transactionCode: '22'
        });

        const addenda = new nach2.EntryAddenda({
            paymentRelatedInformation: "0123456789ABCDEFGJIJKLMNOPQRSTUVWXYXabcdefgjijklmnopqrstuvwxyx"
        })
        entry.addAddenda(addenda);

        batch.addEntry(entry);
        file.addBatch(batch);

        file.generateFile(function (result) {
            fs.writeFile('NACHA.txt', result, function(err){
                if(err) console.log(err);

                // console.log(fileString);
                console.log('Result >>> \n', result);
            })
        })

        // console.log('ACH >>>>> ',file)

    }
}

export default AchModel;