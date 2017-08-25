import { getMuiTheme, lightBaseTheme, MuiThemeProvider } from "material-ui/styles";
import React from "react";

const lightMuiTheme = getMuiTheme(lightBaseTheme);

export default class Main extends React.Component {
    public render() {
        return (
            <MuiThemeProvider muiTheme={lightMuiTheme}>
                <h1>Hello from main</h1>
            </MuiThemeProvider>
        );
    }
}
