import crypto from 'crypto'

const key = Buffer.from(process.env.ENCRYPTION_KEY!, 'base64')

export function encrypt(text: string): string {
  const iv = crypto.randomBytes(12)
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv)

  const encrypted = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()])
  const tag = cipher.getAuthTag()

  return Buffer.concat([iv, tag, encrypted]).toString('base64')
}

export function decrypt(encryptedData: string): string {
  const data = Buffer.from(encryptedData, 'base64')
  const iv = data.slice(0, 12)
  const tag = data.slice(12, 28)
  const encrypted = data.slice(28)

  const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv)
  decipher.setAuthTag(tag)

  const decrypted = decipher.update(encrypted, undefined, 'utf8') + decipher.final('utf8')
  return decrypted
}
