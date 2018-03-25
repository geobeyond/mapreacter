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

export const downloadFile = (geoserverurl, layers, urlparameters) => {
    console.log("downloadFile()", geoserverurl, layers, urlparameters);
    layers.forEach(element => {
        const url = geoserverurl + '/ows?service=WFS&version=1.0.0&request=GetFeature' +
            urlparameters +
            '&typeName=' + element +
            '&viewparams=' + viewparams.join(';');

        if (urlparameters.includes('outputFormat=CSV')) {
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
        } else {
            var hiddenElement = document.createElement('a');
            hiddenElement.href = url;
            hiddenElement.target = '_blank';
            hiddenElement.download = element + '.zip';
            hiddenElement.click();
        }
    });
}
