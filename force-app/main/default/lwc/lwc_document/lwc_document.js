import { api, LightningElement, track, wire } from 'lwc';
import getCurrentAccountInfos from '@salesforce/apex/AccountHandler.getCurrentAccountInfos';
import { loadScript } from 'lightning/platformResourceLoader';
import JQUERY from '@salesforce/resourceUrl/jquery';
import JSPDF from '@salesforce/resourceUrl/jspdf';


export default class Lwc_document extends LightningElement {

    @api
    recordId;
    @track
    account;
    isAccountPopulated = false;
    textFile = null;

    connectedCallback() {
        console.log(this.recordId);
        getCurrentAccountInfos({ recordId: this.recordId }).then(acc => {
            this.account = acc;
            this.isAccountPopulated = true;
            console.log(JSON.stringify(this.account));
        }).catch(err => {
            console.log(err);
        })
    }

    isRendered = false;
    renderedCallback() {
        console.log(this.recordId);
        if (!this.isRendered) {
            Promise.all([
                loadScript(this, JQUERY)
              ])
                .then(() => {
                    console.log('js load');
                    window.print();
                }).catch(error => {
                    console.log('eror loading script ');
                    console.log(JSON.stringify(error));
                    console.log(error);
                });
        }
        this.isRendered = true;
    }


    loadPDF() {

        var divContents = $(this.template.querySelector('.container')).html();
        var printWindow = window.open('', '', 'height=400,width=800');
        printWindow.document.write('<html><head><title>DIV Contents</title>');
        printWindow.document.write('</head><body >');
        printWindow.document.write(divContents);
        printWindow.document.write('</body></html>');
        printWindow.document.close();
        printWindow.print();

    }



}