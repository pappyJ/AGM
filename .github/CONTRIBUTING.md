# Contributing

Contributions are always welcome. Before contributing please read the [Code of Conduct](./CODE_OF_CONDUCT.md) section.

## Feature Requests

Feature requests should be captured through the repo's [issues](https://github.com/pappyJ/JLN/issues), with a description of the expected behavior, along with a use case. Please use a label that describes the nature of the issue.

Before opening an issue, please read through the [issues](https://github.com/pappyJ/JLN/issues); your issue may have already ben discussed or fixed in master.

## Areas of Contribution

This project is still very low-level and bare bones. There are a lot of different things that can be done to support the development of this repo:

1. Implement requested features
2. Correct typos or misplaced data in the dictionary json files
3. Write documentation on the project structure
4. Collaborate on creating a roadmap for the project
5. If you have any ideas reach out to [@pappyJ](https://github.com/pappyJ)

## Pull Request Process

### Before Opening a Pull Request

Double check to make sure that you have done the following things:

1. If implementing a feature request, create new unit tests to increase confidence of your changes.
    - **You're code will be unable to get merged without new unit tests**
2. Check to see if your changes are non-breaking by running `npm test`
3. And install or build dependencies are removed
    - You can run `npm run clean` to remove unwanted files.
4. Update the DEV.md with details of changes to the interface, this includes new environment
   variables, exposed ports, useful file locations and container parameters.

### After Opening a Pull Request

1. Open a pull request and assign at least two reviewers, [@pappyJ](https://github.com/pappyJ) and another community member.
2. You may merge the pull request in once the following things happen
    - All the tests pass against your branch build
    - You have the sign-off from both reviewers

## Coding Style

This project follows the [AirBnb JavaScript Style Guide](https://github.com/airbnb/javascript).
