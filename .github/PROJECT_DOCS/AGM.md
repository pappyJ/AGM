AGM BACKEND
This is the default backend structure of AGM. All backend developers working on AGM are to follow this convention, rules and structure so as to achieve a unique, working and well-structured backend application.

FOLDERS 1. GITHUB (DEFAULT) - All the git rules for AGM. 2. NODE_MODULES (DEFAULT) - Where all the npm modules required AGM are located.

3. SRC - AGM modules and functionality are located here.

SRC FOLDERS 1. COMPONENTS
This is where all AGM components/resources is located.

    2. LIBRARIES
    - 	All the modules and functionality required for every component to work perfectly is located here.

    - 	All the folders would have an “index.js” file that exports the necessary modules and functionality.

    - 	All the folders would have a “helpers” folder where the functionality required to help the base module.

    1. API - All the json files are located here.

    2. CONFIG - AGM configurations are written in a environment file called ‘config.env’ and are exported through a file called ‘config.js’.

    3. CONTROLLERS

    4. ROUTES

    5. MODELS

    6. SERVICES - Publishers and Subscribers

    7. TESTS - TESTS Suits

    8. SHARED - All Shared utility files are located here

-           All the folders would have an “index.js” file that exports the necessary modules and 				functionality.

            a. CONSTANTS
            All the application constants would be located here.
            a. COMPONENTS - This is where the constant files are located.

            b. UTILS

    All the shared utilities would be located here.
    a. COMPONENTS - This is where the utils files are located.

            c. HELPERS

    All the shared helpers would be located here.

            9. VIEWS
