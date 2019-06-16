import { apiStatus } from '../../../lib/util'
import { Router } from 'express'

module.exports = ({ config }) => {
  let applePayApi = Router()

  applePayApi.post('/paymentSession', (req, res) => {
    const { merchantId, merchantName } = config.extensions.applePay
    if (!merchantId || !merchantName) {
      apiStatus(res, 'No merchantIdentifier is available.', 500)
      return
    }

    const validationURL = req.body.validationURL
    if (!validationURL) {
      apiStatus(res, 'validationURL is required', 500)
      return
    }

    const origin = req.get('origin')
    const url = `https://${validationURL}/paymentSession` // Endpoint: POST https://<validation URL>/paymentSession
    const request = require('request')
    const fs = require('fs')
    const path = require('path')
    const appDir = path.dirname(require.main.filename)
    const merchIdentityCert = path.resolve(appDir, 'config/certificates/apple-pay-merchant-identity-certificate.cer')

    request({
      url,
      method: 'POST',
      cert: fs.readFileSync(merchIdentityCert),
      key: fs.readFileSync(merchIdentityCert),
      json: true,
      body: {
        merchantIdentifier: merchantId,
        displayName: merchantName,
        initiative: 'web',
        initiativeContext: origin // Fully qualified domain name associated with your Apple Pay Merchant Identity Certificate.
      }
    }, (error, response, body) => {
      if (error) {
        apiStatus(res, error, 500)
      } else {
        apiStatus(res, body, 200)
      }
    })
  })

  return applePayApi
}
