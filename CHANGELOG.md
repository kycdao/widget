# Change Log

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).

## [0.6.0] - 2023-04-04

### Breaking

- Use `import { KycDaoWidget } from "@kycdao/widget"` to import the widget instead of `import { Widget } from "@kycdao/widget"`

### Changed

- Switch from `create-react-app` to `vite`

## [0.5.10] - 2023-03-10

### Changed

- Updated Core SDK version to 0.6.10 (improved automatic retries during EVM minting cost calculation)

## [0.5.9] - 2023-02-23

### Changed

- Updated deps
- Near shows the token, if already exist one

## [0.5.3] - 2023-02-23

### Fixed

- Final page related style issues

## [0.5.2] - 2023-02-23

### Added

- Twitter share button for a minted nft

## [0.5.1] - 2023-02-23

### Added

- Display already minted nft, if possible
- VerifyAccout page
- Closable error modals

### Fixed

- A lot of smaller error handling related bugs

## [0.5.0] - 2023-02-20

### Version bump

## [0.4.6] - 2023-02-19

### Added

- If the user has an nft on the currrent chain, they go to the final step instantly

### Fixed

- Font size related issue on taxresidence selector & minting

## [0.4.5] - 2023-02-17

### Added

- The returning flow doesn't trigger anymore on NEAR
- Version footer for the test page
- Version message

### Fixed

- A messageTargetOrigin related error
- An NFT selection page visual bug related to an NFT image padding
- Security issues in dependencies
- Freshly minted nft does not shown in some cases

## [0.4.4] - 2023-02-13

### Added

- Fatal error page & restart button
- Grant flow

### Fixed

- If a user is verified, then it set the agrement to be accepted
- Various other fixes & improvements

### Changed

- On the final page, the finish remains finish

## [0.4.3] - 2023-01-29

### Added

- Celo with metamask on the testpage

### Fixed

- NFT selection page related issues
- If the user cancels a transaction, it still navigates to the success page, just to show an empty page
- Various other fixes & improvements

## [0.4.2] - 2023-01-31

### Added

- Faucets list on the testpage
- KycDao discord link on the testpage

### Changed

- Update kycdao-sdk
- Update persona

### Fixed

- Modal backdrop is not disabling elements
- Use minting result as the nft image
