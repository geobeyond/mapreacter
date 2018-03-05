//import React, { Component } from 'react';
import LocalizedStrings from 'react-localization';
require('dotenv').config();

const theprops = JSON.parse(process.env.REACT_APP_MESSAGES);

/*export const mylocalizedstrings = new LocalizedStrings({
  it: {
    selectLanguage: "lingua selezionata :",
    tassonomialabel: "Tassonomia ...",
    sharetitle: "per condividere la pagina, copia ed invia questo link:",
    helptitle: "Guida in linea",
    close: "CHIUDI",
    phylumlabel: "Phylum",
    famiglialabel: "Famiglia",
    specielabel: "Specie",
  },
  en: {
    selectLanguage: "language selected:",
    tassonomialabel: "Taxonomy ...",
    sharetitle: "in order to share the page, copy and send this link:",
    helptitle: "Help on line",
    close: "CLOSE",
    phylumlabel: "Phylum",
    famiglialabel: "Family",
    specielabel: "Species",
  },
});*/

export const mylocalizedstrings = new LocalizedStrings(theprops);

mylocalizedstrings.setLanguage('it');  