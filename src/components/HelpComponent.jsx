import React, { Component } from 'react';
import { mylocalizedstrings } from '../services/localizedstring';
import contentIt from '../help/help_it.html';
import contentEn from '../help/help_en.html';

class HelpComponent extends Component {
    render() {
        if (mylocalizedstrings.getLanguage() === 'it') {
            return (
                <div dangerouslySetInnerHTML={{ __html: contentIt }} />
            );
        } else {
            return (
                <div dangerouslySetInnerHTML={{ __html: contentEn }} />
            );
        }
    }
}

export default HelpComponent