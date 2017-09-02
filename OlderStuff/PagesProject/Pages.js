/* Auto-Generated from d "../WebsitePages"*/
/*
Website Structure: 
    - Home
        - AboutMe
        - Contact
        - Github
        - Projects
            - Personal
                - ComputerGraphics
                - IotControl
                - WebsiteInfo
                - DoorLockController
                - PortableEmacs
            - School
                - ClusterComputing
                - DataScience
                - PubsubArchitectureAnalysis
                - MultiRobotEnvironment
*/

var basePage = "Home";

var pages = {
    Home: {
        link: "#!/../WebsitePages/home.htm",
        title: "Home",
        edges: ["AboutMe","Contact","Github","Projects"]
    },
    AboutMe: {
        link: "#!/../WebsitePages/home/about_me.htm",
        title: "About Me",
        edges: []
    },
    Contact: {
        link: "#!/../WebsitePages/home/contact.htm",
        title: "Contact",
        edges: []
    },
    Github: {
        link: "#!/../WebsitePages/home/github.htm",
        title: "Github",
        edges: []
    },
    Projects: {
        link: "#!/../WebsitePages/home/projects.htm",
        title: "Projects",
        edges: ["Personal","School"]
    },
    Personal: {
        link: "#!/../WebsitePages/home/projects/personal.htm",
        title: "Personal",
        edges: ["ComputerGraphics","IotControl","WebsiteInfo","DoorLockController","PortableEmacs"]
    },
    ComputerGraphics: {
        link: "#!/../WebsitePages/home/projects/personal/computer_graphics.htm",
        title: "Computer Graphics",
        edges: []
    },
    IotControl: {
        link: "#!/../WebsitePages/home/projects/personal/IOT_control.htm",
        title: "Iot Control",
        edges: []
    },
    WebsiteInfo: {
        link: "#!/../WebsitePages/home/projects/personal/website_info.htm",
        title: "Website Info",
        edges: []
    },
    DoorLockController: {
        link: "#!/../WebsitePages/home/projects/personal/door_lock_controller.htm",
        title: "Door Lock Controller",
        edges: []
    },
    PortableEmacs: {
        link: "#!/../WebsitePages/home/projects/personal/portable_emacs.htm",
        title: "Portable Emacs",
        edges: []
    },
    School: {
        link: "#!/../WebsitePages/home/projects/school.htm",
        title: "School",
        edges: ["ClusterComputing","DataScience","PubsubArchitectureAnalysis","MultiRobotEnvironment"]
    },
    ClusterComputing: {
        link: "#!/../WebsitePages/home/projects/school/cluster_computing.htm",
        title: "Cluster Computing",
        edges: []
    },
    DataScience: {
        link: "#!/../WebsitePages/home/projects/school/data_science.htm",
        title: "Data Science",
        edges: []
    },
    PubsubArchitectureAnalysis: {
        link: "#!/../WebsitePages/home/projects/school/pubsub_architecture_analysis.htm",
        title: "Pubsub Architecture Analysis",
        edges: []
    },
    MultiRobotEnvironment: {
        link: "#!/../WebsitePages/home/projects/school/multi_robot_environment.htm",
        title: "Multi Robot Environment",
        edges: []
    }
};

var pageTree = {
    Home: {
        link: "#!/../WebsitePages/home.htm",
        title: "Home",
        to: {
            AboutMe: {
                link: "#!/../WebsitePages/home/about_me.htm",
                title: "About Me",
                to: {
                }
            },
            Contact: {
                link: "#!/../WebsitePages/home/contact.htm",
                title: "Contact",
                to: {
                }
            },
            Github: {
                link: "#!/../WebsitePages/home/github.htm",
                title: "Github",
                to: {
                }
            },
            Projects: {
                link: "#!/../WebsitePages/home/projects.htm",
                title: "Projects",
                to: {
                    Personal: {
                        link: "#!/../WebsitePages/home/projects/personal.htm",
                        title: "Personal",
                        to: {
                            ComputerGraphics: {
                                link: "#!/../WebsitePages/home/projects/personal/computer_graphics.htm",
                                title: "Computer Graphics",
                                to: {
                                }
                            },
                            IotControl: {
                                link: "#!/../WebsitePages/home/projects/personal/IOT_control.htm",
                                title: "Iot Control",
                                to: {
                                }
                            },
                            WebsiteInfo: {
                                link: "#!/../WebsitePages/home/projects/personal/website_info.htm",
                                title: "Website Info",
                                to: {
                                }
                            },
                            DoorLockController: {
                                link: "#!/../WebsitePages/home/projects/personal/door_lock_controller.htm",
                                title: "Door Lock Controller",
                                to: {
                                }
                            },
                            PortableEmacs: {
                                link: "#!/../WebsitePages/home/projects/personal/portable_emacs.htm",
                                title: "Portable Emacs",
                                to: {
                                }
                            }
                        }
                    },
                    School: {
                        link: "#!/../WebsitePages/home/projects/school.htm",
                        title: "School",
                        to: {
                            ClusterComputing: {
                                link: "#!/../WebsitePages/home/projects/school/cluster_computing.htm",
                                title: "Cluster Computing",
                                to: {
                                }
                            },
                            DataScience: {
                                link: "#!/../WebsitePages/home/projects/school/data_science.htm",
                                title: "Data Science",
                                to: {
                                }
                            },
                            PubsubArchitectureAnalysis: {
                                link: "#!/../WebsitePages/home/projects/school/pubsub_architecture_analysis.htm",
                                title: "Pubsub Architecture Analysis",
                                to: {
                                }
                            },
                            MultiRobotEnvironment: {
                                link: "#!/../WebsitePages/home/projects/school/multi_robot_environment.htm",
                                title: "Multi Robot Environment",
                                to: {
                                }
                            }
                        }
                    }
                }
            }
        }
    }
};

var app = null;
(function(){
    app = angular.module("mainApp", ["ngRoute"]);
    app.config(function($routeProvider, $locationProvider) {
        $routeProvider
            .when("/", { templateUrl: "../WebsitePages/home.htm" })
            .when("/../WebsitePages/home.htm", { templateUrl: "../WebsitePages/home.htm" })
            .when("/../WebsitePages/home/about_me.htm", { templateUrl: "../WebsitePages/home/about_me.htm" })
            .when("/../WebsitePages/home/contact.htm", { templateUrl: "../WebsitePages/home/contact.htm" })
            .when("/../WebsitePages/home/github.htm", { templateUrl: "../WebsitePages/home/github.htm" })
            .when("/../WebsitePages/home/projects.htm", { templateUrl: "../WebsitePages/home/projects.htm" })
            .when("/../WebsitePages/home/projects/personal.htm", { templateUrl: "../WebsitePages/home/projects/personal.htm" })
            .when("/../WebsitePages/home/projects/personal/computer_graphics.htm", { templateUrl: "../WebsitePages/home/projects/personal/computer_graphics.htm" })
            .when("/../WebsitePages/home/projects/personal/IOT_control.htm", { templateUrl: "../WebsitePages/home/projects/personal/IOT_control.htm" })
            .when("/../WebsitePages/home/projects/personal/website_info.htm", { templateUrl: "../WebsitePages/home/projects/personal/website_info.htm" })
            .when("/../WebsitePages/home/projects/personal/door_lock_controller.htm", { templateUrl: "../WebsitePages/home/projects/personal/door_lock_controller.htm" })
            .when("/../WebsitePages/home/projects/personal/portable_emacs.htm", { templateUrl: "../WebsitePages/home/projects/personal/portable_emacs.htm" })
            .when("/../WebsitePages/home/projects/school.htm", { templateUrl: "../WebsitePages/home/projects/school.htm" })
            .when("/../WebsitePages/home/projects/school/cluster_computing.htm", { templateUrl: "../WebsitePages/home/projects/school/cluster_computing.htm" })
            .when("/../WebsitePages/home/projects/school/data_science.htm", { templateUrl: "../WebsitePages/home/projects/school/data_science.htm" })
            .when("/../WebsitePages/home/projects/school/pubsub_architecture_analysis.htm", { templateUrl: "../WebsitePages/home/projects/school/pubsub_architecture_analysis.htm" })
            .when("/../WebsitePages/home/projects/school/multi_robot_environment.htm", { templateUrl: "../WebsitePages/home/projects/school/multi_robot_environment.htm" });
        });
    })();
