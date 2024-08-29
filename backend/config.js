module.exports = {
   mysqlHost: "",
   user: "",
   password: ',
   database: "bline",
   mysqlPort: 3306,
   JWT_SECRET_KEY: '6dqw7dydyw7ewyuw',
   SESSION_EXPIRES_IN: '24h', // Session will expire after 1 day of creation
   imageUrl: 'https://infinity8.mypinata.cloud/ipfs/',
   cardanoAPI : "http://ec2-3-133-58-221.us-east-2.compute.amazonaws.com:3000/cardano-nft/mainnet/",
   // contract : "0x3BFc404ec73deb8d90ae07DEd3D6ee700C6963e3",
   // blockchainApiUrl: 'http://52.66.202.69:7002/api/testnet/',


   blockchainApiUrl: 'http://52.66.202.69:8080/api/testnet/',
   contractAddress: '0xA6f36cfcFee0d7ebDFBA1190b811a09e35A92ff4',



   

   // OLD KEY BEFORE UPDATE 20210617
   // contractOwnerAddress : '0xcf601e63906c587245b614baa8ad35a073cdee01', //live
   // contractOwnerPrivateKey : '0xbbb184aef7ee8e86998089c376069a8bb915bef5e6533645ec728deb44944b86', 

   // contractOwnerAddress : '0xB45F05cBC7614f50f31409Bec10e06cdFa0Bc168', //live
   // contractOwnerPrivateKey : '0x085db8f0ba24dbfb49ae9967533db2efc028a8812309f380c34fee96794261b1', 
   //circleApiKey : 'QVBJX0tFWTpjNDMyMTM0MzcxNzk1YWRlYjQzN2FmYjc2MDZiNzFjZjoxMTQyN2JlOTVjMjg1NzZlYzE4Yzg4ZjQ1NDgwNDA3OA=='

   stripe_key: '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', //live
   contractAddress: '0x72e194413Abb5d03E06D601D13821B13E6f179ce', //live
   // blockchainApiUrl: 'http://52.66.202.69:7005/api/testnet/', //mainnet
   ethTransferApiUrl: 'https://infinity8.io:8001/api/eth/mainnet/transfer',
   contractOwnerAddress: '0x66eCc596eAA391557a8105e335351aA76a242E93', //live
   apiKey: '=0XXxgDLygDL2gDL3cDL3YDLwkDL4ATMsYDOscDOsADMxwSN4wSO4wSNxEDLwkDLwcDL3gDL2gDL5QDLxcDLwATMskDOsYDOsATNscTOskTMxwCNwEDL2gDL2gDL3ETMsQDMxwSOwEDL4kDL1ATMsATOsAzNsATOsMzNsgzNskDMxwiM4wyN5wCMwEDL2gDL5gDL5ETMsUjNsgDOsIDOscTOsQDMxwSO2wSO5wiMyEDL5QDL3ATMsYDOsATOsQDMxwSM1wCN4wiM3wCM3wiNwEDL3gDL2ATMsAzNsYDMxwyM4wSO4wiN4wiN4wyN3wyNwEDLwATMsATMxwSO4wyN4wiMxEDL1gDLxATMsYDOsAjMxwSOwEDL3gDLyETMsYDOsYDOsczNskTMxwCMwEDL4ATMsYDOscTMxwCM5wSO0wCO5wSNwEDLwATMsgDMxwSN4wSN4wiN4wCM1wiM4wCMyEDLxgDL4ATMsQDOsQTMxwiM4wCN4wSMwEDL2gDLzUDLxcDL3kDL3ETMsQzNsAzNsgTOskTMxwCMwEDL3ATMskDOsAzNsITMxwCM3wCO5wyN4wCM5wCOwEDL3gDL4gDLygDLwcDL4kDLzgDLwcDL5ATMskDOsEzNsITMxwCOwEDL5kDL3gDL5QDLxcDL5kDL3kDL2gDLwUDL2gDL3ATMsgDMxwSN4wyN4wyN4wiM4wSM3wyN3wSNwEDLwkDL4ATMsQDOsgDNskTOsAzNsgTOscTOsgzNsgDMxwSO4wSMyEDLzcDL4ATMskTOscDOsQDMxwCOwEDL1gDL0ATMsATOsAzNsgTOscDOsQDMxwCM1wiN4wiNxEDLygDLycDL3gDL4gDLwkDL2gDL3gDLzUDLwkDL4ATMscTOscjNscTNsgDNsUDOsEzNsITMxwCM3wyN4wiN4wiMxEDL5ATMsMDOsITMxwCM5wCM3wyN3wyN5wiN4wCO0wiN4wyMxEDLwkDL3ATMsQDOsMDOsAjMxwSOwEDL3gDLzcDLwcDL3gDLygDL3ATMsADMxwCM3wCM5wCM3wiN2wSM1wSO5wyN4wCMyEDLxcDLwkDLxUDLwkDL2gDL3cDL1cDL4cDL2ATMsUDOsYDOsIDOskDMxwCN4wCOwEDL2gDL1gDL3cDLycDLwkDL4ATMsgTOsMDOsgzNsgDNsYDOsEzNsITMxwiN4wSO5wyN5wiN4wyNwEDL3gDL1ETMsADMxwCOwEDLygDL1cDLwATMsUDOscDOscTMxwiM4wCM1wyN5wCO3wCM3wiNwEDL3gDLzcDL2gDLwcDL4kDL3ATMscTNskjNsYDOsAjMxwSMxEDL4ATMskTOscDOsAjMxwSOwEDL1gDL2cDL0cDLwUDLygDL3gDL0ATMsUDOsYDOsYTMxwiN4wiMyEDL2gDLzgDLwcDLyITMsgTOsITNsATOsAzNsgTOskzNsADMxwCOwEDL2gDL0ETMsAzNsQDOsUDOscDOsAjMxwSOwEDL3gDLyETMsMTNsUDOsIDOsgTMxwCNwEDLxUDL2gDL2gDL0ATMsATNsgTOsgzNsAzNsYDMxwyN4wCNwEDL5QDL4QDL2gDLwITMsczNsYDOsQDOskjNsQzNscDMxwiM4wCM5wCMyEDL5ATMsQDOsADOsATOsgDMxwiN4wyM4wCNwEDL5QDL1gDL1ETMsITMxwCOwEDL2gzW6ISY0FGZiwiIyVmZmVnQiojIlBXe0Jye',
   netCentsAuthorization: 'Basic SVROSXBvTVB6SGpRRmcyYnlHeHliczNCc2NNdVZQUkI6NW1mdjk4aWlaQnhwSFFQRHdHc2FmOE9MUDdqbVZFaGs1UmNLQS1NVmFyWGZjS3dBT3pSbXRiTFo=',
   netCentshostedPaymentId: "3288",
   blockchainNetwork: 'mainnet',
   //  mailUrl:'https://infinity8.io/',
   mailUrl: 'http://espsofttech.org/bline/',
   explorerLink: 'https://espsofttech.tech/infinity8-explorer/',
   circleApiKey: 'QVBJX0tFWTpjNDMyMTM0MzcxNzk1YWRlYjQzN2FmYjc2MDZiNzFjZjoxMTQyN2JlOTVjMjg1NzZlYzE4Yzg4ZjQ1NDgwNDA3OA=='




   //  stripe_key:'sk_test_51IpRmeSD2c5qKNYTLUUaGtaPpALirAVmekLD0KHt5xNg3iWHEW0zBvdgtC4zv8YhQcH52Cw6wTfqf5akAwZo2Bn3002xvBslji', //test
   //  blockchainApiUrl :'https://infinity8.io:8001/api/erc1155/', //testnet
   //  ethTransferApiUrl : 'https://infinity8.io:8001/api/eth/testnet/transfer',
   //  contractAddress : '0xa2a4aaf57a0b720d7e7ede66aa906a4775d41449',// test
   //  contractOwnerAddress : '0xb1b3b9104c0ee3fc67626b50374509ad11ded0fd', //testnet
   //  contractOwnerPrivateKey : '0x20b92deda888f28125744885d57553975b69a7c1aea670467adf81f57a1bf1b4', 
   //  netCentsAuthorization : 'Basic VmdpRkZZNnZuallNdWVKdFlwbVJfVFF6LUJZVjA4U2E6YW5HUDlNc3NfeXNEbFlhM2xmYnlveUpzMFl6RzhBX2FsU1hWSlZIdkJ2Smg2MllUVHo4T05oVDg=',
   //  netCentshostedPaymentId: "3511",
   //  blockchainNetwork:'testnet',
   //  mailUrl : 'https://espsofttech.tech/infinity8/',
   //explorerLink: 'https://espsofttech.tech/infinity8-explorer/'


}
