import React from "react";

export default function About() {
    return (
        <div>
            <h1>Angelo Carrabba</h1>
            <p>
                Angelo is a computer science student who tends to focus on research related work,
                    but really enjoys the software development process and the fun that comes from building
                    cool stuff at a large scale.
                </p>
            <p>
                He has dabbled in web development, problems on HackerRank, but gets caught up on fun projects that
                    are encountered through school. Here is my&nbsp;
                    <a href="./Resume/Resume.pdf">Resume</a> and there is other random stuff below.
                </p>
            <h2>This Website Information</h2>
            <h4>Node Navigation Representation</h4>
            <p>
                This website uses TypeScript, React, and Bootstrap (although just plain Bootstrap and not react-bootstrap).
                    I made some modules in order to represent the website pages as a graph. While this is not particularly useful,
                    it was useful for at least learning how to use react at a relatively basic level and was fun to create and
                    wire up.
                </p>
            <h4>Nodes and Graph Creation</h4>
            <p>
                The graph of the website pages is created through a basic adjacency matrix of the pages. It then uses a
                    depth first search to assign depths to the directed graphs nodes. Using these depths, when drawing you can
                    draw the back path, which is the highlighted orange on the graph. This is done by doing a breadth first search
                    from current node and looking for inversions in the depths between two nodes from the original depth when drawing.
                </p>
            <h4>Canvas use Specifics and Explanation</h4>
            <p>
                The website uses the html canvas object in order to create 2d graphics that represent the website. This called
                    for the creation of a process object in order to run the drawing process. The code is object oriented through
                    the use of TypeScript.
                </p>
            <h2>Wizard Game</h2>
            <hr />
            <p>
                This wizard game that was made from the game engine level for my course in 2d game engine design.
                    I used some fun geometry in order to create a capturing zone that places the particle objects
                    flying around the characters gem onto a rotating vector of the particles.
                    I also drew my sprites based off another wizard game, if you can tell which one!
                    </p>
            <video width="100%" height="240" controls>
                <source src="./Resources/WizardGame.mp4" type="video/mp4" />
                Your browser does not support the video tag.
            </video>
            <h2>~ More to come ~</h2>
        </div >
    );
}
