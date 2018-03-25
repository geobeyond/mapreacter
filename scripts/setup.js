import 'jsdom-global/register'; //at the top of file , even  , before importing react
import React from 'react';
import jsdom from 'jsdom';

Object.defineProperty(window, 'config', {
    value: {
        basemaps: ['mapbox', 'osm'],
        mapbox: {
            type: 'raster',
            style: 'mapbox.satellite',
            token: 'pk.eyJ1IjoibWlsYWZyZXJpY2hzIiwiYSI6ImNqOHk3YXJibTFwbTkycW9iM2JkMGVzbnEifQ.TKtR_oqVfT3bR7kEAPxK7w',
        },
        map: {
            center: [12, 42],
            zoom: 6
        },
        viewparams: ['order_', 'family', 'genus', 'nome_scientifico'],
        source: 'http://193.206.192.107/geoserver/wms?SERVICE=WMS&VERSION=1.1.0&REQUEST=GetMap&FORMAT=image/png&TRANSPARENT=true',
        layers: ['nnb:param_oss_polig4', 'nnb:param_dist_geom4', 'nnb:param_oss_point4'],
        tassonomiaserviceurl: 'http://193.206.192.107/MyRestServer/tassonomia?name=',
        geoserverurl: 'http://193.206.192.107/geoserver',
        routing: [
            { field: 'order_', label: 'orderlabel', routinglevel: '/' },
            { field: 'family', label: 'familylabel', routinglevel: '/*/' },
            { field: 'genus', label: 'genuslabel', routinglevel: '/*/*/' },
            { field: 'nome_scientifico', label: 'specielabel', routinglevel: '/*/*/*/' },
        ],
        wpsserviceurl: 'http://193.206.192.107/geoserver/ows?strict:true',
        downloadCSVUrlParameters: '&outputFormat=CSV&PropertyName=nome_scientifico,anno,lat,lon',
        downloadShapefileUrlParameters: '&outputFormat=shape-zip',
        helpUrl: 'http://193.206.192.107/mapreacter-help/docs/',
        helpDoc: '/doc_mapreacter.html',
        messages: {
            it: {
                selectLanguage: 'lingua selezionata :',
                tassonomialabel: 'Tassonomia ...',
                sharetitle: 'per condividere la pagina, copia ed invia questo link:',
                helptitle: 'Guida in linea',
                close: 'CHIUDI',
                orderlabel: 'Ordine',
                familylabel: 'Famiglia',
                genuslabel: 'Genere',
                specielabel: 'Specie',
                line: 'Linea',
                polygon: 'Poligono'
            },
            en: {
                selectLanguage: 'language selected:',
                tassonomialabel: 'Taxonomy ...',
                sharetitle: 'in order to share the page, copy and send this link:',
                helptitle: 'Help on line',
                close: 'CLOSE',
                orderlabel: 'Order',
                familylabel: 'Family',
                genuslabel: 'Genus',
                specielabel: 'Species',
                line: 'Line',
                polygon: 'Polygon'
            }
        },
        ispraTheme: {
            spacing: {
                iconSize: 24,
                desktopGutter: 24,
                desktopGutterMore: 32,
                desktopGutterLess: 16,
                desktopGutterMini: 8,
                desktopKeylineIncrement: 64,
                desktopDropDownMenuItemHeight: 32,
                desktopDropDownMenuFontSize: 15,
                desktopDrawerMenuItemHeight: 48,
                desktopSubheaderHeight: 48,
                desktopToolbarHeight: 56
            },
            fontFamily: 'Roboto, sans-serif',
            palette: {
                primary1Color: '#00601d',
                primary2Color: '#0097a7',
                primary3Color: '#bdbdbd',
                accent1Color: '#ff4081',
                accent2Color: '#00601d',
                accent3Color: '#9e9e9e',
                textColor: '#ffffff',
                alternateTextColor: '#ffffff',
                canvasColor: '#00601d',
                borderColor: '#e0e0e0',
                disabledColor: '#ffffff4d',
                pickerHeaderColor: '#00bcd4',
                clockCircleColor: '#ffffffde',
                shadowColor: 'rgba(0, 0, 0, 1)',
            },
        }
    }
});