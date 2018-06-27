import { viewparams } from '../actions/map';

var axios = require('axios');

export const downloadCSV = (geoserverurl, layers) => {


    layers.forEach(element => {
        const url = geoserverurl + '/ows?service=WFS&version=1.0.0&request=GetFeature&outputFormat=csv' +
            '&typeName=' + element +
            '&viewparams=' + viewparams.join(';');
        console.log("GET", url);
        axios.get(url)
            .then((response) => {
                console.log("response:", JSON.stringify(response.data));

                var hiddenElement = document.createElement('a');
                hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(response.data);
                hiddenElement.target = '_blank';
                hiddenElement.download = element + '.csv';
                hiddenElement.click();

            })
            .catch((error) => {
                console.error(error);
            });

    });
}

export const downloadShapefile = (geoserverurl, layers) => {


    layers.forEach(element => {
        const url = geoserverurl + '/ows?service=WFS&version=1.0.0&request=GetFeature&outputFormat=shape-zip' +
            '&typeName=' + element +
            '&viewparams=' + viewparams.join(';');

        var hiddenElement = document.createElement('a');
        hiddenElement.href = url;
        hiddenElement.target = '_blank';
        hiddenElement.download = element + '.zip';
        hiddenElement.click();

    });
}

export const downloadFile = (serviceurl, layers, filenameExtension, filter) => {
    if (!filter) {
        filter='';
    }
    layers.forEach(element => {
        let url = serviceurl.replace('<LAYER>', element).replace('<VIEWPARAMS>', viewparams.join(';')+filter);
        
        if (url.includes('outputFormat=CSV')) {
            console.log("downloadFile() GET", url);
            axios.get(url)
                .then((response) => {
                    console.log("downloadFile() navigator.msSaveBlob ->", navigator.msSaveBlob);
                    console.log("downloadFile() received", response.data.length, "bytes");
                    var blob = new Blob([response.data], { type: "text/csv" });

                    if ( navigator.msSaveBlob ) {                        
                        navigator.msSaveBlob(blob, element + filenameExtension);

                    } else {
                        var hiddenElement = document.createElement('a');
                        hiddenElement.href = window.URL.createObjectURL(blob);
                        hiddenElement.target = '_blank';
                        hiddenElement.download = element + filenameExtension;
                        console.log("downloadFile() hiddenElement:", hiddenElement);
                        document.body.appendChild(hiddenElement); // necessario x firefox
                        hiddenElement.click();                        
                        setTimeout(function(){
                            window.URL.revokeObjectURL(hiddenElement.href);  
                            document.body.removeChild(hiddenElement);
                        }, 100);
                    }
                })
                .catch((error) => {
                    console.error(error);
                });
        } else {
            console.log("downloadFile()", url);
            var hiddenElement = document.createElement('a');
            hiddenElement.href = url;
            hiddenElement.target = '_blank';
            hiddenElement.download = element + filenameExtension;
            console.log("downloadFile() hiddenElement:", hiddenElement);
            document.body.appendChild(hiddenElement); // necessario x firefox
            hiddenElement.click();
        }
    });
}
