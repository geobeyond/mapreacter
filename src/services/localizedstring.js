//import React, { Component } from 'react';
import LocalizedStrings from 'react-localization';
require('dotenv').config();

export const mylocalizedstrings = new LocalizedStrings(window.config.messages);

mylocalizedstrings.setLanguage('it');  