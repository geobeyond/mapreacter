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
    }
];

export var theBrowserItem = { name: "" };
export var theBrowserVersion = "";


class BrowserVerComponent extends Component {

    state = {
        sharedialog: false, 
        theMessage: ""
    };

    handleCloseMenu = () => {
        console.log("TocComponent.handleCloseMenu()");
        this.setState({ sharedialog: false });
    };

    componentDidMount() {

        //console.log("browser,  Browser CodeName: ", navigator.appCodeName);
        //console.log("browser,  Browser Name: ", navigator.appName);
        //console.log("browser,  Browser Version: ", navigator.appVersion);
        console.log("BrowserVerComponent.componentDidMount() Cookies Enabled: ", navigator.cookieEnabled);
        console.log("BrowserVerComponent.componentDidMount() Browser Language: ", navigator.language);
        console.log("BrowserVerComponent.componentDidMount() Browser Online: ", navigator.onLine);
        console.log("BrowserVerComponent.componentDidMount() Platform: ", navigator.platform);
        console.log("BrowserVerComponent.componentDidMount() User-agent header: ", navigator.userAgent);

        if (navigator.userAgent.indexOf("rv:11") > -1) {
            theBrowserItem = {
                name: "IE",
            }
            theBrowserVersion = Number(11);
            let theMessage = "il browser corrente (" + theBrowserItem.name + " " + theBrowserVersion + ") non è compatibile con l’applicazione ... " +
                "per una corretta visualizzazione è necessario utilizzare un browser di ultima generazione";
            this.setState({ sharedialog: true, theMessage });

        } else if (navigator.userAgent.indexOf("MSIE") > -1) {
            try {
                theBrowserItem = {
                    name: "MSIE",
                }
                let userAgentRecord = navigator.userAgent.split(";").find(function (element) {
                    return element.indexOf(theBrowserItem.name) > -1;
                });
                console.log("BrowserVerComponent.componentDidMount() userAgentRecord ->", userAgentRecord);
                let fullversion = userAgentRecord.split(" ")[2];
                console.log("BrowserVerComponent.componentDidMount() fullversion ->", fullversion);
                theBrowserVersion = Number(fullversion);
            } catch (error) {
            }
            let theMessage = "il browser corrente (" + theBrowserItem.name + " " + theBrowserVersion + ") non è compatibile con l’applicazione ... " +
                "per una corretta visualizzazione è necessario utilizzare un browser di ultima generazione";
            this.setState({ sharedialog: true, theMessage });

        } else {
            try {
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
                if (theBrowserVersion < theBrowserItem.minver) {
                    let theMessage = "il browser corrente (" + theBrowserItem.name + " " + theBrowserVersion + ") non è compatibile con l’applicazione, " +
                        "per una corretta visualizzazione è necessario eseguire l’aggiornamento alla versione " + theBrowserItem.minver + " o successive";
                    this.setState({ sharedialog: true, theMessage });
                }
            } catch (error) {
            }
        }
        console.log("BrowserVerComponent.componentDidMount() detected:", JSON.stringify(theBrowserItem), theBrowserVersion, this.state.sharedialog, this.state.theMessage);
    }

    render() {
        console.log("BrowserVerComponent.render()");
        return (
            <Dialog open={this.state.sharedialog} >
                <DialogContent style={{
                    //padding: '10px' 
                }}>
                    <h2>Attenzione</h2>
                    <p>{this.state.theMessage}</p>
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

