# Changelog

## 1.2.0 (Signum Rebrand)

- Overall Rebranding for Signum
- Full support for new Address prefixes (S, TS)
- More preset nodes

### Bug Fixes
- Absolute Time in transaction list #1459
- Feedback when wrong pin entered
- minor improvements

## 1.1.0 (In Beta)

- PoC+ Mining Features
  - Add/Revoke Commitment
  - Refined Reward Assignment
- New face lifting
  - New splash screen
  - Changing bg images on pages
  - Hash icon
- Extended Address Support  
- Modernized Pages
  - Set Reward Recipient
  - Set Account Info
- Node Settings
  - Revisited Node List
  - Automatic Node Selection using new reliable nodes
- [CIP22 Deeplinking support started](../../DEEPLINKING.md)
  - Works for simple payments now 
- Many minor improvements for better usability
  - Colorful transaction table
  - Wrong PIN error message
  - and many more
  

### Bug fixes
- Market Info with true 24h change 
- Cleanup (#1408)
- Set Account Info (#412)

## 1.0.3

### New Feature
- Adding Testnet detection

### Bug Fixes
- Fixing issues with deep links (#1331, #1393)
- Fixed a subtle bug on node selection


## 1.0.2

### Bug Fixes
- Added Settings Option in File Menu for Desktop version (#1371)
- Updated image path for Performance widget on Dashboard

## 1.0.1

### Bug Fixes
- Increased QR Code size in sidebar (#1326)
- Fixed a bug preventing asset balances from updating (#1327)
- Fixed Windows platform name for New Version Dialog

## 1.0.0

### New Features:
- Asset View
- Added new Testnet Node Link 
- Added Fallback Link for Download

### Bug Fixes
- Fixed Initial Error Message


## 1.0.0-beta.14

### New Features:
- Revamped Dashboard Layout
    - New more powerful market info API
    - New Performance widget
    - Improved Balance Chart
    - Better responsiveness
    - Added EUR
- Using new Burst Symbol `Ƀ`
- Send BURST with standard fee (was lowest fee before)

### Bug Fixes:
- Fixed a bug account creation flow (#1275)


## 1.0.0-beta.13

### New Features:
- Added Block Time Graph to Blocks Page

### Bug Fixes:
- Fixed a bug with QR code generation
- Security updates

## 1.0.0-beta.12 

### New Features:
- Added Account Activation
- Improved UX for Account Creation Process 
- Account Manager with explicit actions (#700) 
- Removed Endpoint Setting
    - simplified node selection
    - automatic/dynamic peer version detection
- Language Selection for Mobile/Responsive version

## 1.0.0-beta.11

### New Features:
- Added support for sending BURST to .zil and .crypto domains

## 1.0.0-beta.10

### New Features:
- Improved Multi-out Payments with CSV upload (#238)
- Enhanced Node Selection
    - custom endpoint possible
    - dynamic version detection 
- Added ability to send hex messages with transactions (#696)
- Added Asset Transfer info in Tx details

### Bug Fixes:
- Improved some of Translations (pt-br, pt-pt, lt)
- Fixed Block Reward conversion in Block Details
- Fixed Message Handling on Multiout (#654)
- Fixed Fee issue for messages (#614)
- Fixed sending to unknown accounts (#645)
- Fixed an issue with unconfirmed transactions on the dashboard sometimes not showing up

## 1.0.0-beta.9

### New Features:
- Deep Linking
- Improved Node Selection (#604 #351)
- _Spend all_ on Send Burst (#553)
- Improved Layout for Transactions 
- Improved Layout for Blocks 
- Added Indicator while Downloading latest Update

### Bug Fixes:
- Fixed green/red transactions on dashboard (#523)
- Fixed MultiSameOut (#543)
- Fixed Update Issue on Windows
- Fixed QR Code Update on Account Change (#553)

## 1.0.0-beta.8

### New Features:
- Added ability to scan QR codes when sending BURST

### Bug Fixes:
- Corrected incomings/outgoings in Account Details

## 1.0.0-beta.7

### New Features:
- Update checker
- Auto Scaling of Balance Chart
- Improved Account Creation Flow
- More Translations
- New nodes
- Copy Address/Id
- Several layout tweaks

### Bug Fixes:
- Slider for Fee Selection
- CPU usage on particle screen
- "always encrypted" issue for messages
- Performance issues while loading accounts with many Tx
- Delete current account issue
- Several minor fixes

## 1.0.0-beta.6

### New Features:
- Added transaction count selector and smoothed the lines on the Balance History chart
- Added drop-down for Copy Account ID, Copy Address, and Set Account Info
- Added App Icons for mobile users who save the web app to their home screen

### Bug Fixes:
- Fixed a bug where sending burst to a new account would fail
- Improved display of transaction tables
- Improved performance of particleJS on new user page
- Improved styles on create new user flow for mobile

