import React from "react";

export default class Home extends React.Component {
    public render() {
        return (
            <div>
                <h2>Welcome</h2>
                <p>This website was created with Typescript, React, and the canvas element. You can look at the code on&nbsp;
                <a href="https://github.com/acarrab/PersonalWebsite">
                        Github
                </a>.
                </p>
                <p>This website is intended to be used as a testing ground for random things that I wanted to try in my free time. </p>
                <p>If you would like to take a gander at my resume, it is over&nbsp;
                    <a href="./Resume/Resume.pdf">here</a>
                </p>
            </div>
        );
    }
}
