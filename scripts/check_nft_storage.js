const { NFTStorage } = require('nft.storage')
require('dotenv').config()

const token = process.env.NFT_STORAGE_API_KEY || '6bae6ed4.d516462347a44ccd891a4aabbd0f40e04'

async function check() {
    const client = new NFTStorage({ token })
    console.log('Checking NFT.Storage account with token:', token.substring(0, 10) + '...')

    try {
        // Try to list existing uploads to see if the key is active
        let count = 0
        for await (const upload of client.list()) {
            count++
            if (count === 1) {
                console.log('✅ Found existing uploads. Latest:', upload.cid)
            }
        }
        console.log(`📊 Total uploads found: ${count}`)
        console.log('✅ Connection successful. The API key is active.')

        if (count === 0) {
            console.log('ℹ️ No uploads found. This could mean the account is new or empty.')
        }

        console.log('\nNote: NFT.Storage has recently moved to a new model. If you encounter errors during upload, you may need to check your account on https://nft.storage/ for the latest status or to purchase storage credits.')

    } catch (error) {
        console.error('❌ Error checking NFT.Storage:', error.message)
        if (error.message.includes('401') || error.message.includes('Unauthorized')) {
            console.log('🚨 API Key appears to be invalid or expired.')
        } else if (error.message.includes('503')) {
            console.log('⚠️ Service might be down or decommissioned for this account type.')
        }
    }
}

check()
