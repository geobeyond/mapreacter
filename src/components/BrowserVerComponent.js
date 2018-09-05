import React, { Component } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogTitle';
// eslint-disable-next-line
import DialogActions from '@material-ui/core/DialogActions';
// eslint-disable-next-line
import Button from '@material-ui/core/Button';
// eslint-disable-next-line
import { mylocalizedstrings } from '../services/localizedstring';

const theBrowserList = [
    {
        name: "Edge",
        minver: Number(16.0),
    },
    {
        name: "Chrome",
        minver: Number(57.0),
    },
    {
        name: "Safari",
        minver: Number(602.0),  // questa è la "webkit version" e corrisponde a Safari 10.0 
    },
    {
        name: "Opera",
        minver: Number(44.0),
    },
    {
        name: "Firefox",
        minver: Number(52.0),
    },
    {
        name: "MSIE",
        minver: Number(0),
    }
];

export var theBrowserItem;
export var theBrowserVersion;

try {
    //console.log("browser,  Browser CodeName: ", navigator.appCodeName);
    //console.log("browser,  Browser Name: ", navigator.appName);
    //console.log("browser,  Browser Version: ", navigator.appVersion);
    console.log("BrowserVerComponent() Cookies Enabled: ", navigator.cookieEnabled);
    console.log("BrowserVerComponent() Browser Language: ", navigator.language);
    console.log("BrowserVerComponent() Browser Online: ", navigator.onLine);
    console.log("BrowserVerComponent() Platform: ", navigator.platform);
    console.log("BrowserVerComponent() User-agent header: ", navigator.userAgent);

    theBrowserItem = theBrowserList.find(function (element) {
        return navigator.userAgent.indexOf(element.name) > -1;
    });

    let userAgentRecord = navigator.userAgent.split(" ").find(function (element) {
        return element.indexOf(theBrowserItem.name) > -1;
    });
    let fullversion = userAgentRecord.split("/")[1];
    while (!Number(fullversion)) {
        fullversion = fullversion.substr(0, fullversion.lastIndexOf("."));
    }
    theBrowserVersion = Number(fullversion);
    console.log("BrowserVerComponent() detected:", JSON.stringify(theBrowserItem), theBrowserVersion);
} catch (error) {
    theBrowserVersion = Number(0);
    theBrowserItem = {
        name: "",
        minver: Number(-1),
    }
}

class BrowserVerComponent extends Component {

    state = {
        sharedialog: false,
    };

    handleCloseMenu = () => {
        console.log("TocComponent.handleCloseMenu()");
        this.setState({ sharedialog: false });
    };

    componentDidMount() {
        if (theBrowserVersion < theBrowserItem.minver) {
            this.setState({ sharedialog: true });
        }
    }

    render() {
        console.log("BrowserVerComponent.render()");
        return (
            <Dialog open={this.state.sharedialog} >
                <DialogContent style={{ 
                    //padding: '10px' 
                }}>
                    <h2>Attenzione</h2>
                    <p>
                        il browser corrente ({theBrowserItem.name} {theBrowserVersion})
                        non è compatibile con l’applicazione, per una corretta visualizzazione è necessario
                        eseguire l’aggiornamento alla versione {theBrowserItem.minver} o successive
                    </p>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => { this.handleCloseMenu(); }}>
                        {mylocalizedstrings.close}
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }
}

export default BrowserVerComponent;

