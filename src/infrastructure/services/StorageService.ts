import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from 'firebase/storage'
import { storage } from '@infrastructure/firebase/storage'
import { ENV } from '@shared/constants/env'

export type AssetFolder = 'images' | 'models' | 'thumbnails'

export interface UploadProgress {
  bytesTransferred: number
  totalBytes: number
  percentage: number
}

interface UploadHandle {
  readonly task: { cancel: () => void }
  readonly getUrl: () => Promise<string>
}

export class StorageService {
  private buildPath(tenantId: string, folder: AssetFolder, filename: string): string {
    return `tenants/${tenantId}/${folder}/${filename}`
  }

  upload(
    tenantId: string,
    folder: AssetFolder,
    file: File,
    onProgress?: (progress: UploadProgress) => void,
  ): UploadHandle {
    const { cloudName, uploadPreset } = ENV.cloudinary

    if (cloudName && uploadPreset) {
      return this.uploadToCloudinary(tenantId, folder, file, cloudName, uploadPreset, onProgress)
    }

    return this.uploadToFirebase(tenantId, folder, file, onProgress)
  }

  private uploadToCloudinary(
    tenantId: string,
    folder: AssetFolder,
    file: File,
    cloudName: string,
    uploadPreset: string,
    onProgress?: (progress: UploadProgress) => void,
  ): UploadHandle {
    let xhr: XMLHttpRequest | null = null
    let rejectUpload: ((reason: Error) => void) | null = null

    const getUrl = (): Promise<string> =>
      new Promise<string>((resolve, reject) => {
        rejectUpload = reject
        xhr = new XMLHttpRequest()

        xhr.open('POST', `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, true)

        if (onProgress) {
          xhr.upload.onprogress = (event) => {
            if (event.lengthComputable) {
              onProgress({
                bytesTransferred: event.loaded,
                totalBytes:       event.total,
                percentage:       Math.round((event.loaded / event.total) * 100),
              })
            }
          }
        }

        xhr.onload = () => {
          // safe: onload fires after xhr.open(), so xhr is always assigned here
          const req = xhr ?? new XMLHttpRequest()
          if (req.status >= 200 && req.status < 300) {
            try {
              const response = JSON.parse(req.responseText) as { secure_url: string }
              resolve(response.secure_url)
            } catch (parseErr) {
              reject(new Error(`Failed to parse Cloudinary response: ${String(parseErr)}`))
            }
          } else {
            reject(new Error(`Cloudinary upload failed (${req.status}): ${req.responseText}`))
          }
        }

        xhr.onerror = () => reject(new Error('Cloudinary network upload failed'))

        const formData = new FormData()
        formData.append('file', file)
        formData.append('upload_preset', uploadPreset)
        formData.append('folder', `tenants/${tenantId}/${folder}`)
        xhr.send(formData)
      })

    return {
      task:   { cancel: () => { xhr?.abort(); rejectUpload?.(new Error('Upload cancelled')) } },
      getUrl,
    }
  }

  private uploadToFirebase(
    tenantId: string,
    folder: AssetFolder,
    file: File,
    onProgress?: (progress: UploadProgress) => void,
  ): UploadHandle {
    const filename   = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`
    const storageRef = ref(storage, this.buildPath(tenantId, folder, filename))

    const task = uploadBytesResumable(storageRef, file, {
      contentType:    file.type,
      customMetadata: { tenantId, originalName: file.name },
    })

    if (onProgress) {
      task.on('state_changed', (snapshot) => {
        onProgress({
          bytesTransferred: snapshot.bytesTransferred,
          totalBytes:       snapshot.totalBytes,
          percentage:       Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100),
        })
      })
    }

    return {
      task:   { cancel: () => { void task.cancel() } },
      getUrl: () =>
        new Promise<string>((resolve, reject) => {
          task.then(
            () => getDownloadURL(storageRef).then(resolve).catch(reject),
            reject,
          )
        }),
    }
  }

  async delete(url: string): Promise<void> {
    // Cloudinary deletions require a signed request from the backend — skip on client
    if (url.includes('cloudinary.com')) return
    const fileRef = ref(storage, url)
    await deleteObject(fileRef)
  }
}
